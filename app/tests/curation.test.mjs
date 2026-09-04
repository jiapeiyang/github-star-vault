import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildCurationTemplate, hasMeaningfulTakeaway, initialCurationForm, localDate, validateCuration } from "../src/domain/curation.js";

const catalog = { categories: [{ id: "ai-agent" }], resourceTypes: [{ id: "collection" }], stages: ["queued", "learned", "archived"].map((id) => ({ id })) };
const repo = { repoId: 101, name: "example/alpha", category: "ai-agent", resourceTypeId: "collection", stage: "learned", tags: ["规范,结构", "原样标签"], note: "展示摘要", relatedRepoIds: [103], language: "Python", contentMarkdown: "## 学习结论\n\n- 清理副作用并保留原始内容。\n\n## 实践记录\n\n```js\nconst x = '<safe>';\n```\n", curation: { note: ' 原始 "内容" \\ 路径\n第二行\t\u0001\u007f\u0085 ', updatedByUserAt: "2026-09-01", unsupportedFields: [] } };

test("unchanged export preserves note, all tags, body, relations and original date in real Python parser", () => {
  const form = initialCurationForm(repo);
  const output = buildCurationTemplate(repo, form, "2026-09-05");
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
  assert.equal(parsed.curation.note, repo.curation.note);
  assert.deepEqual(parsed.tags, repo.tags);
  assert.equal(parsed.contentMarkdown, repo.contentMarkdown);
  assert.deepEqual(parsed.relatedRepoIds, [103]);
  assert.equal(parsed.curatedAt, "2026-09-01");
});

test("edits preserve body and relations and update date; missing and archived are editable", () => {
  for (const overrides of [{ sourceStatus: "missing" }, { stage: "archived" }]) {
    const item = { ...repo, ...overrides };
    const form = { ...initialCurationForm(item), tags: ["新标签"] };
    const output = buildCurationTemplate(item, form, "2026-09-05");
    assert.match(output, /related = \[103\]/);
    assert.ok(output.endsWith(repo.contentMarkdown));
    assert.match(output, /updated_by_user_at = "2026-09-05"/);
  }
});

test("new files use explicit classification, empty personal judgment and local calendar date", () => {
  const form = initialCurationForm({ repoId: 103 });
  assert.equal(form.note, "");
  assert.equal(form.category, "unclassified");
  assert.equal(form.stage, "queued");
  assert.ok(validateCuration(repo, form, catalog).category);
  assert.equal(localDate(new Date(2026, 8, 5, 0, 30)), "2026-09-05");
});

test("invalid stages, missing conclusions and tag errors block export without truncating input", () => {
  const form = initialCurationForm(repo);
  assert.deepEqual(validateCuration(repo, form, catalog), {});
  for (const tags of [["a", "b", "c", "d", "e", "f"], ["a", "a"], [""], ["python"]]) {
    assert.ok(validateCuration(repo, { ...form, tags }, catalog).tags);
  }
  assert.ok(validateCuration(repo, { ...form, stage: "invented" }, catalog).stage);
  for (const value of ["", "<!-- hidden -->", "- 待补充", "- TODO", "- 待实际使用后补充。"] ) {
    assert.equal(hasMeaningfulTakeaway(`## 学习结论\n${value}\n## 实践记录\n- 实践不算结论`), false);
  }
  assert.ok(validateCuration(repo, { ...form, body: "[x](javascript:alert)" }, catalog).body);
});

test("unknown metadata blocks replacement and missing optional date stays missing", () => {
  const unknown = { ...repo, curation: { ...repo.curation, unsupportedFields: ["private_custom"] } };
  assert.ok(validateCuration(unknown, initialCurationForm(unknown), catalog).file);
  assert.throws(() => buildCurationTemplate(unknown, initialCurationForm(unknown)));
  const noDate = { ...repo, curation: { ...repo.curation, updatedByUserAt: null } };
  assert.doesNotMatch(buildCurationTemplate(noDate, initialCurationForm(noDate)), /updated_by_user_at/);
});
