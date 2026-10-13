import test from "node:test";
import assert from "node:assert/strict";
import { getWeeklyCatalog, issueEntries, issueIsPast, guideReadingSections, selectionReason } from "../src/domain/weekly.js";
import { validateCatalog } from "../src/domain/catalog.js";
import { activeNavigationView, defaultRoute, detailReturnRoute, routeFromUrl, urlForRoute } from "../src/domain/routing.js";

const issue = () => ({ id: "2026-10-12", number: 1, weekEnd: "2026-10-18", generatedAt: "2026-10-13T00:00:00Z", factsCheckedAt: "2026-10-12T00:00:00Z", selectionVersion: 1,
  editorial: { id: "web-client", title: "前端", intro: "重读旧收藏", question: "何时会用到？" },
  entries: [{ repoId: 1, slot: "lead", selection: { name: "owner/old-name", category: "web-client", categoryLabel: "前端", starredAt: "2021-07-01T00:00:00Z", ageDays: 1930, lastFeaturedWeek: null } }],
});

test("optional weekly data can fail locally without breaking the repository catalog", () => {
  assert.deepEqual(getWeeklyCatalog({ repositories: [] }), { issues: [], error: "" });
  for (const weeklyIssues of [null, "broken", {}, [null]]) {
    const catalog = { schemaVersion: 2, repositories: [], weeklyIssues };
    assert.equal(validateCatalog(catalog), catalog);
    assert.ok(getWeeklyCatalog(catalog).error);
  }
});

test("bad issue dates, duplicate IDs, wrong slots and unsafe basis cannot render", () => {
  const mutations = [i => { i.id = "2026-02-30"; }, i => { i.id = "2026-10-13"; }, i => { i.weekEnd = "2026-10-19"; },
    i => { i.entries[0].selection = null; }, i => { i.entries[0].repoId = -1; }, i => { i.entries[0].slot = "theme"; },
    i => { i.entries[0].selection.ageDays = "90"; }, i => { i.entries[0].selection.name = null; },
    i => { i.generatedAt = "bad date"; }, i => { i.entries.push(i.entries[0]); }, i => { i.editorial = null; }];
  for (const mutate of mutations) { const i = issue(); mutate(i); assert.ok(getWeeklyCatalog({ weeklyIssues: [i] }).error); }
  assert.ok(getWeeklyCatalog({ weeklyIssues: [issue(), issue()] }).error);
});

test("issues sort by actual publication week without mutating data or inventing history", () => {
  const first = issue(), second = { ...issue(), id: "2026-10-26", weekEnd: "2026-11-01", number: 2 };
  const original = [first, second];
  const result = getWeeklyCatalog({ weeklyIssues: original });
  assert.equal(result.issues[0].id, second.id);
  assert.equal(result.issues.length, 2);
  assert.equal(original[0].id, first.id);
});

test("past issues retain selection facts while reflecting rename, removal and archive", () => {
  const i = issue(), repo = { repoId: 1, name: "owner/new-name", sourceStatus: "starred" };
  const entry = issueEntries(i, [repo])[0];
  assert.equal(entry.repo.name, "owner/new-name");
  assert.equal(entry.selection.name, "owner/old-name");
  assert.match(selectionReason(entry), /1930 天/);
  assert.match(issueEntries(i, [])[0].unavailable, /不在当前目录/);
  assert.equal(issueEntries(i, [{ ...repo, personalArchived: true }])[0].repo, null);
  assert.match(issueEntries(i, [{ ...repo, archived: true }])[0].status, /上游现已归档/);
  assert.match(issueEntries(i, [{ ...repo, sourceStatus: "missing" }])[0].status, /退出公开 Stars/);
});

test("recency notice rolls over on Monday in Beijing rather than the browser timezone", () => {
  assert.equal(issueIsPast(issue(), new Date("2026-10-18T15:59:59Z")), false);
  assert.equal(issueIsPast(issue(), new Date("2026-10-18T16:00:00Z")), true);
});

test("reading excerpts preserve source text, unexecuted notices and fenced headings", () => {
  const markdown = "## 它是什么\n来自原文。\n\n## 如何开始\n前置条件。\n\n## 一个使用示例\n示例未执行：\n```md\n## 代码里的标题\n```\n后续限定。\n\n## 注意事项与相关项目\n不要丢失边界。\n";
  const result = guideReadingSections(markdown);
  assert.deepEqual(result.map(x => x.title), ["它是什么", "如何开始", "一个使用示例"]);
  assert.equal(result[2].id, "content-一个使用示例");
  assert.equal(result[2].markdown, "示例未执行：\n```md\n## 代码里的标题\n```\n后续限定。");
  assert.equal(result[0].markdown, "来自原文。");
  assert.deepEqual(guideReadingSections(""), []);
});

test("weekly and detail deep links preserve the Pages base, issue and section", () => {
  const base = "https://example.test/github-star-vault/";
  const route = { ...defaultRoute, view: "weekly", issue: issue().id, anchor: "weekly-item-1" };
  const href = urlForRoute(route, base);
  assert.deepEqual(routeFromUrl(new URL(href, base).href), route);
  assert.ok(href.startsWith("/github-star-vault/"));
  const detail = { ...route, view: "detail", repo: "1", anchor: "content-如何开始" };
  assert.deepEqual(routeFromUrl(new URL(urlForRoute(detail, base), base).href), detail);
  assert.equal(detailReturnRoute(detail, [], [issue()]).view, "weekly");
  assert.equal(detailReturnRoute(detail, [], [issue()]).issue, issue().id);
  assert.equal(detailReturnRoute({ ...detail, issue: "missing" }, [], [issue()]).view, "library");
  assert.equal(activeNavigationView(route, null, [], [issue()]), "history");
  assert.equal(activeNavigationView(detail, null, [], [issue()]), "history");
  assert.equal(routeFromUrl(`${base}?view=weekly&issue=missing`).issue, "missing");
  assert.equal(routeFromUrl(`${base}#weekly-item-<script>`).anchor, "");
});
