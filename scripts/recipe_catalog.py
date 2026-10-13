"""人工任务配方的离线校验与目录转换；不执行步骤、不获取上游资料。"""
from datetime import datetime, timezone
from pathlib import Path
import re

from star_vault import ValidationError, content_date, read_json, web_url


def _require(condition, field, message):
    if not condition:
        raise ValidationError(f"{field}: {message}")


def _text(value, field):
    _require(isinstance(value, str) and value.strip(), field, "必须是非空文字")
    return value


def _list(value, field, *, allow_empty=False):
    _require(isinstance(value, list) and (allow_empty or value), field, "必须是数组" if allow_empty else "必须是非空数组")
    return value


def _texts(value, field):
    return [_text(item, f"{field}[{index}]") for index, item in enumerate(_list(value, field))]


def _sources(value, field):
    _require(all(web_url(item) for item in _texts(value, field)), field, "必须是 HTTP/HTTPS URL")
    return value


def _id(value, seen, field):
    _require(isinstance(value, str) and re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", value) and value not in seen, field, "必须唯一且为小写短横线格式")
    seen.add(value)
    return value


def load_recipes(path: Path, snapshot: dict, topics: list) -> list:
    if not path.exists():
        return []
    data = read_json(path)
    _require(type(data.get("schema_version")) is int and data["schema_version"] == 1, "recipes.schema_version", "只支持版本 1")
    known_repos = {repo["repo_id"] for repo in snapshot["repositories"]}
    known_topics = {topic["id"] for topic in topics}
    seen = set()
    result = []
    for index, recipe in enumerate(_list(data.get("items"), "recipes.items", allow_empty=True)):
        field = f"recipes.items[{index}]"
        _require(isinstance(recipe, dict), field, "必须是对象")
        recipe_id = _id(recipe.get("id"), seen, f"{field}.id")
        field = f"recipes.{recipe_id}"
        topic_ids = _list(recipe.get("topic_ids"), f"{field}.topic_ids", allow_empty=True)
        _require(all(isinstance(item, str) and item in known_topics for item in topic_ids), f"{field}.topic_ids", "必须引用现有专题")
        _require(len(set(topic_ids)) == len(topic_ids), f"{field}.topic_ids", "不能重复")
        reviewed = content_date(recipe.get("reviewed_at"), f"{field}.reviewed_at")
        _require(reviewed and reviewed <= datetime.now(timezone.utc).date().isoformat(), f"{field}.reviewed_at", "必须提供不晚于 UTC 今天的核查日期")
        _require(recipe.get("evidence") == "public-sources", f"{field}.evidence", "首版只支持 public-sources")
        item = {"id": recipe_id, "topicIds": topic_ids, "reviewedAt": reviewed, "evidence": "public-sources"}
        item.update({key: _text(recipe.get(key), f"{field}.{key}") for key in ["title", "summary"]})
        item.update({key: _texts(recipe.get(key), f"{field}.{key}") for key in ["inputs", "outputs", "requirements"]})
        item["sources"] = _sources(recipe.get("sources"), f"{field}.sources")
        tools, tool_ids = [], set()
        for number, tool in enumerate(_list(recipe.get("tools"), f"{field}.tools")):
            tool_field = f"{field}.tools[{number}]"
            _require(isinstance(tool, dict), tool_field, "必须是对象")
            repo_id = tool.get("repo_id")
            _require(type(repo_id) is int and repo_id in known_repos and repo_id not in tool_ids, f"{tool_field}.repo_id", "仓库必须存在且不能重复")
            tool_ids.add(repo_id)
            _require(web_url(tool.get("entry_url")), f"{tool_field}.entry_url", "必须是 HTTP/HTTPS URL")
            tools.append({"repoId": repo_id, "entryUrl": tool["entry_url"],
                          **{key: _text(tool.get(key), f"{tool_field}.{key}") for key in ["role", "reason"]},
                          **{key: _texts(tool.get(key), f"{tool_field}.{key}") for key in ["requirements", "limitations"]},
                          "sources": _sources(tool.get("sources"), f"{tool_field}.sources")})
        steps = _list(recipe.get("steps"), f"{field}.steps")
        _require(3 <= len(steps) <= 6, f"{field}.steps", "首版必须为 3 至 6 步")
        normalized_steps, step_ids, used_tools = [], set(), set()
        for number, step in enumerate(steps):
            step_field = f"{field}.steps[{number}]"
            _require(isinstance(step, dict), step_field, "必须是对象")
            step_id = _id(step.get("id"), step_ids, f"{step_field}.id")
            refs = _list(step.get("tool_ids"), f"{step_field}.tool_ids", allow_empty=True)
            _require(all(type(ref) is int and ref in tool_ids for ref in refs), f"{step_field}.tool_ids", "必须引用本配方工具")
            _require(len(set(refs)) == len(refs), f"{step_field}.tool_ids", "不能重复")
            _require(type(step.get("optional")) is bool, f"{step_field}.optional", "必须是布尔值")
            used_tools.update(refs)
            normalized_steps.append({"id": step_id, "title": _text(step.get("title"), f"{step_field}.title"),
                                     "toolIds": refs, "optional": step["optional"],
                                     **{key: _texts(step.get(key), f"{step_field}.{key}") for key in ["inputs", "actions", "outputs", "checks"]}})
        _require(used_tools == tool_ids, f"{field}.tools", "每个工具必须被至少一个步骤引用")
        result.append({**item, "tools": tools, "steps": normalized_steps})
    return result
