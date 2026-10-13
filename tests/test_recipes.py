"""配方的引用、证据口径和离线构建边界。"""
import copy
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import test_curation
from test_curation import ROOT
from star_vault import ValidationError, make_catalog, read_json
from catalog_extras import load_topics
from recipe_catalog import load_recipes


def recipe():
    tool = {"role": "候选", "reason": "场景理由", "entry_url": "https://example.test/start",
            "requirements": ["前提"], "limitations": ["未执行"], "sources": ["https://example.test/readme"]}
    step = {"title": "步骤", "inputs": ["输入"], "actions": ["动作"], "outputs": ["产出"], "checks": ["检查"], "optional": False}
    return {"id": "test-recipe", "title": "测试配方", "summary": "用途", "topic_ids": ["tools"],
            "inputs": ["输入"], "outputs": ["产出"], "requirements": ["前提"],
            "reviewed_at": "2026-01-01", "sources": ["https://example.test/readme"], "evidence": "public-sources",
            "tools": [{**tool, "repo_id": 101}, {**tool, "repo_id": 103}],
            "steps": [{**step, "id": "choose", "tool_ids": [101, 103]}, {**step, "id": "prepare", "tool_ids": []}, {**step, "id": "check", "tool_ids": [], "optional": True}]}


class RecipeTests(unittest.TestCase):
    def load(self, items, version=1):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "recipes.json"
            path.write_text(json.dumps({"schema_version": version, "items": items}), encoding="utf-8")
            return load_recipes(path, {"repositories": [{"repo_id": 101}, {"repo_id": 103}]}, [{"id": "tools"}])

    def test_normalizes_contract_and_keeps_optional_steps(self):
        normalized = self.load([recipe()])[0]
        self.assertEqual(normalized["tools"][0]["repoId"], 101)
        self.assertEqual(normalized["steps"][0]["toolIds"], [101, 103])
        self.assertTrue(normalized["steps"][-1]["optional"])
        self.assertEqual(normalized["topicIds"], ["tools"])
        self.assertEqual(normalized["evidence"], "public-sources")

    def test_invalid_references_and_duplicates_report_field(self):
        cases = [
            (lambda r: r.update(topic_ids=["missing"]), "topic_ids"),
            (lambda r: r["tools"][0].update(repo_id=9999), "repo_id"),
            (lambda r: r["tools"][0].update(repo_id=True), "repo_id"),
            (lambda r: r["tools"].append(r["tools"][0]), "repo_id"),
            (lambda r: r["steps"][0].update(tool_ids=[101, 101]), "tool_ids"),
            (lambda r: r["steps"][0].update(tool_ids=[9999]), "tool_ids"),
            (lambda r: r["steps"][0].update(tool_ids=[101]), "tools"),
            (lambda r: r["steps"][1].update(id="choose"), "id"),
        ]
        for mutate, field in cases:
            with self.subTest(field=field):
                value = recipe(); mutate(value)
                with self.assertRaisesRegex(ValidationError, field): self.load([value])
        with self.assertRaisesRegex(ValidationError, "id"): self.load([recipe(), recipe()])

    def test_invalid_sources_dates_and_evidence_cannot_publish(self):
        cases = [
            (lambda r: r.update(reviewed_at="2026-02-30"), "reviewed_at"),
            (lambda r: r.update(reviewed_at="9999-01-01"), "reviewed_at"),
            (lambda r: r.update(reviewed_at=None), "reviewed_at"),
            (lambda r: r.update(evidence="tested"), "evidence"),
            (lambda r: r.update(sources=["javascript:alert(1)"]), "sources"),
            (lambda r: r["tools"][0].update(entry_url="https://example.test/\nattack"), "entry_url"),
            (lambda r: r["tools"][0].update(requirements=[""]), "requirements"),
            (lambda r: r["steps"][0].update(outputs=[]), "outputs"),
            (lambda r: r["steps"][0].update(optional="false"), "optional"),
            (lambda r: r.update(steps=r["steps"][:2]), "steps"),
        ]
        for mutate, field in cases:
            with self.subTest(field=field):
                value = recipe(); mutate(value)
                with self.assertRaisesRegex(ValidationError, field): self.load([value])
        with self.assertRaisesRegex(ValidationError, "schema_version"): self.load([recipe()], version=True)

    def test_old_catalog_and_missing_file_remain_supported(self):
        with tempfile.TemporaryDirectory() as directory:
            self.assertEqual(load_recipes(Path(directory) / "absent.json", {}, []), [])
        snapshot = test_curation.CurationTests().snapshot()
        before = copy.deepcopy(snapshot)
        normalized = self.load([recipe()])
        self.assertEqual(make_catalog(snapshot, {}, ROOT / "config")["recipes"], [])
        self.assertEqual(make_catalog(snapshot, {}, ROOT / "config", recipes=normalized)["recipes"], normalized)
        self.assertEqual(snapshot, before)

    def test_real_recipes_are_offline_and_do_not_change_facts(self):
        path = ROOT / "data/repositories.json"
        before = path.read_bytes()
        snapshot = read_json(path)
        with patch("urllib.request.urlopen", side_effect=AssertionError("build must remain offline")):
            recipes = load_recipes(ROOT / "config/recipes.json", snapshot, load_topics(ROOT / "config/topics.json", snapshot))
        self.assertEqual({r["id"] for r in recipes}, {"vps-monitoring", "product-demo-web"})
        self.assertEqual(len({t["repoId"] for r in recipes for t in r["tools"]}), 7)
        self.assertEqual(path.read_bytes(), before)


if __name__ == "__main__":
    unittest.main()
