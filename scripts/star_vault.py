from __future__ import annotations

import hashlib
import json
import os
import re
import tempfile
import tomllib
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable


ROOT = Path(__file__).resolve().parents[1]
ISO_FIELDS = ("starred_at", "updated_at", "first_seen_at", "last_seen_at")
SOURCE_STATUSES = {"starred", "missing"}
FRONTMATTER_DELIMITER = "+++"


class ValidationError(ValueError):
    pass


def read_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        value = json.load(handle)
    if not isinstance(value, dict):
        raise ValidationError(f"{path}: 顶层必须是 JSON object")
    return value


def stable_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2) + "\n"


def atomic_write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(text)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, path)
    except BaseException:
        try:
            os.unlink(temporary)
        except FileNotFoundError:
            pass
        raise


def utc_now(value: str | None = None) -> str:
    if value:
        parse_iso(value, "--now")
        return value
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def parse_iso(value: Any, field: str) -> datetime:
    if not isinstance(value, str) or not value:
        raise ValidationError(f"{field}: 必须是非空 ISO 时间")
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValidationError(f"{field}: 非法 ISO 时间 {value!r}") from exc
    if parsed.tzinfo is None:
        raise ValidationError(f"{field}: 必须包含时区")
    return parsed


def load_project_config(path: Path | None = None) -> dict[str, Any]:
    return read_json(path or ROOT / "config" / "project.json")


def load_enum_config(name: str, config_dir: Path | None = None) -> list[dict[str, str]]:
    data = read_json((config_dir or ROOT / "config") / f"{name}.json")
    items = data.get("items")
    if not isinstance(items, list) or not items:
        raise ValidationError(f"config/{name}.json: items 必须是非空数组")
    ids: set[str] = set()
    for item in items:
        if not isinstance(item, dict) or not isinstance(item.get("id"), str) or not isinstance(item.get("label"), str):
            raise ValidationError(f"config/{name}.json: 每项必须包含字符串 id 和 label")
        if item["id"] in ids:
            raise ValidationError(f"config/{name}.json: 重复 id {item['id']}")
        ids.add(item["id"])
    return items


def _next_link(header: str | None) -> str | None:
    if not header:
        return None
    for part in header.split(","):
        match = re.match(r'\s*<([^>]+)>;\s*rel="([^"]+)"', part)
        if match and match.group(2) == "next":
            return match.group(1)
    return None


@dataclass
class FetchResult:
    items: list[dict[str, Any]]
    pages: int


def fetch_star_pages(username: str, api_version: str, token: str | None = None, opener=None) -> FetchResult:
    encoded = urllib.parse.quote(username, safe="")
    url = f"https://api.github.com/users/{encoded}/starred?sort=created&direction=desc&per_page=100"
    items: list[dict[str, Any]] = []
    pages = 0
    headers = {
        "Accept": "application/vnd.github.star+json",
        "X-GitHub-Api-Version": api_version,
        "User-Agent": "github-star-vault",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    open_url = opener or urllib.request.urlopen
    while url:
        request = urllib.request.Request(url, headers=headers)
        try:
            with open_url(request, timeout=30) as response:
                page = json.load(response)
                next_url = _next_link(response.headers.get("Link"))
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise RuntimeError(f"GitHub Stars 第 {pages + 1} 页读取失败: {exc}") from exc
        if not isinstance(page, list):
            raise RuntimeError(f"GitHub Stars 第 {pages + 1} 页不是数组")
        items.extend(page)
        pages += 1
        url = next_url
    return FetchResult(items=items, pages=pages)


def load_fixture_pages(directory: Path) -> FetchResult:
    page_files = sorted(
        directory.glob("page-*.json"),
        key=lambda path: int(re.search(r"(\d+)", path.stem).group(1)),
    )
    if not page_files:
        raise RuntimeError(f"{directory}: 没有 page-*.json fixture")
    items: list[dict[str, Any]] = []
    for page_path in page_files:
        with page_path.open("r", encoding="utf-8") as handle:
            page = json.load(handle)
        if not isinstance(page, list):
            raise RuntimeError(f"{page_path}: fixture 顶层必须是数组")
        items.extend(page)
    return FetchResult(items=items, pages=len(page_files))


def _required(repo: dict[str, Any], key: str) -> Any:
    value = repo.get(key)
    if value is None or value == "":
        raise ValidationError(f"GitHub repository 缺少 {key}")
    return value


def normalize_star(item: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(item, dict) or not isinstance(item.get("repo"), dict):
        raise ValidationError("Stars 响应项必须包含 repo object")
    repo = item["repo"]
    owner = repo.get("owner") or {}
    license_value = repo.get("license") or {}
    topics = repo.get("topics") or []
    if not isinstance(topics, list) or not all(isinstance(topic, str) for topic in topics):
        raise ValidationError(f"{repo.get('full_name', '<unknown>')}: topics 必须是字符串数组")
    return {
        "repo_id": int(_required(repo, "id")),
        "node_id": str(repo.get("node_id") or ""),
        "full_name": str(_required(repo, "full_name")),
        "owner": str(owner.get("login") or str(_required(repo, "full_name")).split("/", 1)[0]),
        "owner_avatar_url": owner.get("avatar_url"),
        "url": str(_required(repo, "html_url")),
        "description": repo.get("description"),
        "homepage": repo.get("homepage") or None,
        "language": repo.get("language"),
        "topics": sorted(set(topics)),
        "license_spdx": license_value.get("spdx_id") if isinstance(license_value, dict) else None,
        "stargazers_count": int(repo.get("stargazers_count") or 0),
        "forks_count": int(repo.get("forks_count") or 0),
        "open_issues_count": int(repo.get("open_issues_count") or 0),
        "fork": bool(repo.get("fork")),
        "github_archived": bool(repo.get("archived")),
        "visibility": str(repo.get("visibility") or ("private" if repo.get("private") else "public")),
        "starred_at": str(_required(item, "starred_at")),
        "pushed_at": repo.get("pushed_at"),
        "updated_at": repo.get("updated_at"),
    }


def _repository_sort_key(repo: dict[str, Any]) -> tuple[int, float, int]:
    status = 0 if repo["source_status"] == "starred" else 1
    starred = -parse_iso(repo["starred_at"], f"{repo['full_name']}.starred_at").timestamp()
    return status, starred, repo["repo_id"]


def reconcile_snapshot(
    previous: dict[str, Any] | None,
    current_items: Iterable[dict[str, Any]],
    *,
    username: str,
    api_version: str,
    checked_at: str,
    pages: int,
) -> tuple[dict[str, Any], dict[str, int]]:
    normalized = [normalize_star(item) for item in current_items]
    current_ids = [repo["repo_id"] for repo in normalized]
    if len(current_ids) != len(set(current_ids)):
        raise ValidationError("当前 GitHub 响应包含重复 repo_id")
    previous_repos = list((previous or {}).get("repositories") or [])
    previous_by_id = {repo["repo_id"]: repo for repo in previous_repos}
    initial_import = not previous_repos
    output: list[dict[str, Any]] = []
    summary = {"added": 0, "kept": 0, "missing": 0, "renamed": 0, "restarred": 0}

    for repo in normalized:
        old = previous_by_id.get(repo["repo_id"])
        if old:
            summary["kept"] += 1
            if old.get("full_name") != repo["full_name"]:
                summary["renamed"] += 1
            if old.get("source_status") == "missing":
                summary["restarred"] += 1
            repo["discovered_in_initial_import"] = bool(old.get("discovered_in_initial_import"))
            repo["first_seen_at"] = old.get("first_seen_at") or checked_at
        else:
            summary["added"] += 1
            repo["discovered_in_initial_import"] = initial_import
            repo["first_seen_at"] = checked_at
        repo["last_seen_at"] = checked_at
        repo["source_status"] = "starred"
        repo["missing_detected_at"] = None
        output.append(repo)

    current_id_set = set(current_ids)
    for old in previous_repos:
        if old["repo_id"] in current_id_set:
            continue
        missing = dict(old)
        if missing.get("source_status") != "missing":
            summary["missing"] += 1
            missing["missing_detected_at"] = checked_at
        missing["source_status"] = "missing"
        output.append(missing)

    output.sort(key=_repository_sort_key)
    active_count = sum(repo["source_status"] == "starred" for repo in output)
    snapshot = {
        "schema_version": 1,
        "github_username": username,
        "sync": {
            "checked_at": checked_at,
            "api_version": api_version,
            "pages": pages,
            "active_count": active_count,
            "total_count": len(output),
        },
        "repositories": output,
    }
    return snapshot, summary


def validate_snapshot(
    snapshot: dict[str, Any],
    *,
    previous: dict[str, Any] | None = None,
    allow_empty: bool = False,
) -> list[str]:
    errors: list[str] = []
    if snapshot.get("schema_version") != 1:
        errors.append("schema_version 必须为 1")
    if not isinstance(snapshot.get("github_username"), str) or not snapshot.get("github_username"):
        errors.append("github_username 必须是非空字符串")
    sync = snapshot.get("sync")
    if not isinstance(sync, dict):
        errors.append("sync 必须是 object")
        sync = {}
    try:
        parse_iso(sync.get("checked_at"), "sync.checked_at")
    except ValidationError as exc:
        errors.append(str(exc))
    repositories = snapshot.get("repositories")
    if not isinstance(repositories, list):
        errors.append("repositories 必须是数组")
        repositories = []
    seen: set[int] = set()
    active_count = 0
    required_strings = ("full_name", "owner", "url", "starred_at", "first_seen_at", "last_seen_at")
    for index, repo in enumerate(repositories):
        prefix = f"repositories[{index}]"
        if not isinstance(repo, dict):
            errors.append(f"{prefix}: 必须是 object")
            continue
        repo_id = repo.get("repo_id")
        if not isinstance(repo_id, int) or repo_id <= 0:
            errors.append(f"{prefix}.repo_id: 必须是正整数")
        elif repo_id in seen:
            errors.append(f"{prefix}.repo_id: 重复 {repo_id}")
        else:
            seen.add(repo_id)
        for field in required_strings:
            if not isinstance(repo.get(field), str) or not repo.get(field):
                errors.append(f"{prefix}.{field}: 必须是非空字符串")
        if isinstance(repo.get("url"), str) and not repo["url"].startswith("https://github.com/"):
            errors.append(f"{prefix}.url: 必须是 github.com HTTPS URL")
        for field in ISO_FIELDS:
            try:
                parse_iso(repo.get(field), f"{prefix}.{field}")
            except ValidationError as exc:
                errors.append(str(exc))
        if repo.get("pushed_at") is not None:
            try:
                parse_iso(repo.get("pushed_at"), f"{prefix}.pushed_at")
            except ValidationError as exc:
                errors.append(str(exc))
        if repo.get("missing_detected_at") is not None:
            try:
                parse_iso(repo.get("missing_detected_at"), f"{prefix}.missing_detected_at")
            except ValidationError as exc:
                errors.append(str(exc))
        status = repo.get("source_status")
        if status not in SOURCE_STATUSES:
            errors.append(f"{prefix}.source_status: 非法值 {status!r}")
        if status == "starred":
            active_count += 1
            if repo.get("visibility") != "public":
                errors.append(f"{prefix}.visibility: 活跃记录必须是 public")
        if not isinstance(repo.get("topics"), list) or not all(isinstance(topic, str) for topic in repo.get("topics", [])):
            errors.append(f"{prefix}.topics: 必须是字符串数组")
    if sync.get("active_count") != active_count:
        errors.append(f"sync.active_count={sync.get('active_count')} 与实际 {active_count} 不一致")
    if sync.get("total_count") != len(repositories):
        errors.append(f"sync.total_count={sync.get('total_count')} 与实际 {len(repositories)} 不一致")
    previous_active = sum(repo.get("source_status") == "starred" for repo in (previous or {}).get("repositories", []))
    if previous_active > 0 and active_count == 0 and not allow_empty:
        errors.append("旧活跃集合非空而新集合为 0；如确需清空必须显式使用 --allow-empty")
    return errors


def parse_curation_file(path: Path) -> tuple[dict[str, Any], str]:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    if not lines or lines[0].strip() != FRONTMATTER_DELIMITER:
        raise ValidationError(f"{path}: 必须以 +++ 开始 TOML frontmatter")
    try:
        closing = next(index for index, line in enumerate(lines[1:], 1) if line.strip() == FRONTMATTER_DELIMITER)
    except StopIteration as exc:
        raise ValidationError(f"{path}: 缺少结束 +++") from exc
    try:
        metadata = tomllib.loads("\n".join(lines[1:closing]))
    except tomllib.TOMLDecodeError as exc:
        raise ValidationError(f"{path}: TOML 无法解析: {exc}") from exc
    return metadata, "\n".join(lines[closing + 1 :]).strip() + "\n"


def extract_section(markdown: str, heading: str) -> str:
    pattern = re.compile(rf"^##\s+{re.escape(heading)}\s*$", re.MULTILINE)
    match = pattern.search(markdown)
    if not match:
        return ""
    start = match.end()
    next_heading = re.search(r"^##\s+", markdown[start:], re.MULTILINE)
    end = start + next_heading.start() if next_heading else len(markdown)
    return markdown[start:end].strip()


def _meaningful_takeaway(section: str) -> bool:
    text = re.sub(r"<!--.*?-->", "", section, flags=re.DOTALL)
    text = re.sub(r"^[\s>*#-]+", "", text, flags=re.MULTILINE).strip()
    if not text:
        return False
    normalized = re.sub(r"[。.!！\s]", "", text).lower()
    return normalized not in {"待学习", "待补充", "todo", "tbd", "待实际使用后补充"}


def load_curations(
    content_dir: Path,
    snapshot: dict[str, Any],
    config_dir: Path,
) -> dict[int, dict[str, Any]]:
    repository_by_id = {repo["repo_id"]: repo for repo in snapshot["repositories"]}
    category_ids = {item["id"] for item in load_enum_config("categories", config_dir)}
    resource_ids = {item["id"] for item in load_enum_config("resource-types", config_dir)}
    stage_ids = {item["id"] for item in load_enum_config("stages", config_dir)}
    result: dict[int, dict[str, Any]] = {}
    for path in sorted(content_dir.glob("*.md")):
        metadata, body = parse_curation_file(path)
        repo_id = metadata.get("repo_id")
        if not isinstance(repo_id, int) or repo_id <= 0:
            raise ValidationError(f"{path}: repo_id 必须是正整数")
        if path.stem != str(repo_id):
            raise ValidationError(f"{path}: 文件名必须与 repo_id={repo_id} 一致")
        if repo_id in result:
            raise ValidationError(f"{path}: repo_id={repo_id} 重复")
        if repo_id not in repository_by_id:
            raise ValidationError(f"{path}: repo_id={repo_id} 不存在于事实数据")
        category = metadata.get("category")
        resource_type = metadata.get("resource_type")
        stage = metadata.get("stage")
        if category not in category_ids:
            raise ValidationError(f"{path}: 非法 category {category!r}")
        if resource_type not in resource_ids:
            raise ValidationError(f"{path}: 非法 resource_type {resource_type!r}")
        if stage not in stage_ids:
            raise ValidationError(f"{path}: 非法 stage {stage!r}")
        note = metadata.get("note")
        if not isinstance(note, str) or not note.strip():
            raise ValidationError(f"{path}: note 必须是非空字符串")
        tags = metadata.get("tags", [])
        if not isinstance(tags, list) or not all(isinstance(tag, str) and tag.strip() for tag in tags):
            raise ValidationError(f"{path}: tags 必须是非空字符串数组")
        if len(tags) > 5:
            raise ValidationError(f"{path}: tags 最多 5 个")
        if len(set(tags)) != len(tags):
            raise ValidationError(f"{path}: tags 不能重复")
        language = repository_by_id[repo_id].get("language")
        if language and any(tag.casefold() == language.casefold() for tag in tags):
            raise ValidationError(f"{path}: tags 不应重复语言字段 {language}")
        related = metadata.get("related", [])
        if not isinstance(related, list) or not all(isinstance(value, int) for value in related):
            raise ValidationError(f"{path}: related 必须是 repo_id 数组")
        missing_related = [value for value in related if value not in repository_by_id]
        if missing_related:
            raise ValidationError(f"{path}: related 包含不存在的 repo_id {missing_related}")
        takeaway = extract_section(body, "学习结论")
        if stage == "learned" and not _meaningful_takeaway(takeaway):
            raise ValidationError(f"{path}: stage=learned 时必须包含有效学习结论")
        for target in re.findall(r"\[[^\]]+\]\(([^)]+)\)", body):
            if not target.startswith(("http://", "https://", "#")):
                raise ValidationError(f"{path}: 非法 Markdown 链接 {target!r}")
        result[repo_id] = {**metadata, "body": body, "takeaway": takeaway}
    return result


def _first_takeaway(section: str) -> str:
    for line in section.splitlines():
        clean = line.strip().lstrip("-*>").strip()
        if clean and not clean.startswith("<!--"):
            return clean
    return ""


def make_catalog(
    snapshot: dict[str, Any],
    curations: dict[int, dict[str, Any]],
    config_dir: Path,
) -> dict[str, Any]:
    categories = load_enum_config("categories", config_dir)
    resources = load_enum_config("resource-types", config_dir)
    stages = load_enum_config("stages", config_dir)
    category_labels = {item["id"]: item["label"] for item in categories}
    resource_labels = {item["id"]: item["label"] for item in resources}
    stage_labels = {item["id"]: item["label"] for item in stages}
    repositories: list[dict[str, Any]] = []
    for fact in snapshot["repositories"]:
        curation = curations.get(fact["repo_id"])
        if curation:
            stage = curation["stage"]
            category = curation["category"]
            resource_type = curation["resource_type"]
            note = curation["note"].strip()
            tags = curation.get("tags", [])
            takeaway = _first_takeaway(curation.get("takeaway", ""))
            body = curation["body"]
            curated_at = curation.get("updated_by_user_at")
            related = curation.get("related", [])
            content_links = [
                {"label": label, "url": url}
                for label, url in re.findall(r"\[([^\]]+)\]\((https?://[^)]+)\)", body)
            ]
        else:
            stage = "imported" if fact["discovered_in_initial_import"] else "inbox"
            category = "unclassified"
            resource_type = "unclassified"
            note = ""
            tags = []
            takeaway = ""
            body = ""
            curated_at = None
            related = []
            content_links = []
        description = fact.get("description") or "暂无 GitHub 描述。"
        repositories.append({
            "id": fact["repo_id"],
            "repoId": fact["repo_id"],
            "name": fact["full_name"],
            "owner": fact["owner"],
            "avatar": fact.get("owner_avatar_url"),
            "url": fact["url"],
            "homepage": fact.get("homepage"),
            "description": description,
            "editorialSummary": note or description,
            "language": fact.get("language") or "未标注",
            "topics": fact.get("topics", []),
            "license": fact.get("license_spdx") or "未声明",
            "stars": fact.get("stargazers_count", 0),
            "forks": fact.get("forks_count", 0),
            "issues": fact.get("open_issues_count", 0),
            "fork": fact.get("fork", False),
            "archived": fact.get("github_archived", False),
            "sourceStatus": fact["source_status"],
            "starredAt": fact["starred_at"],
            "pushedAt": fact.get("pushed_at") or fact["updated_at"],
            "lastSyncedAt": snapshot["sync"]["checked_at"],
            "category": category,
            "categoryLabel": category_labels[category],
            "resourceTypeId": resource_type,
            "resourceType": resource_labels[resource_type],
            "stage": stage,
            "stageLabel": stage_labels[stage],
            "personalArchived": stage == "archived",
            "tags": tags,
            "note": note,
            "takeaway": takeaway,
            "contentMarkdown": body,
            "curatedAt": curated_at,
            "relatedRepoIds": related,
            "contentLinks": content_links,
            "suggestion": None,
        })
    active = [repo for repo in repositories if repo["sourceStatus"] == "starred"]
    return {
        "schemaVersion": 1,
        "githubUsername": snapshot["github_username"],
        "checkedAt": snapshot["sync"]["checked_at"],
        "categories": categories,
        "resourceTypes": resources,
        "stages": stages,
        "stats": {
            "active": len(active),
            "total": len(repositories),
            "curated": sum(repo["category"] != "unclassified" for repo in active),
            "inbox": sum(repo["stage"] == "inbox" for repo in active),
            "imported": sum(repo["stage"] == "imported" for repo in active),
            "learning": sum(repo["stage"] == "learning" for repo in active),
            "learned": sum(repo["stage"] == "learned" for repo in active),
            "githubArchived": sum(repo["archived"] for repo in active),
            "missing": sum(repo["sourceStatus"] == "missing" for repo in repositories),
        },
        "repositories": repositories,
    }


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()
