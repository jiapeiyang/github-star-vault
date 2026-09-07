const calendar = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" });
export function collectionDate(value) { return calendar.format(new Date(value)); }
export function queryWords(query = "") { return [...new Set(query.trim().toLocaleLowerCase("zh-CN").split(/\s+/).filter(Boolean))]; }
export function searchText(repo) {
  return [repo.name, repo.owner, repo.description, repo.summary, repo.language, repo.categoryLabel, repo.resourceType, repo.contentMarkdown, ...(repo.topics || []), ...(repo.tags || [])].join(" ").toLocaleLowerCase("zh-CN");
}
export function matchExcerpt(repo, query) {
  const words = queryWords(query);
  const summary = repo.summary || repo.description || "";
  if (!words.length || words.some(word => summary.toLowerCase().includes(word))) return summary;
  const body = (repo.contentMarkdown || "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[#*`>]/g, "").replace(/\s+/g, " ").trim();
  const index = body.toLowerCase().search(new RegExp(words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "i"));
  if (index < 0) return summary;
  const start = Math.max(0, index - 35);
  return `${start ? "…" : ""}${body.slice(start, start + 170)}${body.length > start + 170 ? "…" : ""}`;
}
export function filterRepositories(repositories, route) {
  const words = queryWords(route.q);
  return repositories.filter(repo => {
    const date = collectionDate(repo.starredAt);
    return (route.source === "all" || repo.sourceStatus === route.source)
      && (route.archive === "all" || (route.archive === "active" && !repo.personalArchived) || (route.archive === "github" && repo.archived) || (route.archive === "personal" && repo.personalArchived))
      && (route.category === "all" || repo.category === route.category)
      && (route.type === "all" || repo.resourceTypeId === route.type)
      && (route.language === "all" || repo.language === route.language)
      && (route.tag === "all" || repo.tags.includes(route.tag))
      && (!route.year || route.year === "all" || date.startsWith(`${route.year}-`))
      && (!route.from || date >= route.from) && (!route.to || date <= route.to)
      && (!route.coverage || route.coverage === "all" || (route.coverage === "ready" ? repo.hasGuide : !repo.hasGuide))
      && (!route.origin || route.origin === "all" || !repo.initialImport)
      && (!words.length || words.every(word => searchText(repo).includes(word)));
  }).sort((a, b) => {
    const diff = route.sort === "stars" ? b.stars - a.stars : route.sort === "updated" ? new Date(b.pushedAt) - new Date(a.pushedAt) : new Date(b.starredAt) - new Date(a.starredAt);
    return diff || a.repoId - b.repoId;
  });
}
export function chooseRevisit(repositories, random = Math.random, previousId) {
  const active = repositories.filter(r => r.sourceStatus === "starred" && !r.personalArchived);
  const historical = active.filter(r => r.initialImport);
  const pool = historical.length ? historical : active;
  const candidates = pool.length > 1 ? pool.filter(r => r.repoId !== previousId) : pool;
  return candidates[Math.min(candidates.length - 1, Math.floor(random() * candidates.length))];
}
export function groupByMonth(repositories) {
  const groups = new Map();
  for (const repo of repositories) {
    const month = collectionDate(repo.starredAt).slice(0, 7);
    if (!groups.has(month)) groups.set(month, []);
    groups.get(month).push(repo);
  }
  return [...groups.entries()].sort(([a], [b]) => b.localeCompare(a));
}
