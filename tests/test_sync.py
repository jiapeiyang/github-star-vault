from __future__ import annotations

import json
import io
import sys
import tempfile
import unittest
import urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from star_vault import atomic_write, fetch_star_pages, load_fixture_pages, reconcile_snapshot, stable_json, validate_snapshot


class SyncTests(unittest.TestCase):
    def setUp(self):
        self.fixture = ROOT / "tests" / "fixtures" / "github" / "stable"
        self.fetched = load_fixture_pages(self.fixture)
        self.now = "2026-09-05T10:00:00Z"

    def initial_snapshot(self):
        return reconcile_snapshot(
            None,
            self.fetched.items,
            username="jiapeiyang",
            api_version="2022-11-28",
            checked_at=self.now,
            pages=self.fetched.pages,
        )[0]

    def test_loads_all_fixture_pages(self):
        self.assertEqual(self.fetched.pages, 2)
        self.assertEqual(len(self.fetched.items), 3)

    def test_initial_import_is_valid_and_stable(self):
        first = self.initial_snapshot()
        second = reconcile_snapshot(
            first,
            self.fetched.items,
            username="jiapeiyang",
            api_version="2022-11-28",
            checked_at=self.now,
            pages=self.fetched.pages,
        )[0]
        self.assertEqual([], validate_snapshot(first))
        self.assertTrue(all(repo["discovered_in_initial_import"] for repo in first["repositories"]))
        self.assertEqual(stable_json(first), stable_json(second))

    def test_rename_new_missing_and_restar(self):
        previous = self.initial_snapshot()
        renamed = json.loads(json.dumps(self.fetched.items[0]))
        renamed["repo"]["full_name"] = "example/alpha-renamed"
        renamed["repo"]["html_url"] = "https://github.com/example/alpha-renamed"
        next_snapshot, summary = reconcile_snapshot(
            previous,
            [renamed, self.fetched.items[2]],
            username="jiapeiyang",
            api_version="2022-11-28",
            checked_at="2026-09-06T10:00:00Z",
            pages=1,
        )
        by_id = {repo["repo_id"]: repo for repo in next_snapshot["repositories"]}
        self.assertEqual("example/alpha-renamed", by_id[101]["full_name"])
        self.assertEqual("missing", by_id[102]["source_status"])
        self.assertEqual(1, summary["renamed"])
        self.assertEqual(1, summary["missing"])

        restarred, restarred_summary = reconcile_snapshot(
            next_snapshot,
            self.fetched.items,
            username="jiapeiyang",
            api_version="2022-11-28",
            checked_at="2026-09-07T10:00:00Z",
            pages=2,
        )
        self.assertEqual("starred", {repo["repo_id"]: repo for repo in restarred["repositories"]}[102]["source_status"])
        self.assertEqual(1, restarred_summary["restarred"])

    def test_rejects_unexpected_empty_result(self):
        previous = self.initial_snapshot()
        empty, _ = reconcile_snapshot(
            previous,
            [],
            username="jiapeiyang",
            api_version="2022-11-28",
            checked_at="2026-09-06T10:00:00Z",
            pages=1,
        )
        self.assertTrue(any("新集合为 0" in error for error in validate_snapshot(empty, previous=previous)))
        self.assertEqual([], validate_snapshot(empty, previous=previous, allow_empty=True))

    def test_atomic_write_replaces_complete_file(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "snapshot.json"
            path.write_text("old", encoding="utf-8")
            atomic_write(path, "new\n")
            self.assertEqual("new\n", path.read_text(encoding="utf-8"))
            self.assertEqual([], list(path.parent.glob("*.tmp")))

    def test_second_page_failure_leaves_existing_file_untouched(self):
        first_page = json.dumps([self.fetched.items[0]]).encode()

        class Response(io.BytesIO):
            def __init__(self, body, link):
                super().__init__(body)
                self.headers = {"Link": link}

            def __enter__(self):
                return self

            def __exit__(self, *_):
                self.close()

        calls = 0

        def opener(_request, timeout):
            nonlocal calls
            self.assertEqual(timeout, 30)
            calls += 1
            if calls == 1:
                return Response(first_page, '<https://api.github.com/next>; rel="next"')
            raise urllib.error.URLError("fixture page failure")

        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "repositories.json"
            path.write_text("old snapshot\n", encoding="utf-8")
            with self.assertRaisesRegex(RuntimeError, "第 2 页"):
                fetch_star_pages("jiapeiyang", "2022-11-28", opener=opener)
            self.assertEqual("old snapshot\n", path.read_text(encoding="utf-8"))

    def test_rejects_non_public_active_repository(self):
        snapshot = self.initial_snapshot()
        snapshot["repositories"][0]["visibility"] = "private"
        self.assertTrue(any("必须是 public" in error for error in validate_snapshot(snapshot)))


if __name__ == "__main__":
    unittest.main()
