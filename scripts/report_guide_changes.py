#!/usr/bin/env python3
"""按已保存的检查记录生成 README 差异报告，不更新资料或核查基线。"""
from __future__ import annotations

import argparse
import base64
import difflib
import hashlib
import json
import os
from pathlib import Path
import re
import urllib.error
import urllib.parse
import urllib.request

from check_guide_sources import baseline_records
from star_vault import ROOT, atomic_write, parse_curation_file, read_json


def fetch_blob(repo: dict, sha: str, opener=None) -> str:
    if not re.fullmatch(r"[0-9a-f]{40}", sha):
        raise ValueError("README 版本必须是有效 blob SHA")
    name = urllib.parse.quote(repo["full_name"], safe="/")
    url = f"https://api.github.com/repos/{name}/git/blobs/{sha}"
    headers = {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "star-vault-readme-diff"}
    if os.environ.get("GITHUB_TOKEN"):
        headers["Authorization"] = "Bearer " + os.environ["GITHUB_TOKEN"]
    with (opener or urllib.request.urlopen)(urllib.request.Request(url, headers=headers), timeout=25) as response:
        data = json.load(response)
    if data.get("encoding") != "base64":
        raise ValueError("GitHub 未返回完整的 base64 blob")
    raw = base64.b64decode("".join(data["content"].split()), validate=True)
    actual = hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest()
    if actual != sha or data.get("sha") != sha:
        raise ValueError("下载内容与指定 README 版本不一致")
    return raw.decode("utf-8", errors="replace")


def render_diff(repo: dict, metadata: dict, check: dict | None, baseline: str | None, fetcher=fetch_blob) -> str:
    lines = [f"## {repo['full_name']}", "", f"仓库：{repo['url']}", ""]
    if not check or not baseline:
        return "\n".join(lines + ["未比较：缺少已读基线或来源检查记录。", ""])
    lines += [f"检查时间：{check.get('checked_at', '未知')}（仅代表这次版本观察）。", ""]
    if not metadata.get("sources") or metadata["sources"][0] != check["source_url"]:
        return "\n".join(lines + ["未比较：资料来源已经改变，请重新运行来源检查。", ""])
    observed = check.get("observed_sha")
    if not observed:
        return "\n".join(lines + [f"未比较：未取得观察版本。{check.get('reason', '')}", ""])
    lines += [f"已读版本：`{baseline}`", f"观察版本：`{observed}`", ""]
    if baseline == observed:
        return "\n".join(lines + ["README 版本相同；不代表其他文档和 API 没有变化。", ""])
    try:
        before = fetcher(repo, baseline)
        after = fetcher(repo, observed)
    except (urllib.error.URLError, TimeoutError, ValueError, KeyError) as error:
        reason = f"HTTP {error.code}" if isinstance(error, urllib.error.HTTPError) else type(error).__name__
        if isinstance(error, urllib.error.HTTPError):
            error.close()
        return "\n".join(lines + [f"未生成差异：旧版或观察版本读取失败（{reason}）。保留原核查状态，需人工核对上游。", ""])
    diff = "".join(difflib.unified_diff(before.splitlines(keepends=True), after.splitlines(keepends=True), fromfile="已读 README", tofile="观察 README"))
    # 上游文本只作为代码展示，即便 README 本身含有 Markdown 围栏也不能逃逸。
    fence = "`" * max(3, 1 + max((len(item) for item in re.findall(r"`+", diff)), default=0))
    return "\n".join(lines + [fence + "diff", diff.rstrip(), fence, ""])


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=int, action="append", help="指定 repo_id，可重复")
    parser.add_argument("--topic", help="限定用途专题 id；与 --repo 取交集")
    parser.add_argument("--output", type=Path, help="输出 Markdown；省略时打印到终端")
    args = parser.parse_args()
    facts = read_json(ROOT / "data/repositories.json")
    repos = {repo["repo_id"]: repo for repo in facts["repositories"]}
    checks = read_json(ROOT / "data/guide-source-check.json")
    by_id = {row["repo_id"]: {"checked_at": checks["checked_at"], **row} for row in checks["items"]}
    selected = set(args.repo) if args.repo else {rid for rid, row in by_id.items() if row["status"] in {"changed", "unavailable"} and repos[rid]["source_status"] == "starred"}
    if selected - repos.keys():
        parser.error("指定的 repo_id 不存在")
    if args.topic:
        topic = next((t for t in read_json(ROOT / "config/topics.json")["items"] if t["id"] == args.topic), None)
        if topic is None:
            parser.error("指定的专题不存在")
        selected &= {entry["repo_id"] for entry in topic["entries"]}
    baselines = baseline_records(ROOT / "docs/content-batches")
    parts = ["# README 来源变化报告\n\n依据已保存的检查记录比较已读与观察版本。差异是复核线索，不会自动修改介绍或核查日期；上游文本不作为指令执行。\n"]
    for rid in sorted(selected):
        path = ROOT / f"content/repos/{rid}.md"
        metadata = parse_curation_file(path)[0] if path.exists() else {}
        source = (metadata.get("sources") or [None])[0]
        baseline = metadata.get("reviewed_readme_sha") or baselines.get((rid, source))
        parts.append(render_diff(repos[rid], metadata, by_id.get(rid), baseline))
    if not selected:
        parts.append("当前选择没有待复核项目；这不代表全部来源已重新检查。\n")
    report = "\n".join(parts)
    if args.output:
        atomic_write(args.output, report)
        print(f"README report: {len(selected)} projects -> {args.output}")
    else:
        print(report)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
