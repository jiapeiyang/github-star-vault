"""人工特刊导读独立于已冻结的编选档案，沿用现有 TOML + Markdown 内容格式。"""
from datetime import datetime, timezone
from pathlib import Path

from star_vault import content_date, parse_curation_file, web_url
from weekly_catalog import require, text, weekly_for_catalog


def load_weekly_readings(directory: Path, archive: dict) -> dict:
    issues = {issue["id"]: issue for issue in archive["issues"]}
    readings = {}
    fields = {"issue_id", "lead_repo_id", "title", "reviewed_at", "sources", "connections"}
    for path in sorted(directory.glob("*.md")):
        metadata, body = parse_curation_file(path)
        field = str(path)
        require(set(metadata) == fields, field, "导读字段须为 issue_id、lead_repo_id、title、reviewed_at、sources、connections")
        issue_id = metadata["issue_id"]
        require(isinstance(issue_id, str) and issue_id == path.stem and issue_id in issues, field, "文件名与 issue_id 须引用实际已生成期刊")
        issue = issues[issue_id]
        lead_id = metadata["lead_repo_id"]
        require(type(lead_id) is int and lead_id == issue["entries"][0]["repo_id"], field, "导读主读必须与冻结名单一致")
        reviewed = content_date(metadata["reviewed_at"], field + ".reviewed_at")
        require(reviewed is not None and issue_id <= reviewed <= datetime.now(timezone.utc).date().isoformat(), field, "核查日期须在出刊周开始之后且不晚于 UTC 今天")
        sources = metadata["sources"]
        require(isinstance(sources, list) and sources, field, "必须提供公开来源")
        for source in sources:
            require(isinstance(source, dict) and set(source) == {"label", "url"}, field, "来源须包含 label 与 url")
            text(source["label"], field + ".source.label")
            require(web_url(source["url"]), field, "来源仅支持完整 HTTP/HTTPS URL")
        connections = metadata["connections"]
        require(isinstance(connections, list) and len(connections) <= 2, field, "最多两个同主题阅读关系")
        theme_ids = {entry["repo_id"] for entry in issue["entries"] if entry["slot"] == "theme"}
        seen, projected = set(), []
        for connection in connections:
            require(isinstance(connection, dict) and set(connection) == {"repo_id", "title", "note"}, field, "阅读关系须包含 repo_id、title、note")
            repo_id = connection["repo_id"]
            require(type(repo_id) is int and repo_id in theme_ids and repo_id not in seen, field, "阅读关系须引用本期不同的同主题条目")
            seen.add(repo_id)
            projected.append({"repoId": repo_id, "title": text(connection["title"], field), "note": text(connection["note"], field)})
        readings[issue_id] = {
            "leadRepoId": lead_id, "title": text(metadata["title"], field), "reviewedAt": reviewed,
            "contentMarkdown": text(body, field + ".body"), "sources": sources, "connections": projected,
        }
    return readings


def weekly_with_readings(archive: dict, directory: Path) -> list:
    readings = load_weekly_readings(directory, archive)
    return [{**issue, **({"reading": readings[issue["id"]]} if issue["id"] in readings else {})}
            for issue in weekly_for_catalog(archive)]
