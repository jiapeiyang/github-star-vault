const calendar = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" });
export function collectionDate(value) { return calendar.format(new Date(value)); }
export { queryWords } from "./search.js";
import { queryGroups, scoreRepository, searchMatch } from "./search.js";
export function matchExcerpt(repo, query) { return searchMatch(repo, query).text; }
export function filterRepositories(repositories, route) {
  const groups = queryGroups(route.q);
  const scores = new Map();
  const sort = route.sort === "auto" || !route.sort ? (groups.length ? "relevance" : "starred") : route.sort;
  return repositories.filter(repo => {
    const date = collectionDate(repo.starredAt);
    const score = scoreRepository(repo, groups, route.q);
    scores.set(repo.repoId, score);
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
      && score >= 0;
  }).sort((a, b) => {
    const relevance = sort === "relevance" && groups.length ? scores.get(b.repoId) - scores.get(a.repoId) : 0;
    if (relevance) return relevance;
    const diff = sort === "stars" ? b.stars - a.stars : sort === "updated" ? new Date(b.pushedAt) - new Date(a.pushedAt) : new Date(b.starredAt) - new Date(a.starredAt);
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
