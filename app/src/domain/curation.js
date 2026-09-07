import { safeContentUrl } from "./markdown.js";

export function initialCurationForm(repo) {
  return {
    category: repo.category || "unclassified",
    resourceType: repo.resourceTypeId || "unclassified",
    summary: repo.summary || "",
    tags: [...(repo.tags || [])],
    body: repo.contentMarkdown || "",
  };
}

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function validateCuration(repo, form, catalog) {
  const errors = {};
  if (!Number.isSafeInteger(repo.repoId) || repo.repoId <= 0) errors.file = "仓库编号无效。";
  if (repo.curation?.unsupportedFields?.length) errors.file = `文件含有暂不支持的字段：${repo.curation.unsupportedFields.join("、")}。请在 Git 文件中修改，避免丢失内容。`;
  for (const [field, items] of [["category", catalog.categories], ["resourceType", catalog.resourceTypes]]) {
    if (!items.some((item) => item.id === form[field])) errors[field] = "请选择有效选项。";
  }
  if (form.category === "unclassified") errors.category = "请选择主分类。";
  if (form.resourceType === "unclassified") errors.resourceType = "请选择资源类型。";
  if (!form.summary.trim()) errors.summary = "请填写仓库摘要。";
  if (form.tags.length > 5) errors.tags = "最多 5 个标签，请手动移除多余标签。";
  else if (form.tags.some((tag) => !tag.trim())) errors.tags = "标签不能为空，请填写或移除空标签。";
  else if (new Set(form.tags.map(tag => tag.trim().toLowerCase())).size !== form.tags.length) errors.tags = "标签不能重复。";
  else if (form.tags.some((tag) => tag.toLowerCase() === repo.language?.toLowerCase())) errors.tags = "语言已有单独字段，无需重复添加为标签。";
  if (repo.reviewedAt && ["它是什么", "适合什么场景", "如何开始", "一个使用示例", "注意事项与相关项目", "资料来源"].some(title => !form.body.split("\n").some(line => line.trim() === `## ${title}`))) errors.body = "已核查的解读需要保留完整章节。";
  if (/^##[ \t]+(?:学习结论|实践记录|学习笔记)[ \t]*$/m.test(form.body)) errors.body = "旧个人记录章节已移除，请使用仓库解读章节。";
  // 与当前 Python 发布校验使用相同的内联链接边界。
  for (const match of form.body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    if (!safeContentUrl(match[1])) errors.body = "正文链接仅支持 http、https 或页内锚点。";
  }
  return errors;
}

function tomlString(value) {
  // JSON 的控制字符转义不全被 TOML 接受，例如 DEL 必须写为 Unicode 转义。
  return `"${value.replace(/["\\\u0000-\u001f\u007f-\u009f]/g, (char) => {
    if (char === '"') return '\\"';
    if (char === "\\") return "\\\\";
    return `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`;
  })}"`;
}

export function formChanged(form, baseline) {
  return JSON.stringify(form) !== JSON.stringify(baseline);
}

export function buildCurationTemplate(repo, form, today = localDate()) {
  if (repo.curation?.unsupportedFields?.length) throw new Error("存在不支持的字段，无法安全导出。");
  const modified = formChanged(form, initialCurationForm(repo));
  const date = repo.curation && !modified ? repo.contentUpdatedAt : today;
  const header = [
    "+++", `repo_id = ${repo.repoId}`, `category = ${tomlString(form.category)}`,
    `resource_type = ${tomlString(form.resourceType)}`, `personal_archived = ${repo.personalArchived ? "true" : "false"}`,
    `tags = [${form.tags.map(tomlString).join(", ")}]`, `summary = ${tomlString(form.summary)}`,
    `related = [${(repo.relatedRepoIds || []).join(", ")}]`,
  ];
  if (date !== null && date !== undefined) header.push(`content_updated_at = ${tomlString(date)}`);
  if (repo.reviewedAt) header.push(`reviewed_at = ${tomlString(repo.reviewedAt)}`);
  if (repo.sources?.length) header.push(`sources = [${repo.sources.map(tomlString).join(", ")}]`);
  return `${header.join("\n")}\n+++\n\n${form.body}`;
}
