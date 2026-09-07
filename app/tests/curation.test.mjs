import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildCurationTemplate, initialCurationForm, localDate, validateCuration } from "../src/domain/curation.js";

const catalog = { categories: [{ id: "ai-agent" }], resourceTypes: [{ id: "collection" }] };
const repo = { repoId: 101, name: "example/alpha", category: "ai-agent", resourceTypeId: "collection", personalArchived: true, tags: ["规范,结构", "原样标签"], summary: ' 原始 "内容" \\ 路径\n第二行\t\u0001\u007f\u0085 ', relatedRepoIds: [103], language: "Python", contentMarkdown: "## 仓库介绍\n\n- 清理副作用并保留资料正文。\n\n```js\nconst x = '<safe>';\n```\n", contentUpdatedAt: "2026-09-01", sources: ["https://example.com/docs"], curation: { unsupportedFields: [] } };

test("unchanged export preserves summary, all tags, body, relations and original date in real Python parser", () => {
  const item={...repo,relatedNotes:{"103":'用 "不同" 的方式\\读取'},guideStatus:"limited",guideLimitation:"上游资料不可访问",reviewedReadmeSha:"a".repeat(40),reviewedAt:"2026-09-05",contentMarkdown:["它是什么","适合什么场景","如何开始","一个使用示例","注意事项与相关项目","资料来源"].map(t=>`## ${t}\n说明。\n`).join("\n")};
  const form = initialCurationForm(item);
  const output = buildCurationTemplate(item, form, "2026-09-05");
  const root = fileURLToPath(new URL("../../", import.meta.url));
  const result = execFileSync("python3", ["-c", `
import json,sys,tempfile
from pathlib import Path
sys.path.insert(0, 'scripts')
from star_vault import load_curations,load_fixture_pages,reconcile_snapshot,make_catalog
text=sys.stdin.read()
fetched=load_fixture_pages(Path('tests/fixtures/github/stable'))
snapshot=reconcile_snapshot(None,fetched.items,username='jiapeiyang',api_version='2022-11-28',checked_at='2026-09-05T00:00:00Z',pages=2)[0]
with tempfile.TemporaryDirectory() as directory:
 p=Path(directory)/'101.md';p.write_text(text)
 loaded=load_curations(Path(directory),snapshot,Path('config'))
 catalog=make_catalog(snapshot,loaded,Path('config'))
 print(json.dumps(next(r for r in catalog['repositories'] if r['repoId']==101),ensure_ascii=False))
`], { cwd: root, input: output, encoding: "utf8" });
  const parsed = JSON.parse(result);
  assert.equal(parsed.summary, repo.summary);
  assert.deepEqual(parsed.tags, repo.tags);
  assert.equal(parsed.contentMarkdown, item.contentMarkdown);
  assert.deepEqual(parsed.relatedNotes,item.relatedNotes);
  assert.equal(parsed.guideStatus,"limited");
  assert.equal(parsed.guideLimitation,item.guideLimitation);
  assert.equal(parsed.reviewedReadmeSha,item.reviewedReadmeSha);
  assert.deepEqual(parsed.relatedRepoIds, [103]);
  assert.equal(parsed.contentUpdatedAt, "2026-09-01");
  assert.equal(parsed.personalArchived, true);
  assert.deepEqual(parsed.sources, repo.sources);
  assert.equal(Object.hasOwn(parsed, "stage"), false);
  assert.equal(Object.hasOwn(parsed, "takeaway"), false);
});

test("edits preserve body and relations and update date; missing and archived are editable", () => {
  for (const overrides of [{ sourceStatus: "missing" }, { personalArchived: true }]) {
    const item = { ...repo, ...overrides };
    const form = { ...initialCurationForm(item), tags: ["新标签"] };
    const output = buildCurationTemplate(item, form, "2026-09-05");
    assert.match(output, /related = \[103\]/);
    assert.ok(output.endsWith(repo.contentMarkdown));
    assert.match(output, /content_updated_at = "2026-09-05"/);
  }
});

test("new files use explicit classification, empty summary and local calendar date", () => {
  const form = initialCurationForm({ repoId: 103 });
  assert.equal(form.summary, "");
  assert.equal(form.category, "unclassified");
  assert.equal(Object.hasOwn(form, "stage"), false);
  assert.ok(validateCuration(repo, form, catalog).category);
  assert.equal(localDate(new Date(2026, 8, 5, 0, 30)), "2026-09-05");
});

test("tag and URL errors block export without truncating input", () => {
  const form = initialCurationForm(repo);
  assert.deepEqual(validateCuration(repo, form, catalog), {});
  assert.ok(validateCuration(repo, { ...form, summary: "" }, catalog).summary);
  for (const tags of [["a", "b", "c", "d", "e", "f"], ["a", "a"], [""], ["python"]]) {
    assert.ok(validateCuration(repo, { ...form, tags }, catalog).tags);
  }
  assert.ok(validateCuration(repo, { ...form, body: "[x](javascript:alert)" }, catalog).body);
});

test("unknown metadata blocks replacement and missing optional date stays missing", () => {
  const unknown = { ...repo, curation: { ...repo.curation, unsupportedFields: ["private_custom"] } };
  assert.ok(validateCuration(unknown, initialCurationForm(unknown), catalog).file);
  assert.throws(() => buildCurationTemplate(unknown, initialCurationForm(unknown)));
  const noDate = { ...repo, contentUpdatedAt: null };
  assert.doesNotMatch(buildCurationTemplate(noDate, initialCurationForm(noDate)), /content_updated_at/);
});

test("removed personal sections are rejected before export while tutorial descriptions remain valid", () => {
  const form = initialCurationForm(repo);
  for (const title of ["学习结论", "实践记录", "学习笔记"]) {
    assert.ok(validateCuration(repo, { ...form, body: `${form.body}\n## ${title}\n` }, catalog).body);
  }
  assert.deepEqual(validateCuration(repo, { ...form, body: "## 它是什么\n这是一本关于学习算法的教程。" }, catalog), {});
});
