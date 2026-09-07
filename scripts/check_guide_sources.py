#!/usr/bin/env python3
"""手动核对当前 README 与已读版本，生成复核线索；不改写仓库介绍。"""
from __future__ import annotations
import argparse
from concurrent.futures import ThreadPoolExecutor
import json
import os
from pathlib import Path
import urllib.error
import urllib.parse
import urllib.request
from star_vault import ROOT, atomic_write, parse_curation_file, read_json, stable_json, utc_now


def baseline_records(directory: Path) -> dict:
    result = {}
    for path in sorted(directory.glob("*-sources.json")):
        data = json.loads(path.read_text())
        if not isinstance(data, list):
            continue
        for row in data:
            if isinstance(row, dict) and row.get("repo_id") and row.get("sha") and row.get("url"):
                result[(row["repo_id"], row["url"])] = row["sha"]
    return result


def check_one(repo: dict, source_url: str, baseline: str, opener=None) -> dict:
    url = "https://api.github.com/repos/" + urllib.parse.quote(repo["full_name"], safe="/") + "/readme"
    headers = {"Accept":"application/vnd.github+json", "X-GitHub-Api-Version":"2022-11-28", "User-Agent":"star-vault-guide-check"}
    if os.environ.get("GITHUB_TOKEN"):
        headers["Authorization"] = "Bearer " + os.environ["GITHUB_TOKEN"]
    row = {"repo_id":repo["repo_id"],"source_url":source_url,"baseline_sha":baseline}
    try:
        with (opener or urllib.request.urlopen)(urllib.request.Request(url,headers=headers),timeout=25) as response:
            data = json.load(response)
        sha=data["sha"]
        import re
        if not isinstance(sha,str) or not re.fullmatch(r"[0-9a-f]{40}",sha):
            raise ValueError("README 缺少有效版本信息")
        return {**row,"observed_sha":sha,"status":"unchanged" if sha==baseline else "changed"}
    except (urllib.error.URLError, TimeoutError, ValueError, KeyError) as error:
        reason=f"HTTP {error.code}" if isinstance(error,urllib.error.HTTPError) else "未取得 README 版本，需重新核对"
        if isinstance(error,urllib.error.HTTPError):error.close()
        return {**row,"observed_sha":None,"status":"unavailable","reason":reason}


def main() -> int:
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo",type=int,action="append",help="只检查指定 repo_id；可重复指定")
    parser.add_argument("--output",type=Path,default=ROOT/"data/guide-source-check.json")
    args=parser.parse_args()
    facts=read_json(ROOT/"data/repositories.json")
    baselines=baseline_records(ROOT/"docs/content-batches")
    selected=set(args.repo or []);known={r["repo_id"] for r in facts["repositories"]}
    if selected-known:parser.error("指定 repo_id 不存在于收藏快照")
    jobs=[];skipped=[]
    for repo in facts["repositories"]:
        rid=repo["repo_id"]
        if repo["source_status"]!="starred" or (selected and rid not in selected):continue
        path=ROOT/f"content/repos/{rid}.md"
        if not path.exists():skipped.append(rid);continue
        metadata,_=parse_curation_file(path)
        source=(metadata.get("sources") or [None])[0]
        baseline=metadata.get("reviewed_readme_sha") or baselines.get((rid,source))
        if not source or not baseline:skipped.append(rid);continue
        jobs.append((repo,source,baseline))
    with ThreadPoolExecutor(max_workers=4) as pool:
        rows=list(pool.map(lambda args:check_one(*args),jobs))
    # 子集检查保留其他条目的原核查时间，避免把未查内容冒充本次已查。
    now=utc_now()
    for row in rows:row["checked_at"]=now
    if selected and args.output.exists():
        previous=read_json(args.output)
        rows += [row for row in previous.get("items",[]) if row["repo_id"] not in selected and row["repo_id"] in known]
        skipped += [rid for rid in previous.get("without_baseline",[]) if rid not in selected and rid in known]
    rows.sort(key=lambda row:row["repo_id"])
    atomic_write(args.output,stable_json({"checked_at":now,"items":rows,"without_baseline":skipped}))
    counts={status:sum(row["status"]==status for row in rows) for status in ["unchanged","changed","unavailable"]}
    print(f"source check ok: {counts}; without_baseline={len(skipped)}")
    return 0

if __name__=="__main__":raise SystemExit(main())
