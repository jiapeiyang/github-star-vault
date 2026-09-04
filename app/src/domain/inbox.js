import { filterRepositories } from "./filters.js";
import { defaultRoute } from "./routing.js";

export const QUEUE_PAGE_SIZE = 30;

export function getInboxState(repositories, route) {
  const queues = Object.fromEntries(["inbox", "imported"].map((stage) => [stage, repositories.filter((repo) => repo.stage === stage && repo.sourceStatus === "starred")]));
  const requested = repositories.find((repo) => String(repo.repoId) === route.repo);
  const inferred = ["inbox", "imported"].includes(requested?.stage) && requested.sourceStatus === "starred" ? requested.stage : queues.inbox.length ? "inbox" : "imported";
  const queue = ["inbox", "imported"].includes(route.queue) ? route.queue : inferred;
  const candidates = filterRepositories(queues[queue], { ...defaultRoute, q: route.queueQuery || "", archive: "all" });
  const pages = Math.max(1, Math.ceil(candidates.length / QUEUE_PAGE_SIZE));
  const index = candidates.findIndex((repo) => String(repo.repoId) === route.repo);
  const requestedPage = Number(route.queuePage);
  const page = index >= 0 ? Math.floor(index / QUEUE_PAGE_SIZE) + 1 : Math.min(pages, Math.max(1, Number.isSafeInteger(requestedPage) ? requestedPage : 1));
  const items = candidates.slice((page - 1) * QUEUE_PAGE_SIZE, page * QUEUE_PAGE_SIZE);
  const selected = index >= 0 ? candidates[index] : items[0];
  return { queues, queue, page, pages, items, total: candidates.length, selected, route: { ...route, queue, queuePage: String(page), repo: selected ? String(selected.repoId) : "" } };
}

export function recentLearned(repositories) {
  return repositories.filter((repo) => repo.stage === "learned").sort((a, b) => (b.curatedAt || "").localeCompare(a.curatedAt || "") || a.repoId - b.repoId);
}
