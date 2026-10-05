import test from "node:test";
import assert from "node:assert/strict";
import { formatCount, latestUpdatedGuide, validateCatalog } from "../src/domain/catalog.js";

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

test("featured guide uses actual content updates rather than a later source review", () => {
  const repositories = [
    { repoId: 1, hasGuide: true, contentUpdatedAt: "2026-09-07", reviewedAt: "2026-10-04", starredAt: "2026-09-01T00:00:00Z" },
    { repoId: 2, hasGuide: true, contentUpdatedAt: "2026-09-14", reviewedAt: "2026-09-14", starredAt: "2026-09-01T00:00:00Z" },
    { repoId: 3, hasGuide: false, contentUpdatedAt: "2026-10-04", starredAt: "2026-09-01T00:00:00Z" },
  ];
  assert.equal(latestUpdatedGuide(repositories).repoId, 2);
  assert.deepEqual(repositories.map(repo => repo.repoId), [1, 2, 3]);
  assert.equal(latestUpdatedGuide([]), undefined);
  assert.equal(latestUpdatedGuide([{ hasGuide: true, contentUpdatedAt: null }]), undefined);
});
