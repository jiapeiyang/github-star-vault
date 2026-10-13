export const CANDIDATE_LIMIT = 8;
export const TASK_BRIEF_LIMIT = 2000;
export const emptyBasket = () => ({ version: 1, repoIds: [], taskBrief: "" });
export const basketStorageKey = base => `star-vault:candidate-basket:v1:${base}`;
export const STORAGE_WARNING = "当前无法暂存，刷新前请导出。";
const damaged = "之前暂存的候选资料格式无效，请重新选择；新的操作会重建工具篮。";

export function parseBasket(raw) {
  if (raw === null) return { basket: emptyBasket(), warning: "" };
  try {
    const value = JSON.parse(raw);
    if (!value || value.version !== 1 || !Array.isArray(value.repoIds)
      || !value.repoIds.every(id => Number.isSafeInteger(id) && id > 0)
      || typeof value.taskBrief !== "string" || value.taskBrief.length > TASK_BRIEF_LIMIT) throw new Error("invalid basket");
    const repoIds = [...new Set(value.repoIds)];
    if (repoIds.length > CANDIDATE_LIMIT) throw new Error("too many candidates");
    return { basket: { version: 1, repoIds, taskBrief: value.taskBrief }, warning: "" };
  } catch {
    return { basket: emptyBasket(), warning: damaged };
  }
}

export function readBasket(getStorage, key) {
  try { return { ...parseBasket(getStorage().getItem(key)), storageAvailable: true }; }
  catch { return { basket: emptyBasket(), warning: STORAGE_WARNING, storageAvailable: false }; }
}

export function toggleCandidate(basket, repoId) {
  if (!Number.isSafeInteger(repoId) || repoId <= 0) return { basket, error: "项目 ID 无效，无法加入候选。" };
  if (basket.repoIds.includes(repoId)) return { basket: { ...basket, repoIds: basket.repoIds.filter(id => id !== repoId) }, error: "" };
  if (basket.repoIds.length >= CANDIDATE_LIMIT) return { basket, error: "最多保留 8 个候选，请先移除一项。" };
  return { basket: { ...basket, repoIds: [...basket.repoIds, repoId] }, error: "" };
}

export function candidateEntries(basket, repositories) {
  return basket.repoIds.map(repoId => ({ repoId, repo: repositories.find(repo => repo.repoId === repoId) || null }));
}
