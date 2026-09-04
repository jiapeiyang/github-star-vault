import test from "node:test";
import assert from "node:assert/strict";
import { defaultRoute, routeFromUrl, urlForRoute } from "../src/domain/routing.js";

test("restores filter state from URL", () => {
  const route = routeFromUrl("https://example.test/github-star-vault/?view=library&category=ai-agent&stage=queued&q=skills");
  assert.equal(route.view, "library");
  assert.equal(route.category, "ai-agent");
  assert.equal(route.stage, "queued");
  assert.equal(route.q, "skills");
});

test("writes only non-default route values", () => {
  const route = { ...defaultRoute, view: "detail", repo: "123" };
  assert.equal(urlForRoute(route, "https://example.test/github-star-vault/"), "/github-star-vault/?view=detail&repo=123");
});

test("unknown view falls back to home", () => {
  assert.equal(routeFromUrl("https://example.test/?view=unknown").view, "home");
});
