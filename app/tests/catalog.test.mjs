import test from "node:test";
import assert from "node:assert/strict";
import { formatCount, validateCatalog } from "../src/domain/catalog.js";

test("validates unique catalog ids", () => {
  const catalog = { schemaVersion: 2, repositories: [{ repoId: 1 }, { repoId: 2 }] };
  assert.equal(validateCatalog(catalog), catalog);
  assert.throws(() => validateCatalog({ ...catalog, repositories: [{ repoId: 1 }, { repoId: 1 }] }), /repoId/);
});

test("formats repository counts", () => {
  assert.equal(formatCount(999), "999");
  assert.equal(formatCount(1200), "1.2k");
  assert.equal(formatCount(120000), "120k");
});
