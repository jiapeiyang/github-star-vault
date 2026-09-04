#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import re
from pathlib import Path

from star_vault import ROOT, atomic_write, load_curations, make_catalog, read_json


START = "<!-- STAR_VAULT:CATALOG:START -->"
END = "<!-- STAR_VAULT:CATALOG:END -->"


def clean_text(value: str, limit: int = 150) -> str:
    text = re.sub(r"\s+", " ", value).strip()
    text = text if len(text) <= limit else text[: limit - 1].rstrip() + "…"
    return html.escape(text, quote=False).replace("|", "\\|")


def render(catalog: dict) -> str:
    active = [repo for repo in catalog["repositories"] if repo["sourceStatus"] == "starred" and not repo["personalArchived"]]
    lines = [
        START,
        "## 自动生成的项目索引",
        "",
        f"> 最近成功检查：`{catalog['checkedAt']}` · 当前公开 Stars：**{catalog['stats']['active']}** · 已人工整理：**{catalog['stats']['curated']}**",
        "",
        "### 学习阶段",
        "",
    ]
    for stage in catalog["stages"]:
        count = sum(repo["stage"] == stage["id"] and repo["sourceStatus"] == "starred" for repo in catalog["repositories"])
        lines.append(f"- {stage['label']}：{count}")
    for category in catalog["categories"]:
        repos = [repo for repo in active if repo["category"] == category["id"]]
        if not repos:
            continue
        lines.extend(["", f"### {category['label']}（{len(repos)}）", ""])
        for repo in repos:
            description = clean_text(repo["note"] or repo["description"])
            lines.append(f"- [{repo['name']}]({repo['url']}) — {description}")
    lines.extend(["", END])
    return "\n".join(lines)


def replace_generated_section(readme: str, generated: str) -> str:
    if START in readme or END in readme:
        if readme.count(START) != 1 or readme.count(END) != 1 or readme.index(START) > readme.index(END):
            raise ValueError("README 生成标记必须各出现一次且顺序正确")
        before = readme[: readme.index(START)].rstrip()
        after = readme[readme.index(END) + len(END) :].lstrip()
        return f"{before}\n\n{generated}\n\n{after}".rstrip() + "\n"
    return readme.rstrip() + "\n\n" + generated + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="更新 README 自动索引区")
    parser.add_argument("--readme", type=Path, default=ROOT / "README.md")
    parser.add_argument("--data", type=Path, default=ROOT / "data" / "repositories.json")
    parser.add_argument("--content", type=Path, default=ROOT / "content" / "repos")
    args = parser.parse_args()
    snapshot = read_json(args.data)
    curations = load_curations(args.content, snapshot, ROOT / "config")
    catalog = make_catalog(snapshot, curations, ROOT / "config")
    output = replace_generated_section(args.readme.read_text(encoding="utf-8"), render(catalog))
    atomic_write(args.readme, output)
    print(f"readme ok: active={catalog['stats']['active']} curated={catalog['stats']['curated']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
