import test from "node:test";
import assert from "node:assert/strict";
import { getRecipeCatalog, recipeTools } from "../src/domain/recipes.js";
import { validateCatalog } from "../src/domain/catalog.js";

const fixture = () => ({ schemaVersion: 2, repositories: [{ repoId: 1, personalArchived: false }], topics: [{ id: "tools" }], recipes: [{
  id: "make-demo", title: "演示", summary: "介绍", topicIds: ["tools"], inputs: ["输入"], outputs: ["产出"], requirements: ["前提"],
  reviewedAt: "2026-10-13", evidence: "public-sources", sources: ["https://example.test/docs"],
  tools: [{ repoId: 1, role: "组件", reason: "用途", entryUrl: "https://example.test/start", requirements: ["前提"], limitations: ["未实测"], sources: ["https://example.test/source"] }],
  steps: ["design", "build", "review"].map((id, i) => ({ id, title: id, inputs: ["输入"], actions: ["动作"], outputs: ["输出"], checks: ["检查"], toolIds: i === 1 ? [1] : [], optional: i === 2 })),
}] });

test("optional recipe data cannot prevent loading a valid repository catalog", () => {
  const old = { schemaVersion: 2, repositories: [] };
  assert.deepEqual(getRecipeCatalog(old), { recipes: [], error: "" });
  const catalog = fixture();
  assert.equal(getRecipeCatalog(catalog).recipes.length, 1);
  for (const value of [null, {}, "bad", [null]]) {
    const broken = { ...catalog, recipes: value };
    assert.equal(validateCatalog(broken), broken);
    assert.ok(getRecipeCatalog(broken).error);
  }
});

test("malformed recipe fields and references produce local errors instead of render failures", () => {
  const changes = [
    r => { r.steps[0].actions = null; }, r => { r.tools[0].repoId = 999; },
    r => { r.steps[1].toolIds = [999]; }, r => { r.steps[1].toolIds = []; },
    r => { r.tools[0].entryUrl = "javascript:bad"; }, r => { r.steps[0].optional = "yes"; },
    r => { r.steps[0].id = "with space"; }, r => { r.evidence = "tested"; },
    r => { r.topicIds = ["missing"]; }, r => { r.steps[0].id = r.steps[1].id; },
  ];
  for (const change of changes) {
    const catalog = fixture(); change(catalog.recipes[0]);
    assert.ok(getRecipeCatalog(catalog).error);
  }
});

test("personal archives hide candidates while retaining the recipe step and upstream facts", () => {
  const catalog = fixture(), recipe = catalog.recipes[0];
  assert.equal(recipeTools(recipe.steps[1], recipe, catalog.repositories).length, 1);
  catalog.repositories[0].archived = true;
  catalog.repositories[0].sourceStatus = "missing";
  assert.equal(recipeTools(recipe.steps[1], recipe, catalog.repositories).length, 1);
  catalog.repositories[0].personalArchived = true;
  assert.equal(recipeTools(recipe.steps[1], recipe, catalog.repositories).length, 0);
  assert.equal(recipe.steps[1].toolIds.length, 1);
});
