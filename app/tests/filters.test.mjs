import test from "node:test";
import assert from "node:assert/strict";
import { filterRepositories, chooseRevisit, groupByMonth, matchExcerpt } from "../src/domain/filters.js";
import { defaultRoute } from "../src/domain/routing.js";
import { highlightParts, queryGroups, searchMatch } from "../src/domain/search.js";

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

test("exact name, name, tags and summary outrank a newer body mention", () => {
 const base={...repositories[0],name:"owner/other",description:"",topics:[],tags:[],summary:"",contentMarkdown:""};
 const items=[
  {...base,repoId:1,contentMarkdown:"nanoid",starredAt:"2026-09-07T00:00:00Z",stars:500},
  {...base,repoId:2,summary:"nanoid 的用途",stars:400},
  {...base,repoId:3,tags:["nanoid"],stars:300},
  {...base,repoId:4,name:"owner/nanoid-helper",stars:200},
  {...base,repoId:5,name:"ai/nanoid",stars:100},
 ];
 assert.deepEqual(filterRepositories(items,{...defaultRoute,q:"nanoid"}).map(r=>r.repoId),[5,4,3,2,1]);
 assert.deepEqual(filterRepositories(items,{...defaultRoute,q:"nanoid",sort:"stars"}).map(r=>r.repoId),[1,2,3,4,5]);
 assert.equal(filterRepositories(items,{...defaultRoute,q:"nanoid",sort:"starred"})[0].repoId,1);
 assert.equal(filterRepositories(items,{...defaultRoute,q:"",sort:"auto"})[0].repoId,1);
});

test("aliases are OR within each concept and AND across concepts with English boundaries", () => {
 const base={...repositories[0],name:"x/tool",description:"",topics:[],tags:[],summary:"CLI 支持 OCR",contentMarkdown:""};
 assert.equal(filterRepositories([base],{...defaultRoute,q:"命令行 文字识别"}).length,1);
 assert.equal(filterRepositories([{...base,summary:"client 支持 OCR"}],{...defaultRoute,q:"命令行 文字识别"}).length,0);
 assert.equal(filterRepositories([base],{...defaultRoute,q:"命令行 ppt"}).length,0);
 assert.equal(queryGroups("PPT 幻灯片 演示文稿").length,1);
 assert.equal(filterRepositories([base],{...defaultRoute,q:"ＣＬＩ"}).length,1);
});

test("excerpts point to matching sections, skip fake fenced headings and retain plain bodies", () => {
 const item={summary:"概览",contentMarkdown:"## 它是什么\n简介。\n\n## 怎么使用\n```text\n## 假标题\n```\n使用 OCR 识别。\n\n## 怎么使用\n支持 OCR 和 CLI。"};
 const match=searchMatch(item,"文字识别 命令行");
 assert.equal(match.anchor,"content-怎么使用-1");
 assert.equal(match.section,"怎么使用");
 assert.match(match.text,/OCR 和 CLI/);
 assert.equal(searchMatch({...item,contentMarkdown:"可以通过 MCP 接入"},"MCP").anchor,"");
 assert.match(searchMatch({...item,contentMarkdown:"可以通过 MCP 接入"},"MCP").text,/MCP/);
});

test("highlight treats metacharacters literally and does not highlight expanded cli inside client", () => {
 assert.deepEqual(highlightParts("client CLI 命令行","命令行").filter(p=>p.matched).map(p=>p.text),["CLI","命令行"]);
 assert.deepEqual(highlightParts("C++ [test]", "C++ [test]").filter(p=>p.matched).map(p=>p.text),["C++","[test]"]);
});
