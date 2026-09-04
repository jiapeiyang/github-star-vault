export const EMPTY_NOTE = "## 学习结论\n\n- 待实际使用后补充。\n\n## 实践记录\n\n- 暂无。\n";

export function initialCurationForm(repo) {
  return {
    category: repo.category || "unclassified",
    resourceType: repo.resourceTypeId || "unclassified",
    stage: repo.curation ? repo.stage : "queued",
    note: repo.curation?.note ?? repo.note ?? "",
    tags: [...(repo.tags || [])],
    body: repo.curation ? repo.contentMarkdown : EMPTY_NOTE,
  };
}

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function hasMeaningfulTakeaway(body) {
  const match = /^##\s+学习结论\s*$/m.exec(body);
  if (!match) return false;
  const rest = body.slice(match.index + match[0].length);
  const end = rest.search(/^##\s+/m);
  const text = (end < 0 ? rest : rest.slice(0, end)).replace(/<!--[\s\S]*?-->/g, "").replace(/^[\s>*#-]+/gm, "").trim();
  const normalized = text.replace(/[。.!！\s]/g, "").toLowerCase();
  return !!text && !["待学习", "待补充", "todo", "tbd", "待实际使用后补充"].includes(normalized);
}

export function validateCuration(repo, form, catalog) {
  const errors = {};
  if (!Number.isSafeInteger(repo.repoId) || repo.repoId <= 0) errors.file = "仓库编号无效。";
  if (repo.curation?.unsupportedFields?.length) errors.file = `文件含有暂不支持的字段：${repo.curation.unsupportedFields.join("、")}。请在 Git 文件中修改，避免丢失内容。`;
  for (const [field, items] of [["category", catalog.categories], ["resourceType", catalog.resourceTypes], ["stage", catalog.stages]]) {
    if (!items.some((item) => item.id === form[field])) errors[field] = "请选择有效选项。";
  }
  if (form.category === "unclassified") errors.category = "请选择主分类。";
  if (form.resourceType === "unclassified") errors.resourceType = "请选择资源类型。";
  if (!form.note.trim()) errors.note = "请填写一句话价值。";
  if (form.tags.length > 5) errors.tags = "最多 5 个标签，请手动移除多余标签。";
  else if (form.tags.some((tag) => !tag.trim())) errors.tags = "标签不能为空，请填写或移除空标签。";
  else if (new Set(form.tags).size !== form.tags.length) errors.tags = "标签不能重复。";
  else if (form.tags.some((tag) => tag.toLowerCase() === repo.language?.toLowerCase())) errors.tags = "语言已有单独字段，无需重复添加为标签。";
  if (form.stage === "learned" && !hasMeaningfulTakeaway(form.body)) errors.body = "设为已学习前，请在「## 学习结论」下填写非占位内容。";
  // 与当前 Python 发布校验使用相同的内联链接边界。
  for (const match of form.body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    if (!/^(https?:\/\/|#)/.test(match[1])) errors.body = "正文链接仅支持 http、https 或页内锚点。";
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
  const date = repo.curation && !modified ? repo.curation.updatedByUserAt : today;
  const header = [
    "+++", `repo_id = ${repo.repoId}`, `category = ${tomlString(form.category)}`,
    `resource_type = ${tomlString(form.resourceType)}`, `stage = ${tomlString(form.stage)}`,
    `tags = [${form.tags.map(tomlString).join(", ")}]`, `note = ${tomlString(form.note)}`,
    `related = [${(repo.relatedRepoIds || []).join(", ")}]`,
  ];
  if (date !== null && date !== undefined) header.push(`updated_by_user_at = ${tomlString(date)}`);
  return `${header.join("\n")}\n+++\n\n${form.body}`;
}
