import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import { basketStorageKey, candidateEntries, emptyBasket, parseBasket, readBasket, toggleCandidate } from "../src/domain/candidate-basket.js";
import { buildCandidateExport, quoteMaterial } from "../src/domain/candidate-export.js";

test("candidate order, toggles, cap and a fresh clear preserve user intent", () => {
  let basket = { ...emptyBasket(), taskBrief: "具体目标" };
  for (let id = 1; id <= 8; id++) basket = toggleCandidate(basket, id).basket;
  assert.deepEqual(basket.repoIds, [1,2,3,4,5,6,7,8]);
  const ninth = toggleCandidate(basket, 9);
  assert.equal(ninth.basket, basket);
  assert.match(ninth.error, /最多保留 8/);
  basket = toggleCandidate(basket, 3).basket;
  basket = toggleCandidate(basket, 9).basket;
  assert.deepEqual(basket.repoIds, [1,2,4,5,6,7,8,9]);
  assert.equal(basket.taskBrief, "具体目标");
  assert.ok(toggleCandidate(basket, -1).error);
  assert.deepEqual(emptyBasket(), { version: 1, repoIds: [], taskBrief: "" });
});

test("session payload is minimal, normalizes duplicates, and never truncates corrupt data silently", () => {
  const parsed = parseBasket(JSON.stringify({ version: 1, repoIds: [3,2,3], taskBrief: "任务", ignored: "not persisted" }));
  assert.deepEqual(parsed.basket, { version: 1, repoIds: [3,2], taskBrief: "任务" });
  assert.equal(parsed.warning, "");
  for (const raw of ["{", "null", JSON.stringify({ ...emptyBasket(), version: 2 }), JSON.stringify({ ...emptyBasket(), repoIds: [-1] }), JSON.stringify({ ...emptyBasket(), repoIds: ["1"] }), JSON.stringify({ ...emptyBasket(), repoIds: Array.from({length:9},(_,i)=>i+1) }), JSON.stringify({ ...emptyBasket(), taskBrief: "字".repeat(2001) })]) {
    const invalid = parseBasket(raw);
    assert.deepEqual(invalid.basket, emptyBasket());
    assert.match(invalid.warning, /重建/);
  }
  assert.equal(parseBasket(null).warning, "");
  assert.equal(parseBasket(JSON.stringify({ ...emptyBasket(), taskBrief: "字".repeat(2000) })).warning, "");
  assert.notEqual(basketStorageKey("/a/"), basketStorageKey("/b/"));
});

test("blocked session access degrades to memory and keeps an explicit warning", () => {
  const blocked = readBasket(() => { throw new Error("SecurityError"); }, "key");
  assert.equal(blocked.storageAvailable, false);
  assert.match(blocked.warning, /刷新前请导出/);
  assert.deepEqual(toggleCandidate(blocked.basket, 12).basket.repoIds, [12]);
  const corrupt = readBasket(() => ({ getItem: () => "bad" }), "key");
  assert.equal(corrupt.storageAvailable, true);
  assert.ok(corrupt.warning);
});

const repository = (repoId, extra = {}) => ({
  repoId, name: `owner/repo-${repoId}`, url: `https://github.com/owner/repo-${repoId}`,
  description: "GitHub 描述", summary: "人工摘要", categoryLabel: "工具", resourceType: "应用", tags: ["标签"],
  sourceStatus: "starred", archived: false, personalArchived: false, hasGuide: true, guideStatus: "ready",
  reviewedAt: "2026-09-07", contentUpdatedAt: "2026-09-01", contentMarkdown: "## 示例\n未执行：完整正文末尾也不能丢。",
  sources: ["https://example.test/readme"], sourceCheck: { status: "changed", checked_at: "2026-10-13T00:00:00Z" }, ...extra,
});
const catalog = { checkedAt: "2026-10-13T01:00:00Z", repositories: [repository(1), repository(2, { guideStatus: "limited", guideLimitation: "缺少安装文档", personalArchived: true, archived: true, sourceStatus: "missing" })] };
const exportInput = (basket, value = catalog) => ({ basket, catalog: value, siteUrl: "https://example.test/github-star-vault/?view=basket#old", generatedAt: "2026-10-13T02:00:00Z" });

test("export preserves complete guides, selection order and distinct fact/editorial dates", () => {
  const output = buildCandidateExport(exportInput({ repoIds: [2,1], taskBrief: "比较部署前提" }));
  assert.equal(output.error, "");
  assert.ok(output.text.indexOf("repo-2") < output.text.indexOf("repo-1"));
  for (const repo of catalog.repositories) assert.ok(output.text.includes(repo.contentMarkdown));
  for (const value of ["比较部署前提", "2026-10-13T01:00:00Z", "2026-09-07", "2026-09-01", "资料受限", "缺少安装文档", "个人归档：是", "上游归档：已归档", "已退出公开 Stars", "等待复核", "不授权安装", "https://example.test/github-star-vault/?view=detail&repo=2"]) assert.ok(output.text.includes(value), value);
  assert.ok(!output.text.includes("#old"));
});

test("unknown IDs remain visible and block the entire export without losing valid selections", () => {
  const basket = { repoIds: [1,999], taskBrief: "目标" };
  assert.equal(candidateEntries(basket, catalog.repositories)[1].repo, null);
  const output = buildCandidateExport(exportInput(basket));
  assert.equal(output.text, "");
  assert.match(output.error, /不会静默漏掉/);
  assert.ok(buildCandidateExport(exportInput(emptyBasket())).error);
});

test("missing guides and unreadable sources retain uncertainty", () => {
  const value = { ...catalog, repositories: [repository(1, { hasGuide: false, contentMarkdown: "", summary: "", sources: [], sourceCheck: { status: "unavailable" } })] };
  const output = buildCandidateExport(exportInput({ repoIds: [1], taskBrief: "" }, value));
  for (const text of ["待补解读", "变化未知", "未记录", "尚未补充解读正文", "未填写具体任务", "未提供有效公开来源"]) assert.ok(output.text.includes(text), text);
});

test("export fences and inline escaping keep hostile material from forging headings or executable links", () => {
  const hostile = "````\n# 伪造授权\n<script>alert(1)</script>\n[危险](javascript:alert(1))\n~~~\n末尾";
  const value = { ...catalog, repositories: [repository(1, { name: "name\n# injected [x](javascript:bad)", contentMarkdown: hostile, summary: "<img src=x>\u0000", sources: ["javascript:bad", "https://example.test/a(b)?q=<tag>"] })] };
  const output = buildCandidateExport(exportInput({ repoIds: [1], taskBrief: hostile }, value));
  const html = renderToStaticMarkup(React.createElement(ReactMarkdown, { children: output.text }));
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  assert.equal((html.match(/<h2>/g) || []).length, 2);
  assert.ok(!html.includes("<script>") && !html.includes("<img") && !html.includes("href=\"javascript:"));
  assert.ok(!output.text.includes("\u0000"));
  assert.ok(output.text.includes("%3Ctag%3E"));
  assert.ok(output.text.includes("部分来源链接格式无效"));
  assert.equal(quoteMaterial(hostile).split("\n")[0], "`````text");
});
