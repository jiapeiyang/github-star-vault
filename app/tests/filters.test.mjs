import test from "node:test";
import assert from "node:assert/strict";
import { filterRepositories, chooseRevisit, groupByMonth, matchExcerpt } from "../src/domain/filters.js";
import { defaultRoute } from "../src/domain/routing.js";

const repositories = [
  { repoId: 1, name: "one/agent", owner: "one", description: "Agent runtime", editorialSummary: "", language: "Python", category: "ai-agent", categoryLabel: "AI 与 Agent", resourceTypeId: "app", resourceType: "应用或工具", tags: ["规范"], topics: ["agents"], summary: "用于写作规范", contentMarkdown: "", sourceStatus: "starred", personalArchived: false, archived: false, stars: 10, starredAt: "2026-09-01T00:00:00Z", pushedAt: "2026-09-02T00:00:00Z" },
  { repoId: 2, name: "two/web", owner: "two", description: "Web library", editorialSummary: "", language: "TypeScript", category: "web-client", categoryLabel: "Web、前端与跨端", resourceTypeId: "library", resourceType: "库或框架", tags: [], topics: ["web"], summary: "", contentMarkdown: "", sourceStatus: "starred", personalArchived: false, archived: true, stars: 100, starredAt: "2026-08-01T00:00:00Z", pushedAt: "2026-09-03T00:00:00Z" },
  { repoId: 3, name: "three/old", owner: "three", description: "Old", editorialSummary: "", language: "JavaScript", category: "web-client", categoryLabel: "Web、前端与跨端", resourceTypeId: "app", resourceType: "应用或工具", tags: [], topics: [], summary: "", contentMarkdown: "", sourceStatus: "missing", personalArchived: true, archived: false, stars: 1, starredAt: "2021-01-01T00:00:00Z", pushedAt: "2021-01-01T00:00:00Z" },
];

test("searches repository summaries and combines filters", () => {
  const route = { ...defaultRoute, q: "写作规范", category: "ai-agent", language: "Python" };
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


test("split terms match across fields without phrase adjacency", () => {
 const item={...repositories[0],summary:"Claude 编码工具",contentMarkdown:"支持通过 MCP 接入资料"};
 assert.equal(filterRepositories([item],{...defaultRoute,q:"  CLAUDE   mcp "}).length,1);
 assert.equal(filterRepositories([item],{...defaultRoute,q:"Claude missing"}).length,0);
 assert.match(matchExcerpt(item,"MCP"),/MCP/);
});
test("collection dates and monthly grouping share Shanghai midnight", () => {
 const item={...repositories[0],starredAt:"2025-12-31T16:30:00Z"};
 assert.equal(filterRepositories([item],{...defaultRoute,year:"2026",from:"2026-01-01",to:"2026-01-01"}).length,1);
 assert.equal(filterRepositories([item],{...defaultRoute,year:"2025"}).length,0);
 assert.equal(groupByMonth([item])[0][0],"2026-01");
});
test("revisit reaches every candidate, excludes hidden records and handles empty/single pools", () => {
 const items=Array.from({length:90},(_,i)=>({...repositories[0],repoId:i+1,initialImport:true}));
 const selected=items.map((_,i)=>chooseRevisit(items,()=>(i+.5)/items.length).repoId);
 assert.equal(new Set(selected).size,90);
 assert.equal(chooseRevisit([],()=>0),undefined);
 assert.equal(chooseRevisit([items[0]],()=>0,1).repoId,1);
 assert.notEqual(chooseRevisit(items,()=>0,1).repoId,1);
 assert.equal(chooseRevisit([{...items[0],personalArchived:true},items[1]],()=>0).repoId,2);
});
