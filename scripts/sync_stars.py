#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
from pathlib import Path

from star_vault import (
    ROOT,
    atomic_write,
    fetch_star_pages,
    load_fixture_pages,
    load_project_config,
    read_json,
    reconcile_snapshot,
    stable_json,
    utc_now,
    validate_snapshot,
)


def main() -> int:
    config = load_project_config()
    parser = argparse.ArgumentParser(description="同步公开 GitHub Stars")
    parser.add_argument("--username", default=config["github_username"])
    parser.add_argument("--output", type=Path, default=ROOT / "data" / "repositories.json")
    parser.add_argument("--previous", type=Path, help="用指定的既有快照保留首次收录等历史信息")
    parser.add_argument("--fixture-dir", type=Path)
    parser.add_argument("--now")
    parser.add_argument("--allow-empty", action="store_true")
    args = parser.parse_args()

    previous_path = args.previous or args.output
    if args.previous and not previous_path.exists():
        parser.error("--previous 指定的既有快照不存在")
    previous = read_json(previous_path) if previous_path.exists() else None
    checked_at = utc_now(args.now)
    fetched = load_fixture_pages(args.fixture_dir) if args.fixture_dir else fetch_star_pages(
        args.username,
        config["api_version"],
        os.environ.get("GITHUB_TOKEN"),
    )
    snapshot, summary = reconcile_snapshot(
        previous,
        fetched.items,
        username=args.username,
        api_version=config["api_version"],
        checked_at=checked_at,
        pages=fetched.pages,
    )
    errors = validate_snapshot(snapshot, previous=previous, allow_empty=args.allow_empty)
    if errors:
        raise SystemExit("同步校验失败:\n- " + "\n- ".join(errors))
    atomic_write(args.output, stable_json(snapshot))
    print(
        f"sync ok: active={snapshot['sync']['active_count']} total={snapshot['sync']['total_count']} "
        f"pages={fetched.pages} added={summary['added']} missing={summary['missing']} "
        f"renamed={summary['renamed']} restarred={summary['restarred']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
