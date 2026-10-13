"""编辑导读契约与真实目录的跨周生成/构建链路；所有写入均在临时目录。"""
from datetime import datetime, timedelta, timezone
from pathlib import Path
import copy
import json
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import build_catalog
import generate_weekly
from star_vault import ValidationError, parse_iso, read_json, stable_json
from weekly_catalog import load_weekly_archive, week_start
from weekly_reading import load_weekly_readings, weekly_with_readings
from verify_weekly_build import verify_weekly_build


class WeeklyReadingTests(unittest.TestCase):
    def setUp(self):
        self.archive = load_weekly_archive(ROOT / "data/weekly-issues.json")
        self.source = (ROOT / "content/weekly/2026-10-12.md").read_text()

    def test_reading_has_independent_date_and_cannot_rewrite_selection(self):
        before = copy.deepcopy(self.archive)
        projected = weekly_with_readings(self.archive, ROOT / "content/weekly")
        first = next(item for item in projected if item["id"] == "2026-10-12")
        self.assertEqual(first["reading"]["leadRepoId"], first["entries"][0]["repoId"])
        self.assertEqual(len(first["reading"]["connections"]), 2)
        self.assertIn("queueMicrotask", first["reading"]["contentMarkdown"])
        self.assertEqual(self.archive, before)
        with tempfile.TemporaryDirectory() as folder:
            without = weekly_with_readings(self.archive, Path(folder))
            self.assertTrue(all("reading" not in issue for issue in without))

    def test_bad_editorial_references_dates_sources_and_fields_are_rejected(self):
        invalid = [
            self.source.replace('issue_id = "2026-10-12"', 'issue_id = "2026-10-05"'),
            self.source.replace("lead_repo_id = 337237194", "lead_repo_id = 196552074"),
            self.source.replace('reviewed_at = "2026-10-13"', 'reviewed_at = "2999-01-01"'),
            self.source.replace('reviewed_at = "2026-10-13"', 'reviewed_at = "2026-10-01"'),
            self.source.replace("https://github.com/mechaniac/Map-of-Javascript", "javascript:alert(1)", 1),
            self.source.replace("repo_id = 48212104", "repo_id = 196552074"),
            self.source.replace("repo_id = 48212104", "repo_id = 1143767804"),
            self.source.replace('title = "沿着异步这条线，把三个收藏连起来"', 'title = "   "'),
            self.source.replace('issue_id = "2026-10-12"', 'stage = "done"\nissue_id = "2026-10-12"'),
        ]
        with tempfile.TemporaryDirectory() as folder:
            directory = Path(folder)
            for index, source in enumerate(invalid):
                with self.subTest(index=index):
                    (directory / "2026-10-12.md").write_text(source)
                    with self.assertRaises(ValidationError):
                        load_weekly_readings(directory, self.archive)

    def test_real_catalog_crosses_week_builds_and_preserves_history(self):
        real_archive_path = ROOT / "data/weekly-issues.json"
        real_bytes = real_archive_path.read_bytes()
        facts = read_json(ROOT / "data/repositories.json")
        base = max(week_start(parse_iso(facts["sync"]["checked_at"], "checked")),
                   datetime.fromisoformat(self.archive["issues"][-1]["id"]).date()) + timedelta(weeks=1)
        first_time = datetime.combine(base, datetime.min.time(), timezone.utc)
        before_monday = first_time + timedelta(days=6, hours=15, minutes=59, seconds=59)
        after_monday = before_monday + timedelta(seconds=1)
        with tempfile.TemporaryDirectory() as folder:
            directory = Path(folder)
            archive_path = directory / "weekly-issues.json"
            archive_path.write_bytes(real_bytes)
            site_dir = directory / "site"
            def generate(now):
                with patch.object(generate_weekly, "datetime") as clock, patch.object(sys, "argv", ["generate_weekly", "--archive", str(archive_path)]), patch.dict("os.environ", {"GITHUB_STEP_SUMMARY": ""}):
                    clock.now.return_value = now
                    self.assertEqual(generate_weekly.main(), 0)
            def build():
                with patch.object(sys, "argv", ["build_catalog", "--weekly-archive", str(archive_path), "--output-dir", str(site_dir / "data"), "--data-commit", "isolated-weekly-test"]):
                    self.assertEqual(build_catalog.main(), 0)
            generate(first_time)
            frozen = archive_path.read_bytes()
            stamp = archive_path.stat().st_mtime_ns
            generate(before_monday)
            self.assertEqual(archive_path.read_bytes(), frozen)
            self.assertEqual(archive_path.stat().st_mtime_ns, stamp)
            build()
            self.assertIn("status=current", verify_weekly_build(site_dir, archive_path=archive_path, now=before_monday))
            with self.assertRaisesRegex(ValidationError, "当期未生成"):
                verify_weekly_build(site_dir, archive_path=archive_path, now=after_monday)
            generate(after_monday)
            new_archive = load_weekly_archive(archive_path)
            self.assertEqual(new_archive["issues"][:-1], json.loads(frozen)["issues"])
            self.assertEqual(new_archive["issues"][-1]["id"], week_start(after_monday).isoformat())
            with self.assertRaisesRegex(ValidationError, "构建产物"):
                verify_weekly_build(site_dir, archive_path=archive_path, now=after_monday)
            build()
            self.assertIn("status=current", verify_weekly_build(site_dir, archive_path=archive_path, now=after_monday))
            catalog = read_json(site_dir / "data/catalog.json")
            self.assertNotIn("reading", catalog["weeklyIssues"][-1])
            self.assertIn("reading", catalog["weeklyIssues"][0])
            meta_path = site_dir / "data/build-meta.json"
            meta = read_json(meta_path)
            meta["dataSha256"] = "stale"
            meta_path.write_text(stable_json(meta))
            with self.assertRaisesRegex(ValidationError, "事实快照"):
                verify_weekly_build(site_dir, archive_path=archive_path, now=after_monday)
        self.assertEqual(real_archive_path.read_bytes(), real_bytes)

    def test_no_eligible_catalog_is_not_reported_as_a_missed_issue(self):
        facts = read_json(ROOT / "data/repositories.json")
        now = parse_iso(facts["sync"]["checked_at"], "checked") + timedelta(days=1)
        with tempfile.TemporaryDirectory() as folder:
            directory = Path(folder)
            empty_content = directory / "content"
            empty_content.mkdir()
            archive_path = directory / "weekly.json"
            site_dir = directory / "site"
            with patch.object(sys, "argv", ["build_catalog", "--content", str(empty_content), "--weekly-archive", str(archive_path),
                                          "--weekly-content", str(empty_content), "--output-dir", str(site_dir / "data")]):
                self.assertEqual(build_catalog.main(), 0)
            self.assertIn("status=no-eligible", verify_weekly_build(site_dir, content=empty_content, archive_path=archive_path,
                                                                   reading_dir=empty_content, now=now))
            self.assertFalse(archive_path.exists())


if __name__ == "__main__":
    unittest.main()
