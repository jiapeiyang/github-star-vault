import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { gzipSync } from "node:zlib";
import { filterRepositories, filterRecoveryOptions } from "../src/domain/filters.js";
import { defaultRoute } from "../src/domain/routing.js";

const [output] = process.argv.slice(2);
if (!output) throw new Error("需要报告输出路径；先运行构建生成 catalog.json");
const catalogBytes = fs.readFileSync(new URL("../public/data/catalog.json", import.meta.url));
const catalogText = catalogBytes.toString("utf8");
const catalog = JSON.parse(catalogText);
const cases = JSON.parse(fs.readFileSync(new URL("../tests/search-cases.json", import.meta.url)));
const samples = 50;
const warmups = 10;

function measure(operation) {
  for (let index = 0; index < warmups; index += 1) operation();
  const durations = [];
  for (let index = 0; index < samples; index += 1) {
    const started = performance.now();
    operation();
    durations.push(performance.now() - started);
  }
  durations.sort((left, right) => left - right);
  const percentile = fraction => Number(durations[Math.ceil(samples * fraction) - 1].toFixed(3));
  return { medianMs: percentile(0.5), p95Ms: percentile(0.95), maxMs: percentile(1) };
}

const queries = cases.map(item => {
  const route = { ...defaultRoute, q: item.query };
  const matches = filterRepositories(catalog.repositories, route);
  const expectedIndex = matches.findIndex(repo => repo.name === item.expected);
  const rank = expectedIndex < 0 ? null : expectedIndex + 1;
  return { ...item, rank, matches: matches.length, pass: rank !== null && rank <= item.maxRank,
    ...measure(() => filterRepositories(catalog.repositories, route)) };
});
const emptyRoute = { ...defaultRoute, q: "canvas-ui", category: "ai-agent" };
const report = {
  measuredAt: new Date().toISOString(), node: process.version, platform: process.platform, arch: process.arch,
  method: "本机 Node 单进程，10 次预热后各测 50 次；过滤包含实际相关性排序。非浏览器渲染、非真实用户或移动设备数据。gzip 为本地压缩估算，不代表托管传输。",
  samples, warmups, repositories: catalog.repositories.length, stats: catalog.stats,
  bytes: catalogBytes.length, gzipBytes: gzipSync(catalogBytes).length,
  parse: measure(() => JSON.parse(catalogText)),
  defaultList: { matches: filterRepositories(catalog.repositories, defaultRoute).length,
    ...measure(() => filterRepositories(catalog.repositories, defaultRoute)) },
  emptyRecovery: { query: emptyRoute.q, category: emptyRoute.category,
    options: filterRecoveryOptions(catalog.repositories, emptyRoute),
    ...measure(() => filterRecoveryOptions(catalog.repositories, emptyRoute)) },
  queries,
};
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ output, bytes: report.bytes, gzipBytes: report.gzipBytes, stats: report.stats,
  parse: report.parse, defaultList: report.defaultList, emptyRecovery: report.emptyRecovery,
  searchPasses: queries.filter(item => item.pass).length, searchCases: queries.length,
  slowestSearchP95Ms: Math.max(...queries.map(item => item.p95Ms)) }, null, 2));
assert.ok(queries.every(item => item.pass), "冻结检索用例未达标，请检查报告");
