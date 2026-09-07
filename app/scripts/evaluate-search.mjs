// 在根目录运行：node app/scripts/evaluate-search.mjs <基线目录> <报告路径>
// 基线目录须含从同一版本导出的 catalog.json 和 filters.mjs。
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { filterRepositories } from "../src/domain/filters.js";
import { defaultRoute } from "../src/domain/routing.js";

const [baselineDir, output] = process.argv.slice(2);
if (!baselineDir || !output) throw new Error("需要基线目录和报告路径");
const old = await import(pathToFileURL(path.resolve(baselineDir,"filters.mjs")));
const before = JSON.parse(fs.readFileSync(path.join(baselineDir,"catalog.json"))).repositories;
const after = JSON.parse(fs.readFileSync(new URL("../public/data/catalog.json",import.meta.url))).repositories;
const cases = JSON.parse(fs.readFileSync(new URL("../tests/search-cases.json",import.meta.url)));
const rank = (rows,name) => { const i=rows.findIndex(r=>r.name===name);return i<0?null:i+1; };
const items = cases.map(item=>{
  assert.ok(before.some(r=>r.name===item.expected),`基线未收录 ${item.expected}`);
  assert.ok(after.some(r=>r.name===item.expected),`当前未收录 ${item.expected}`);
  const route={...defaultRoute,q:item.query};
  const a=old.filterRepositories(before,{...route,sort:"starred"});
  const b=filterRepositories(after,route);
  return {...item,beforeRank:rank(a,item.expected),afterRank:rank(b,item.expected),beforeTop5:a.slice(0,5).map(r=>r.name),afterTop5:b.slice(0,5).map(r=>r.name),pass:rank(b,item.expected)!==null&&rank(b,item.expected)<=item.maxRank};
});
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,JSON.stringify({baseline:"c5a1c43",method:"v1.2原始资料与默认收藏排序，对比v1.3当前资料与默认相关性排序；人工冻结20个已收录目标。",items},null,2)+"\n");
console.table(items.map(({query,beforeRank,afterRank,pass})=>({query,beforeRank,afterRank,pass})));
assert.ok(items.every(r=>r.pass),"有检索用例未达到冻结标准，请检查报告");
