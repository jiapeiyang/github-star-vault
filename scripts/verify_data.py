#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

from catalog_extras import load_topics, load_source_checks
from recipe_catalog import load_recipes
from weekly_catalog import load_weekly_archive, load_weekly_config
from weekly_reading import load_weekly_readings
from star_vault import ROOT, ValidationError, load_curations, load_enum_config, read_json, validate_snapshot


def main() -> int:
    parser = argparse.ArgumentParser(description="校验 Star Vault 事实与人工内容")
    parser.add_argument("data", nargs="?", type=Path, default=ROOT / "data" / "repositories.json")
    parser.add_argument("content", nargs="?", type=Path, default=ROOT / "content" / "repos")
    args = parser.parse_args()
    snapshot = read_json(args.data)
    errors = validate_snapshot(snapshot)
    if errors:
        raise SystemExit("事实数据校验失败:\n- " + "\n- ".join(errors))
    try:
        curations = load_curations(args.content, snapshot, ROOT / "config")
        topics = load_topics(ROOT / "config/topics.json", snapshot)
        recipes = load_recipes(ROOT / "config/recipes.json", snapshot, topics)
        load_source_checks(ROOT / "data/guide-source-check.json", snapshot)
        load_weekly_config(ROOT / "config/weekly.json", load_enum_config("categories"))
        weekly = load_weekly_archive(ROOT / "data/weekly-issues.json")
        readings = load_weekly_readings(ROOT / "content/weekly", weekly)
    except ValidationError as exc:
        raise SystemExit(f"人工内容校验失败:\n- {exc}") from exc
    print(
        f"verify ok: active={snapshot['sync']['active_count']} total={snapshot['sync']['total_count']} "
        f"curations={len(curations)} recipes={len(recipes)} weekly={len(weekly['issues'])} readings={len(readings)}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
