from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from star_vault import ValidationError, load_curations, load_fixture_pages, reconcile_snapshot


def curation(repo_id: int, *, stage: str = "learned", tags: str = '["Agent", "规范"]', takeaway: str = "形成了一条可复用结论。") -> str:
    return f'''+++
repo_id = {repo_id}
category = "ai-agent"
resource_type = "collection"
stage = "{stage}"
tags = {tags}
note = "用于验证人工内容不会被事实层覆盖。"
related = []
updated_by_user_at = "2026-09-05"
+++

## 学习结论

- {takeaway}
'''


class CurationTests(unittest.TestCase):
    def snapshot(self):
        fetched = load_fixture_pages(ROOT / "tests" / "fixtures" / "github" / "stable")
        return reconcile_snapshot(
            None,
            fetched.items,
            username="jiapeiyang",
            api_version="2022-11-28",
            checked_at="2026-09-05T10:00:00Z",
            pages=fetched.pages,
        )[0]

    def test_valid_curation_loads_by_repo_id_after_rename(self):
        snapshot = self.snapshot()
        snapshot["repositories"][0]["full_name"] = "example/renamed"
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "101.md"
            path.write_text(curation(101), encoding="utf-8")
            loaded = load_curations(Path(directory), snapshot, ROOT / "config")
        self.assertIn(101, loaded)
        self.assertIn("可复用结论", loaded[101]["takeaway"])

    def test_learned_requires_takeaway(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "101.md"
            path.write_text(curation(101, takeaway="待补充"), encoding="utf-8")
            with self.assertRaisesRegex(ValidationError, "有效学习结论"):
                load_curations(Path(directory), self.snapshot(), ROOT / "config")

    def test_tags_are_limited_to_five(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "101.md"
            path.write_text(curation(101, stage="queued", tags='["a", "b", "c", "d", "e", "f"]'), encoding="utf-8")
            with self.assertRaisesRegex(ValidationError, "最多 5 个"):
                load_curations(Path(directory), self.snapshot(), ROOT / "config")

    def test_rejects_unknown_enum(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "101.md"
            path.write_text(curation(101, stage="invented"), encoding="utf-8")
            with self.assertRaisesRegex(ValidationError, "非法 stage"):
                load_curations(Path(directory), self.snapshot(), ROOT / "config")

    def test_rejects_missing_related_repo(self):
        text = curation(101, stage="queued").replace("related = []", "related = [999999]")
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "101.md"
            path.write_text(text, encoding="utf-8")
            with self.assertRaisesRegex(ValidationError, "不存在的 repo_id"):
                load_curations(Path(directory), self.snapshot(), ROOT / "config")


if __name__ == "__main__":
    unittest.main()
