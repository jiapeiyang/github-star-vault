import test from "node:test";
import assert from "node:assert/strict";
import { filterRepositories } from "../src/domain/filters.js";
import { defaultRoute } from "../src/domain/routing.js";

const repositories = [
  { repoId: 1, name: "one/agent", owner: "one", description: "Agent runtime", editorialSummary: "", language: "Python", category: "ai-agent", categoryLabel: "AI 与 Agent", resourceTypeId: "app", resourceType: "应用或工具", stage: "queued", tags: ["规范"], topics: ["agents"], note: "用于写作规范", takeaway: "", contentMarkdown: "", sourceStatus: "starred", personalArchived: false, archived: false, stars: 10, starredAt: "2026-09-01T00:00:00Z", pushedAt: "2026-09-02T00:00:00Z" },
  { repoId: 2, name: "two/web", owner: "two", description: "Web library", editorialSummary: "", language: "TypeScript", category: "web-client", categoryLabel: "Web、前端与跨端", resourceTypeId: "library", resourceType: "库或框架", stage: "reference", tags: [], topics: ["web"], note: "", takeaway: "", contentMarkdown: "", sourceStatus: "starred", personalArchived: false, archived: true, stars: 100, starredAt: "2026-08-01T00:00:00Z", pushedAt: "2026-09-03T00:00:00Z" },
  { repoId: 3, name: "three/old", owner: "three", description: "Old", editorialSummary: "", language: "JavaScript", category: "web-client", categoryLabel: "Web、前端与跨端", resourceTypeId: "app", resourceType: "应用或工具", stage: "archived", tags: [], topics: [], note: "", takeaway: "", contentMarkdown: "", sourceStatus: "missing", personalArchived: true, archived: false, stars: 1, starredAt: "2021-01-01T00:00:00Z", pushedAt: "2021-01-01T00:00:00Z" },
];

test("searches personal notes and combines filters", () => {
  const route = { ...defaultRoute, q: "写作规范", category: "ai-agent", stage: "queued", language: "Python" };
  assert.deepEqual(filterRepositories(repositories, route).map((repo) => repo.repoId), [1]);
});

test("default view hides missing and personal archives but keeps upstream archives", () => {
  assert.deepEqual(filterRepositories(repositories, defaultRoute).map((repo) => repo.repoId), [1, 2]);
});

test("can find missing records explicitly", () => {
  const route = { ...defaultRoute, source: "missing", archive: "all" };
  assert.deepEqual(filterRepositories(repositories, route).map((repo) => repo.repoId), [3]);
});

test("sorts with repoId as a stable tie breaker", () => {
  const tied = repositories.slice(0, 2).map((repo) => ({ ...repo, stars: 20 }));
  const route = { ...defaultRoute, sort: "stars" };
  assert.deepEqual(filterRepositories(tied, route).map((repo) => repo.repoId), [1, 2]);
});
