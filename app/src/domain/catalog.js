export function formatCount(value) {
  if (value >= 100000) return `${Math.round(value / 1000)}k`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value ?? 0);
}

export function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

export function formatDate(value, options = {}) {
  if (!value) return "暂无";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...options,
  }).format(new Date(value));
}

export function validateCatalog(catalog) {
  if (!catalog || catalog.schemaVersion !== 1 || !Array.isArray(catalog.repositories)) {
    throw new Error("目录数据格式不受支持");
  }
  const ids = new Set();
  for (const repo of catalog.repositories) {
    if (!Number.isInteger(repo.repoId) || ids.has(repo.repoId)) throw new Error("目录包含重复或非法 repoId");
    ids.add(repo.repoId);
  }
  return catalog;
}

export async function loadCatalog() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/catalog.json`, { cache: "no-store" });
  if (!response.ok) throw new Error(`目录加载失败（HTTP ${response.status}）`);
  return validateCatalog(await response.json());
}
