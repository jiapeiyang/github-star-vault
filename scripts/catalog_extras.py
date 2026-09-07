"""专题与来源核查记录：构建只读取现有文件，不访问网络。"""
from pathlib import Path
from star_vault import ValidationError, read_json, parse_iso, web_url
import re


def load_topics(path: Path, snapshot: dict) -> list:
    if not path.exists():
        return []
    values = read_json(path).get("items")
    if not isinstance(values, list):
        raise ValidationError("topics.items 必须是数组")
    repo_ids = {r["repo_id"] for r in snapshot["repositories"]}
    ids = set()
    result = []
    for topic in values:
        if not isinstance(topic, dict) or not isinstance(topic.get("id"), str) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", topic["id"]) or topic["id"] in ids:
            raise ValidationError("专题 id 必须唯一且为小写短横线格式")
        ids.add(topic["id"])
        if any(not isinstance(topic.get(k), str) or not topic[k].strip() for k in ["title", "description"]):
            raise ValidationError("专题必须有标题和介绍")
        entries = topic.get("entries")
        if not isinstance(entries, list) or not entries:
            raise ValidationError("专题必须有项目")
        seen = set()
        for entry in entries:
            if not isinstance(entry, dict) or type(entry.get("repo_id")) is not int or entry["repo_id"] not in repo_ids or entry["repo_id"] in seen:
                raise ValidationError("专题仓库必须存在且不能重复")
            seen.add(entry["repo_id"])
            if not isinstance(entry.get("reason"), str) or not entry["reason"].strip():
                raise ValidationError("专题条目必须说明适用场景")
        result.append({"id":topic["id"],"title":topic["title"],"description":topic["description"],"entries":[{"repoId":e["repo_id"],"reason":e["reason"]} for e in entries]})
    return result


def load_source_checks(path: Path, snapshot: dict) -> dict:
    if not path.exists():
        return {}
    data = read_json(path)
    parse_iso(data.get("checked_at"), "guide-source-check.checked_at")
    values = data.get("items")
    if not isinstance(values, list):
        raise ValidationError("来源核查 items 必须是数组")
    ids = {r["repo_id"] for r in snapshot["repositories"]}
    result = {}
    for item in values:
        if not isinstance(item, dict) or type(item.get("repo_id")) is not int or item["repo_id"] not in ids or item["repo_id"] in result:
            raise ValidationError("来源核查 repo_id 无效或重复")
        if item.get("status") not in {"unchanged","changed","unavailable"} or not web_url(item.get("source_url")):
            raise ValidationError("来源核查状态或 URL 无效")
        for key in ["baseline_sha","observed_sha"]:
            value=item.get(key)
            if value is not None and (not isinstance(value,str) or not re.fullmatch(r"[0-9a-f]{40}",value)):
                raise ValidationError("来源核查 SHA 无效")
        if not item.get("baseline_sha"):
            raise ValidationError("来源核查缺少基线 SHA")
        if item["status"] != "unavailable":
            if not item.get("observed_sha") or (item["baseline_sha"] == item["observed_sha"]) != (item["status"] == "unchanged"):
                raise ValidationError("来源核查状态与 SHA 不一致")
        elif item.get("observed_sha") is not None:
            raise ValidationError("来源不可读取时不能记录 observed_sha")
        parse_iso(item.get("checked_at", data["checked_at"]), "来源逐项核查时间")
        result[item["repo_id"]] = item
    return {"checked_at":data["checked_at"],"items":result}
