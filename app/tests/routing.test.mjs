import test from "node:test";
import assert from "node:assert/strict";
import { defaultRoute, routeFromUrl, urlForRoute } from "../src/domain/routing.js";

test("restores filter state from URL", () => {
  const route = routeFromUrl("https://example.test/github-star-vault/?view=library&category=ai-agent&stage=queued&q=skills");
  assert.equal(route.view, "library");
  assert.equal(route.category, "ai-agent");
  assert.equal(Object.hasOwn(route, "stage"), false);
  assert.ok(!urlForRoute(route, "https://example.test/").includes("stage"));
  assert.equal(route.q, "skills");
});

test("writes only non-default route values", () => {
  const route = { ...defaultRoute, view: "detail", repo: "123" };
  assert.equal(urlForRoute(route, "https://example.test/github-star-vault/"), "/github-star-vault/?view=detail&repo=123");
});

test("removed and unknown views fall back to library", () => {
  assert.equal(routeFromUrl("https://example.test/?view=unknown").view, "library");
});

test("removed learning URL cannot reactivate the feature", () => { assert.equal(routeFromUrl("https://example.test/?view=learning&stage=learned").view,"library"); });

test("history defaults to all records and preserves an explicit current-Stars filter", () => {
  const href = "https://example.test/?view=history";
  const route = routeFromUrl(href);
  assert.equal(route.source, "all");
  assert.equal(urlForRoute(route, href), "/?view=history");
  const currentOnly = { ...route, source: "starred" };
  const url = urlForRoute(currentOnly, href);
  assert.equal(url, "/?view=history&source=starred");
  assert.equal(routeFromUrl(new URL(url, href).href).source, "starred");
});
