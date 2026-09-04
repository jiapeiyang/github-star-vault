export function parseTags(value) {
  return value.split(/[、,]/).map((tag) => tag.trim()).filter(Boolean).slice(0, 5);
}

function tomlString(value) {
  return JSON.stringify(value);
}

export function buildCurationTemplate(repo, form, date = new Date().toISOString().slice(0, 10)) {
  const tags = parseTags(form.tags);
  return `+++\nrepo_id = ${repo.repoId}\ncategory = ${tomlString(form.category)}\nresource_type = ${tomlString(form.resourceType)}\nstage = ${tomlString(form.stage)}\ntags = [${tags.map(tomlString).join(", ")}]\nnote = ${tomlString(form.note.trim())}\nrelated = []\nupdated_by_user_at = ${tomlString(date)}\n+++\n\n## 学习结论\n\n- 待实际使用后补充。\n\n## 实践记录\n\n- 暂无。\n`;
}
