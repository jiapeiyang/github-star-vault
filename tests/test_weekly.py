"""周期边界、历史稳定性与旧收藏编选；所有模拟期刊都只存在于测试对象或临时目录。"""
import copy
from datetime import datetime, timedelta, timezone
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import generate_weekly
from star_vault import ValidationError
from weekly_catalog import generate_issue, load_weekly_archive, load_weekly_config, validate_archive, week_start, weekly_for_catalog

NOW = datetime(2026, 10, 13, 8, tzinfo=timezone.utc)


def repository(repo_id, category="web-client", **patches):
    return {"repoId": repo_id, "name": f"owner/repo-{repo_id}", "category": category, "categoryLabel": category,
            "sourceStatus": "starred", "personalArchived": False, "archived": False,
            "hasGuide": True, "guideStatus": "ready", "starredAt": "2021-06-30T20:00:00Z", **patches}


def catalog(repos=None):
    return {"checkedAt": "2026-10-12T00:00:00Z", "repositories": repos if repos is not None else
            [repository(i, category) for offset, category in enumerate(["web-client", "devtools-automation", "design-content"])
             for i in range(offset * 20 + 1, offset * 20 + 21)]}


def themes():
    return [{"id": category, "title": category, "intro": "公开资料重读", "question": "何时会用到？"}
            for category in ["web-client", "devtools-automation", "design-content"]]


def archive():
    return {"schema_version": 1, "issues": []}


class WeeklyTests(unittest.TestCase):
    def test_monday_is_beijing_midnight_including_year_boundary(self):
        self.assertEqual(str(week_start(datetime.fromisoformat("2026-10-11T15:59:59+00:00"))), "2026-10-05")
        self.assertEqual(str(week_start(datetime.fromisoformat("2026-10-11T16:00:00+00:00"))), "2026-10-12")
        self.assertEqual(str(week_start(datetime.fromisoformat("2027-01-01T00:00:00+00:00"))), "2026-12-28")
        with self.assertRaises(ValidationError): week_start(datetime(2026, 1, 1))

    def test_first_issue_is_stable_with_old_priority_and_three_plus_two(self):
        data = catalog()
        data["repositories"].extend(repository(100 + i, starredAt="2026-10-12T00:00:00Z") for i in range(10))
        original = copy.deepcopy(data)
        first = generate_issue(data, themes(), archive(), NOW)
        data["repositories"].reverse()
        self.assertEqual(first, generate_issue(data, themes(), archive(), NOW))
        self.assertEqual(first["id"], "2026-10-12")
        self.assertEqual([e["slot"] for e in first["entries"]], ["lead", "theme", "theme", "discovery", "discovery"])
        self.assertTrue(all(e["selection"]["age_days"] >= 90 for e in first["entries"]))
        self.assertEqual(len({e["selection"]["category"] for e in first["entries"][-2:]}), 2)
        self.assertEqual(original["repositories"], list(reversed(data["repositories"])))

    def test_current_issue_is_frozen_despite_later_data_and_theme_changes(self):
        history = archive(); first = generate_issue(catalog(), themes(), history, NOW)
        history["issues"].append(first); before = copy.deepcopy(history)
        self.assertIsNone(generate_issue(catalog([]), list(reversed(themes())), history, NOW + timedelta(days=3)))
        self.assertEqual(history, before)

    def test_eligibility_does_not_silently_include_archived_or_limited_guides(self):
        cases = [{"sourceStatus": "missing"}, {"archived": True}, {"personalArchived": True}, {"hasGuide": False}, {"guideStatus": "limited"}, {"category": "unclassified"}, {"starredAt": "2027-01-01T00:00:00Z"}]
        repos = [repository(i + 1, **fields) for i, fields in enumerate(cases)] + [repository(50, sourceCheck={"status": "changed"})]
        issue = generate_issue(catalog(repos), themes(), archive(), NOW)
        self.assertEqual([entry["repo_id"] for entry in issue["entries"]], [50])

    def test_cooldown_is_not_relaxed_when_pool_is_small_and_no_fake_backfill(self):
        data = catalog([repository(1)])
        history = archive(); first = generate_issue(data, themes(), history, NOW)
        history["issues"].append(first)
        for weeks in range(1, 8):
            self.assertIsNone(generate_issue(data, themes(), history, NOW + timedelta(weeks=weeks)))
        second = generate_issue(data, themes(), history, NOW + timedelta(weeks=8))
        self.assertEqual(second["number"], 2)
        self.assertEqual(second["id"], "2026-12-07")
        self.assertEqual(second["entries"][0]["selection"]["last_featured_week"], first["id"])
        self.assertEqual(len(history["issues"]), 1)

    def test_theme_rotates_and_empty_themes_are_skipped(self):
        history = archive(); first = generate_issue(catalog(), themes(), history, NOW)
        history["issues"].append(first)
        second = generate_issue(catalog(), themes(), history, NOW + timedelta(weeks=1))
        self.assertEqual(second["editorial"]["id"], "devtools-automation")
        absent_theme_data = catalog([repository(i, "design-content") for i in range(101, 105)])
        self.assertEqual(generate_issue(absent_theme_data, themes(), history, NOW + timedelta(weeks=1))["editorial"]["id"], "design-content")
        self.assertIsNone(generate_issue(catalog([]), themes(), history, NOW))

    def test_generation_uses_local_dates_and_accepts_new_stars_within_week(self):
        data = catalog([repository(1, starredAt="2026-10-12T20:00:00Z")])
        issue = generate_issue(data, themes(), archive(), NOW)
        self.assertEqual(issue["entries"][0]["selection"]["age_days"], 0)

    def test_archive_rejects_corrupt_dates_roles_and_references(self):
        issue = generate_issue(catalog(), themes(), archive(), NOW)
        changes = [lambda x: x.update(id="2026-10-13"), lambda x: x.update(week_end="2026-10-19"),
                   lambda x: x.update(number=True), lambda x: x.update(generated_at="2026-10-19T00:00:00Z"),
                   lambda x: x.update(facts_checked_at="2027-01-01T00:00:00Z"), lambda x: x.update(entries=[]),
                   lambda x: x["entries"][0].update(repo_id=True), lambda x: x["entries"][1].update(slot="lead"),
                   lambda x: x["entries"][1].update(repo_id=x["entries"][0]["repo_id"]),
                   lambda x: x["entries"][0]["selection"].update(age_days=1),
                   lambda x: x["entries"][0]["selection"].update(last_featured_week="2026-01-05"),
                   lambda x: x["entries"][-1]["selection"].update(category=x["editorial"]["id"])]
        for change in changes:
            with self.subTest(change=change):
                broken = copy.deepcopy(issue); change(broken)
                with self.assertRaises(ValidationError): validate_archive({"schema_version": 1, "issues": [broken]})
        with self.assertRaises(ValidationError): validate_archive({"schema_version": 1, "issues": [issue, issue]})

    def test_archive_rejects_too_early_reuse_and_future_write(self):
        data = catalog([repository(1)])
        first = generate_issue(data, themes(), archive(), NOW)
        second = generate_issue(data, themes(), archive(), NOW + timedelta(weeks=1))
        second["number"] = 2; second["entries"][0]["selection"]["last_featured_week"] = first["id"]
        with self.assertRaisesRegex(ValidationError, "八周"): validate_archive({"schema_version": 1, "issues": [first, second]})
        with self.assertRaisesRegex(ValidationError, "未来期刊"): generate_issue(data, themes(), {"schema_version": 1, "issues": [first]}, NOW - timedelta(weeks=1))

    def test_projection_preserves_basis_and_does_not_require_current_repo(self):
        history = {"schema_version": 1, "issues": [generate_issue(catalog(), themes(), archive(), NOW)]}
        projected = weekly_for_catalog(validate_archive(history))[0]
        self.assertEqual(projected["entries"][0]["selection"]["name"], history["issues"][0]["entries"][0]["selection"]["name"])
        self.assertEqual(projected["selectionVersion"], 1)
        with tempfile.TemporaryDirectory() as directory:
            self.assertEqual(load_weekly_archive(Path(directory) / "absent.json"), archive())

    def test_config_validates_human_themes_and_category_references(self):
        categories = [{"id": item["id"]} for item in themes()]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "weekly.json"
            for items, valid in [(themes(), True), (themes() + themes()[:1], False), ([{**themes()[0], "id": "unknown"}], False), ([{**themes()[0], "question": ""}], False)]:
                path.write_text(json.dumps({"schema_version": 1, "themes": items}))
                if valid: self.assertEqual(load_weekly_config(path, categories), items)
                else:
                    with self.assertRaises(ValidationError): load_weekly_config(path, categories)

    def test_command_does_not_rewrite_current_or_corrupt_archive(self):
        history = {"schema_version": 1, "issues": [generate_issue(catalog(), themes(), archive(), NOW)]}
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "weekly.json"
            with patch.object(generate_weekly, "read_json", return_value={}), patch.object(generate_weekly, "validate_snapshot", return_value=[]), patch.object(generate_weekly, "load_curations", return_value={}), patch.object(generate_weekly, "make_catalog", return_value={**catalog(), "categories": []}), patch.object(generate_weekly, "load_weekly_config", return_value=themes()), patch.object(generate_weekly, "datetime") as clock, patch.object(sys, "argv", ["generate_weekly", "--archive", str(path)]):
                clock.now.return_value = NOW
                for content in (json.dumps(history), "{broken archive"):
                    path.write_text(content); stamp = path.stat().st_mtime_ns
                    if content.startswith("{broken"):
                        with self.assertRaises(SystemExit): generate_weekly.main()
                    else: self.assertEqual(generate_weekly.main(), 0)
                    self.assertEqual(path.read_text(), content)
                    self.assertEqual(path.stat().st_mtime_ns, stamp)


if __name__ == "__main__":
    unittest.main()
