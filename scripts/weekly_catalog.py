"""每周特刊：纯规则编选、不可漂移的名单档案，以及前端只读投影。"""
from datetime import date, datetime, timedelta
import hashlib
from pathlib import Path
from zoneinfo import ZoneInfo

from star_vault import ValidationError, parse_iso, read_json

SHANGHAI = ZoneInfo("Asia/Shanghai")
COOLDOWN_DAYS = 56
OLD_DAYS = 90


def require(condition, field, message):
    if not condition:
        raise ValidationError(f"{field}: {message}")


def text(value, field):
    require(isinstance(value, str) and value.strip(), field, "必须是非空文字")
    return value


def day(value, field):
    try:
        parsed = date.fromisoformat(value)
    except (ValueError, TypeError) as exc:
        raise ValidationError(f"{field}: 必须是 YYYY-MM-DD 日期") from exc
    require(parsed.isoformat() == value, field, "必须是 YYYY-MM-DD 日期")
    return parsed


def local_day(value):
    return parse_iso(value, "时间").astimezone(SHANGHAI).date()


def week_start(now: datetime):
    require(now.tzinfo is not None, "now", "必须包含时区")
    today = now.astimezone(SHANGHAI).date()
    return today - timedelta(days=today.weekday())


def load_weekly_config(path: Path, categories: list):
    config = read_json(path)
    require(type(config.get("schema_version")) is int and config["schema_version"] == 1, "weekly.schema_version", "只支持版本 1")
    themes = config.get("themes")
    require(isinstance(themes, list) and themes, "weekly.themes", "必须是非空数组")
    known = {c["id"] for c in categories} - {"unclassified"}
    seen = set()
    for item in themes:
        require(isinstance(item, dict), "weekly.theme", "必须是对象")
        theme_id = text(item.get("id"), "weekly.theme.id")
        require(theme_id in known and theme_id not in seen, "weekly.theme.id", "必须引用不同的现有领域")
        seen.add(theme_id)
        for key in ("title", "intro", "question"):
            text(item.get(key), f"weekly.{theme_id}.{key}")
    return themes


def validate_archive(archive):
    require(isinstance(archive, dict), "weekly archive", "必须是对象")
    require(type(archive.get("schema_version")) is int and archive["schema_version"] == 1, "weekly archive.schema_version", "只支持版本 1")
    issues = archive.get("issues")
    require(isinstance(issues, list), "weekly archive.issues", "必须是数组")
    previous_week, last_featured = None, {}
    for index, issue in enumerate(issues):
        field = f"weekly archive.issues[{index}]"
        require(isinstance(issue, dict), field, "必须是对象")
        start = day(issue.get("id"), field + ".id")
        require(start.weekday() == 0 and (previous_week is None or start > previous_week), field, "必须按不重复的周一日期升序排列")
        require(type(issue.get("number")) is int and issue["number"] == index + 1, field, "期号必须从 1 连续递增")
        require(day(issue.get("week_end"), field + ".week_end") == start + timedelta(days=6), field, "结束日期必须是本周周日")
        generated = parse_iso(issue.get("generated_at"), field + ".generated_at")
        require(week_start(generated) == start, field, "生成时间必须属于本周")
        checked = parse_iso(issue.get("facts_checked_at"), field + ".facts_checked_at")
        require(checked <= generated, field, "事实检查时间不能晚于生成时间")
        require(type(issue.get("selection_version")) is int and issue["selection_version"] == 1, field, "只支持编选规则版本 1")
        editorial = issue.get("editorial")
        require(isinstance(editorial, dict), field + ".editorial", "必须是人工主题快照")
        for key in ("id", "title", "intro", "question"):
            text(editorial.get(key), field + ".editorial." + key)
        entries = issue.get("entries")
        require(isinstance(entries, list) and 1 <= len(entries) <= 5, field + ".entries", "必须包含 1 至 5 条")
        seen, theme_count, other_categories = set(), 0, set()
        for position, entry in enumerate(entries):
            require(isinstance(entry, dict), field + ".entry", "必须是对象")
            repo_id = entry.get("repo_id")
            require(type(repo_id) is int and repo_id > 0 and repo_id not in seen, field, "repo_id 必须为不重复的正整数")
            seen.add(repo_id)
            slot = entry.get("slot")
            require(slot in ("lead", "theme", "discovery") and (slot == "lead") == (position == 0), field, "首条且仅首条必须是主读")
            basis = entry.get("selection")
            require(isinstance(basis, dict), field + ".selection", "必须有编选依据快照")
            for key in ("name", "category", "category_label"):
                text(basis.get(key), field + ".selection." + key)
            require(basis["category"] != "unclassified", field, "入选时不能未分类")
            starred = parse_iso(basis.get("starred_at"), field + ".starred_at")
            age = (generated.astimezone(SHANGHAI).date() - starred.astimezone(SHANGHAI).date()).days
            require(starred <= generated and type(basis.get("age_days")) is int and basis["age_days"] == age, field, "收藏天数必须与生成时的北京时间一致")
            last = last_featured.get(repo_id)
            require(basis.get("last_featured_week") == (last.isoformat() if last else None), field, "上次入选时间必须与档案一致")
            require(last is None or (start - last).days >= COOLDOWN_DAYS, field, "八周内不能重复入选")
            if slot in ("lead", "theme"):
                theme_count += 1
                require(not other_categories and basis["category"] == editorial["id"], field, "同主题条目须先于跨领域条目且属于本期主题")
            else:
                require(basis["category"] != editorial["id"] and basis["category"] not in other_categories, field, "跨领域条目必须来自不同的其他领域")
                other_categories.add(basis["category"])
            last_featured[repo_id] = start
        require(theme_count <= 3 and len(other_categories) <= 2, field, "最多 3 个同主题与 2 个跨领域条目")
        previous_week = start
    return archive


def load_weekly_archive(path: Path):
    return validate_archive(read_json(path) if path.exists() else {"schema_version": 1, "issues": []})


def generate_issue(catalog: dict, themes: list, archive: dict, now: datetime):
    """返回新一期或 None；不改传入对象，不回填过去，也不覆盖已有一期。"""
    validate_archive(archive)
    start = week_start(now)
    issues = archive["issues"]
    require(not issues or day(issues[-1]["id"], "last issue") <= start, "weekly archive", "已有未来期刊，拒绝倒序写入")
    if any(issue["id"] == start.isoformat() for issue in issues):
        return None
    checked = parse_iso(catalog["checkedAt"], "catalog.checkedAt")
    require(checked <= now, "catalog.checkedAt", "事实检查时间不能晚于生成时间")
    last_featured = {entry["repo_id"]: day(issue["id"], "issue") for issue in issues for entry in issue["entries"]}
    today = now.astimezone(SHANGHAI).date()
    pool = [repo for repo in catalog["repositories"] if
            repo["sourceStatus"] == "starred" and not repo["personalArchived"] and not repo["archived"]
            and repo["hasGuide"] and repo["guideStatus"] == "ready" and repo["category"] != "unclassified"
            and parse_iso(repo["starredAt"], "starredAt") <= now
            and (repo["repoId"] not in last_featured or (start - last_featured[repo["repoId"]]).days >= COOLDOWN_DAYS)]
    pool.sort(key=lambda repo: (
        (today - local_day(repo["starredAt"])).days < OLD_DAYS,
        last_featured.get(repo["repoId"], date.min),
        hashlib.sha256(f"{start.isoformat()}:{repo['repoId']}".encode()).hexdigest(),
    ))
    previous_theme = issues[-1]["editorial"]["id"] if issues else None
    ids = [theme["id"] for theme in themes]
    offset = (ids.index(previous_theme) + 1) % len(themes) if previous_theme in ids else 0
    ordered_themes = themes[offset:] + themes[:offset]
    theme = next((theme for theme in ordered_themes if any(repo["category"] == theme["id"] for repo in pool)), None)
    if not theme:
        return None
    selected = [(repo, "lead" if index == 0 else "theme") for index, repo in enumerate([r for r in pool if r["category"] == theme["id"]][:3])]
    other_categories = set()
    for repo in pool:
        if repo["category"] != theme["id"] and repo["category"] not in other_categories:
            selected.append((repo, "discovery"))
            other_categories.add(repo["category"])
            if len(other_categories) == 2:
                break
    issue = {
        "id": start.isoformat(), "number": len(issues) + 1,
        "week_end": (start + timedelta(days=6)).isoformat(),
        "generated_at": now.replace(microsecond=0).isoformat(), "facts_checked_at": catalog["checkedAt"],
        "selection_version": 1, "editorial": dict(theme),
        "entries": [{"repo_id": repo["repoId"], "slot": slot, "selection": {
            "name": repo["name"], "category": repo["category"], "category_label": repo["categoryLabel"],
            "starred_at": repo["starredAt"], "age_days": (today - local_day(repo["starredAt"])).days,
            "last_featured_week": last_featured[repo["repoId"]].isoformat() if repo["repoId"] in last_featured else None,
        }} for repo, slot in selected],
    }
    validate_archive({"schema_version": 1, "issues": [*issues, issue]})
    return issue


def weekly_for_catalog(archive):
    return [{"id": issue["id"], "number": issue["number"], "weekEnd": issue["week_end"],
             "generatedAt": issue["generated_at"], "factsCheckedAt": issue["facts_checked_at"],
             "selectionVersion": issue["selection_version"], "editorial": issue["editorial"],
             "entries": [{"repoId": entry["repo_id"], "slot": entry["slot"], "selection": {
                 "name": entry["selection"]["name"], "category": entry["selection"]["category"],
                 "categoryLabel": entry["selection"]["category_label"], "starredAt": entry["selection"]["starred_at"],
                 "ageDays": entry["selection"]["age_days"], "lastFeaturedWeek": entry["selection"]["last_featured_week"],
             }} for entry in issue["entries"]]} for issue in archive["issues"]]
