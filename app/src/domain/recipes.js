const text = value => typeof value === "string" && value.trim().length > 0;
const texts = value => Array.isArray(value) && value.length > 0 && value.every(text);
const slug = value => typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const unique = values => new Set(values).size === values.length;
const web = value => {
  if (typeof value !== "string" || /[\s\x00-\x1f\x7f]/.test(value)) return false;
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && !!url.hostname; } catch { return false; }
};
const sources = value => Array.isArray(value) && value.length > 0 && value.every(web);

// recipes 是可选内容，异常只影响配方，不拒绝已可读取的仓库目录。
export function getRecipeCatalog(catalog) {
  const recipes = catalog?.recipes;
  if (recipes === undefined) return { recipes: [], error: "" };
  const invalid = { recipes: [], error: "任务配方资料暂不可用，仍可浏览项目库和使用候选工具篮。" };
  if (!Array.isArray(recipes)) return invalid;
  const repoIds = new Set((catalog.repositories || []).map(repo => repo.repoId));
  const topicIds = new Set((catalog.topics || []).map(topic => topic.id));
  const ids = [];
  for (const recipe of recipes) {
    if (!recipe || !slug(recipe.id) || !text(recipe.title) || !text(recipe.summary)
      || ![recipe.inputs, recipe.outputs, recipe.requirements].every(texts)
      || recipe.evidence !== "public-sources" || !sources(recipe.sources)
      || typeof recipe.reviewedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(recipe.reviewedAt)
      || !Array.isArray(recipe.topicIds) || !unique(recipe.topicIds) || !recipe.topicIds.every(id => topicIds.has(id))
      || !Array.isArray(recipe.tools) || !recipe.tools.length
      || !Array.isArray(recipe.steps) || recipe.steps.length < 3 || recipe.steps.length > 6) return invalid;
    const tools = recipe.tools;
    if (!tools.every(tool => tool && Number.isSafeInteger(tool.repoId) && repoIds.has(tool.repoId)
      && text(tool.role) && text(tool.reason) && web(tool.entryUrl)
      && texts(tool.requirements) && texts(tool.limitations) && sources(tool.sources))) return invalid;
    const toolIds = tools.map(tool => tool.repoId);
    if (!unique(toolIds)) return invalid;
    if (!recipe.steps.every(step => step && slug(step.id) && text(step.title)
      && [step.inputs, step.actions, step.outputs, step.checks].every(texts)
      && typeof step.optional === "boolean" && Array.isArray(step.toolIds) && unique(step.toolIds)
      && step.toolIds.every(id => toolIds.includes(id)))) return invalid;
    if (!unique(recipe.steps.map(step => step.id))
      || !toolIds.every(id => recipe.steps.some(step => step.toolIds.includes(id)))) return invalid;
    ids.push(recipe.id);
  }
  return unique(ids) ? { recipes, error: "" } : invalid;
}

export function recipeTools(step, recipe, repositories) {
  return step.toolIds.flatMap(id => {
    const repo = repositories.find(item => item.repoId === id);
    const tool = recipe.tools.find(item => item.repoId === id);
    return repo && tool && !repo.personalArchived ? [{ ...tool, repo }] : [];
  });
}
