#!/usr/bin/env python3
"""检查特刊源档案、人工导读与实际构建产物一致，并识别应出未出的当期。"""
import argparse
from datetime import datetime, timezone
from pathlib import Path

from star_vault import ROOT, ValidationError, file_sha256, load_curations, make_catalog, read_json, validate_snapshot
from weekly_catalog import generate_issue, load_weekly_archive, load_weekly_config, require, week_start
from weekly_reading import weekly_with_readings


def verify_weekly_build(site_dir, *, data=ROOT / "data/repositories.json", content=ROOT / "content/repos",
                        config_dir=ROOT / "config", archive_path=ROOT / "data/weekly-issues.json",
                        reading_dir=ROOT / "content/weekly", now=None):
    now = now or datetime.now(timezone.utc)
    snapshot = read_json(data)
    require(not validate_snapshot(snapshot), "snapshot", "事实源校验失败")
    source_catalog = make_catalog(snapshot, load_curations(content, snapshot, config_dir), config_dir)
    archive = load_weekly_archive(archive_path)
    themes = load_weekly_config(config_dir / "weekly.json", source_catalog["categories"])
    expected = weekly_with_readings(archive, reading_dir)
    built = read_json(site_dir / "data/catalog.json")
    meta = read_json(site_dir / "data/build-meta.json")
    require(built.get("weeklyIssues") == expected, "build.weeklyIssues", "构建产物与特刊档案或人工导读不一致")
    require(meta.get("dataSha256") == file_sha256(data) and built.get("checkedAt") == source_catalog["checkedAt"], "build.facts", "构建使用的事实快照已过期")
    latest = archive["issues"][-1]["id"] if archive["issues"] else None
    require(meta.get("weeklyIssueId") == latest and meta.get("weeklyIssueCount") == len(expected), "build.meta", "构建元数据未对应当前档案")
    require(generate_issue(source_catalog, themes, archive, now) is None, "build.currentWeek", "仍有符合条件的仓库，但当期未生成；先运行 generate_weekly.py")
    current = week_start(now).isoformat()
    status = "current" if latest == current else "no-eligible"
    return f"weekly build verified: week={current} latest={latest or 'none'} issues={len(expected)} status={status}"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site-dir", type=Path, default=ROOT / "app/dist/client")
    args = parser.parse_args()
    try:
        print(verify_weekly_build(args.site_dir))
    except ValidationError as exc:
        raise SystemExit(f"特刊构建校验失败: {exc}") from exc


if __name__ == "__main__":
    main()
