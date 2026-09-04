import test from "node:test";
import assert from "node:assert/strict";
import { buildCurationTemplate, parseTags } from "../src/domain/curation.js";

test("limits generated tags to five", () => {
  assert.deepEqual(parseTags("a、b,c、d、e、f"), ["a", "b", "c", "d", "e"]);
});

test("generates a valid deterministic curation file", () => {
  const template = buildCurationTemplate(
    { repoId: 123 },
    { category: "ai-agent", resourceType: "collection", stage: "queued", tags: "Skills、规范", note: "用于验证 \"TOML\"。" },
    "2026-09-05",
  );
  assert.match(template, /^\+\+\+\nrepo_id = 123/m);
  assert.match(template, /tags = \["Skills", "规范"\]/);
  assert.match(template, /note = "用于验证 \\"TOML\\"。"/);
  assert.match(template, /updated_by_user_at = "2026-09-05"/);
});
