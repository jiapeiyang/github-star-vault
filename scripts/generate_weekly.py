#!/usr/bin/env python3
"""仅为当前北京时间所在周生成特刊；重复运行不重写历史。"""
import argparse
import os
from datetime import datetime, timezone
from pathlib import Path

from star_vault import ROOT, ValidationError, atomic_write, load_curations, make_catalog, read_json, stable_json, validate_snapshot
from weekly_catalog import generate_issue, load_weekly_archive, load_weekly_config, week_start


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, default=ROOT / "data/repositories.json")
    parser.add_argument("--content", type=Path, default=ROOT / "content/repos")
    parser.add_argument("--config-dir", type=Path, default=ROOT / "config")
    parser.add_argument("--archive", type=Path, default=ROOT / "data/weekly-issues.json")
    args = parser.parse_args()
    try:
        snapshot = read_json(args.data)
        errors = validate_snapshot(snapshot)
        if errors:
            raise ValidationError("; ".join(errors))
        curations = load_curations(args.content, snapshot, args.config_dir)
        catalog = make_catalog(snapshot, curations, args.config_dir)
        themes = load_weekly_config(args.config_dir / "weekly.json", catalog["categories"])
        archive = load_weekly_archive(args.archive)
        now = datetime.now(timezone.utc).replace(microsecond=0)
        issue = generate_issue(catalog, themes, archive, now)
        current_week = week_start(now).isoformat()
        if issue is not None:
            atomic_write(args.archive, stable_json({**archive, "issues": [*archive["issues"], issue]}))
            result = f"weekly generated: {issue['id']} / No.{issue['number']:03d} / {len(issue['entries'])} repositories"
        elif any(item["id"] == current_week for item in archive["issues"]):
            result = f"weekly existing: {current_week} / 当期已存在，档案未重写"
        else:
            result = f"weekly no-eligible: {current_week} / 无符合条件的候选，未生成空期"
        print(result)
        if summary := os.environ.get("GITHUB_STEP_SUMMARY"):
            with Path(summary).open("a", encoding="utf-8") as handle:
                handle.write(f"\n### 每周特刊生成\n\n{result}\n")
        return 0
    except (ValidationError, ValueError) as exc:
        raise SystemExit(f"特刊生成失败，原档案未改动: {exc}") from exc


if __name__ == "__main__":
    raise SystemExit(main())
