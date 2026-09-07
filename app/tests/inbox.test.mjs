import test from "node:test";
import assert from "node:assert/strict";
import { getInboxState } from "../src/domain/inbox.js";
import { defaultRoute, routeFromUrl, urlForRoute } from "../src/domain/routing.js";

const repos = Array.from({ length: 65 }, (_, i) => ({ repoId: i + 1, name: `example/repo-${i + 1}`, category: "unclassified", sourceStatus: "starred", starredAt: "2026-09-01T00:00:00Z", tags: [], topics: [] }));
const route = { ...defaultRoute, view: "inbox" };

test("65 entries expose three pages and selected id locates the correct page", () => {
  const first = getInboxState(repos, route);
  assert.equal(first.pages, 3);
  assert.equal(first.items.length, 30);
  const third = getInboxState(repos, { ...route, queuePage: "3" });
  assert.equal(third.selected.repoId, 61);
  assert.equal(third.items.length, 5);
  const direct = getInboxState(repos, { ...route, repo: "45" });
  assert.equal(direct.page, 2);
  assert.equal(direct.selected.repoId, 45);
  const restored = routeFromUrl(`https://example.test${urlForRoute(direct.route, 'https://example.test/')}`);
  assert.deepEqual(getInboxState(repos, restored).route, direct.route);
});

test("switch, search, invalid pages and missing selections resolve consistently", () => {
  for (const queuePage of ["NaN", "-2", "0", "1.5"]) assert.equal(getInboxState(repos, { ...route, queuePage }).page, 1);
  assert.equal(getInboxState(repos, { ...route, queuePage: "999" }).page, 3);
  const search = getInboxState(repos, { ...route, queueQuery: "repo-65", repo: "45" });
  assert.equal(search.selected.repoId, 65);
  assert.equal(search.route.repo, "65");
  const empty = getInboxState(repos, { ...route, queueQuery: "unknown", repo: "45" });
  assert.equal(empty.selected, undefined);
  assert.equal(empty.route.repo, "");
  assert.equal(getInboxState(repos, { ...route, queue: "all" }).total, 65);
});

test("maintenance queues distinguish missing guides, changed sources and limited materials", () => {
 const items=repos.slice(0,4).map((r,i)=>({...r,hasGuide:i!==0,guideStatus:i===3?"limited":"ready",sourceCheck:i===1?{status:"changed"}:i===2?{status:"unavailable"}:{status:"unchanged"}}));
 const queues=getInboxState(items,route).queues;
 assert.deepEqual(queues.undescribed.map(r=>r.repoId),[1]);
 assert.deepEqual(queues.review.map(r=>r.repoId),[2,3]);
 assert.deepEqual(queues.limited.map(r=>r.repoId),[4]);
});
