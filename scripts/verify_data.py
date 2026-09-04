#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

from star_vault import ROOT, ValidationError, load_curations, read_json, validate_snapshot


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
    except ValidationError as exc:
        raise SystemExit(f"人工内容校验失败:\n- {exc}") from exc
    print(
        f"verify ok: active={snapshot['sync']['active_count']} total={snapshot['sync']['total_count']} "
        f"curations={len(curations)}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
