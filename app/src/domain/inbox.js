import { filterRepositories } from "./filters.js";
import { defaultRoute } from "./routing.js";
export const QUEUE_PAGE_SIZE = 30;
export function getInboxState(repositories, route) {
  const active = repositories.filter(r => r.sourceStatus === "starred" && !r.personalArchived);
  const queues = { unclassified: active.filter(r => r.category === "unclassified"), undescribed: active.filter(r => !r.hasGuide), all: active };
  const queue = Object.hasOwn(queues, route.queue) ? route.queue : "unclassified";
  const candidates = filterRepositories(queues[queue], { ...defaultRoute, q: route.queueQuery || "" });
  const pages = Math.max(1, Math.ceil(candidates.length / QUEUE_PAGE_SIZE));
  const index = candidates.findIndex(r => String(r.repoId) === route.repo);
  const requestedPage = Number(route.queuePage);
  const page = index >= 0 ? Math.floor(index / QUEUE_PAGE_SIZE) + 1 : Math.min(pages, Math.max(1, Number.isSafeInteger(requestedPage) ? requestedPage : 1));
  const items = candidates.slice((page - 1) * QUEUE_PAGE_SIZE, page * QUEUE_PAGE_SIZE);
  const selected = index >= 0 ? candidates[index] : items[0];
  return { queues, queue, page, pages, items, total: candidates.length, selected, route: { ...route, queue, queuePage: String(page), repo: selected ? String(selected.repoId) : "" } };
}
