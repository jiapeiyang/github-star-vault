#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import subprocess
from pathlib import Path

from catalog_extras import load_topics, load_source_checks
from star_vault import ROOT, atomic_write, file_sha256, load_curations, make_catalog, read_json, stable_json, validate_snapshot


def git_head() -> str:
    from_env = os.environ.get("GITHUB_SHA")
    if from_env:
        return from_env
    result = subprocess.run(["git", "rev-parse", "HEAD"], cwd=ROOT, capture_output=True, text=True, check=False)
    return result.stdout.strip() if result.returncode == 0 else "working-tree"


def main() -> int:
    parser = argparse.ArgumentParser(description="生成前端只读目录")
    parser.add_argument("--data", type=Path, default=ROOT / "data" / "repositories.json")
    parser.add_argument("--content", type=Path, default=ROOT / "content" / "repos")
    parser.add_argument("--output-dir", type=Path, default=ROOT / "app" / "public" / "data")
    parser.add_argument("--data-commit", default=None)
    args = parser.parse_args()
    snapshot = read_json(args.data)
    errors = validate_snapshot(snapshot)
    if errors:
        raise SystemExit("目录生成失败:\n- " + "\n- ".join(errors))
    curations = load_curations(args.content, snapshot, ROOT / "config")
    catalog = make_catalog(snapshot, curations, ROOT / "config", topics=load_topics(ROOT / "config/topics.json", snapshot), source_checks=load_source_checks(ROOT / "data/guide-source-check.json", snapshot))
    meta = {
        "schemaVersion": 1,
        "checkedAt": snapshot["sync"]["checked_at"],
        "dataCommit": args.data_commit or git_head(),
        "dataSha256": file_sha256(args.data),
        "activeCount": snapshot["sync"]["active_count"],
        "totalCount": snapshot["sync"]["total_count"],
    }
    atomic_write(args.output_dir / "catalog.json", stable_json(catalog))
    atomic_write(args.output_dir / "build-meta.json", stable_json(meta))
    print(f"catalog ok: repositories={len(catalog['repositories'])} curations={len(curations)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
