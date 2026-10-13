import { collectionDate, filterRepositories } from "./filters.js";
import { defaultRoute } from "./routing.js";
export const QUEUE_PAGE_SIZE = 30;
export const SOURCE_CHECK_LABELS = { changed: "README 有变化", unavailable: "读取失败", unchanged: "版本相同", unchecked: "尚未检查" };
export function getInboxState(repositories, route, topics = []) {
  const active = repositories.filter(r => r.sourceStatus === "starred" && !r.personalArchived);
  const queues = { unclassified: active.filter(r => r.category === "unclassified"), undescribed: active.filter(r => !r.hasGuide), review: active.filter(r => ["changed","unavailable"].includes(r.sourceCheck?.status)), limited: active.filter(r => r.guideStatus === "limited"), all: active };
  const queue = Object.hasOwn(queues, route.queue) ? route.queue : "unclassified";
  const queueStatus = Object.hasOwn(SOURCE_CHECK_LABELS, route.queueStatus) ? route.queueStatus : "all";
  const topic = topics.find(item => item.id === route.queueTopic);
  const queueTopic = topic?.id || "all";
  const queueSort = route.queueSort === "checked" ? "checked" : "starred";
  const queueCheckedBefore = /^\d{4}-\d{2}-\d{2}$/.test(route.queueCheckedBefore || "") ? route.queueCheckedBefore : "";
  const topicIds = topic ? new Set(topic.entries.map(entry => entry.repoId)) : null;
  const candidates = filterRepositories(queues[queue], { ...defaultRoute, q: route.queueQuery || "" }).filter(repo =>
    (queueStatus === "all" || (repo.sourceCheck?.status || "unchecked") === queueStatus)
    && (!topicIds || topicIds.has(repo.repoId))
    && (!queueCheckedBefore || (repo.sourceCheck?.checked_at && collectionDate(repo.sourceCheck.checked_at) <= queueCheckedBefore))
  );
  if (queueSort === "checked") candidates.sort((a, b) =>
    (a.sourceCheck?.checked_at || "").localeCompare(b.sourceCheck?.checked_at || "") || a.repoId - b.repoId
  );
  const pages = Math.max(1, Math.ceil(candidates.length / QUEUE_PAGE_SIZE));
  const index = candidates.findIndex(r => String(r.repoId) === route.repo);
  const requestedPage = Number(route.queuePage);
  const page = index >= 0 ? Math.floor(index / QUEUE_PAGE_SIZE) + 1 : Math.min(pages, Math.max(1, Number.isSafeInteger(requestedPage) ? requestedPage : 1));
  const items = candidates.slice((page - 1) * QUEUE_PAGE_SIZE, page * QUEUE_PAGE_SIZE);
  const selected = index >= 0 ? candidates[index] : items[0];
  return { queues, queue, page, pages, items, total: candidates.length, selected, route: { ...route, queue, queueStatus, queueTopic, queueSort, queueCheckedBefore, queuePage: String(page), repo: selected ? String(selected.repoId) : "" } };
}
