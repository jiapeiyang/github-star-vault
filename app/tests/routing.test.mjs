import test from "node:test";
import assert from "node:assert/strict";
import { activeNavigationView, defaultRoute, detailReturnRoute, routeFromUrl, urlForRoute, shouldHandleLink } from "../src/domain/routing.js";

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

test("detail and topic URLs preserve query context and a single scoped hash", () => {
 const route={...defaultRoute,view:"detail",repo:"123",q:"命令行 OCR",topic:"agent-workflow",anchor:"content-怎么使用"};
 const url=urlForRoute(route,"https://example.test/github-star-vault/?old=1#old");
 assert.deepEqual(routeFromUrl(new URL(url,"https://example.test").href),route);
 assert.equal((url.match(/#/g)||[]).length,1);
 assert.ok(!url.includes("anchor="));
 assert.equal(routeFromUrl("https://example.test/#%broken").anchor,"");
 assert.equal(routeFromUrl("https://example.test/#masthead-query").anchor,"");
 assert.equal(routeFromUrl("https://example.test/?view=topics").view,"topics");
});

test("only unmodified main-button links use in-app navigation", () => {
 const click={button:0,defaultPrevented:false,metaKey:false,ctrlKey:false,shiftKey:false,altKey:false};
 assert.equal(shouldHandleLink(click),true);
 for(const key of ["metaKey","ctrlKey","shiftKey","altKey","defaultPrevented"]) assert.equal(shouldHandleLink({...click,[key]:true}),false);
 for(const button of [1,2]) assert.equal(shouldHandleLink({...click,button}),false);
});

test("recipe deep links preserve the base and allow only scoped step anchors", () => {
  const base = "https://example.test/github-star-vault/";
  const route = { ...defaultRoute, view: "recipes", recipe: "product-demo-web", anchor: "recipe-step-motion" };
  const href = urlForRoute(route, base);
  assert.deepEqual(routeFromUrl(new URL(href, base).href), route);
  assert.ok(href.startsWith("/github-star-vault/"));
  for (const anchor of ["recipe-step-", "recipe-step-<script>", "recipe-step-one two"]) assert.equal(routeFromUrl(`${base}#${encodeURIComponent(anchor)}`).anchor, "");
  assert.equal(routeFromUrl(`${base}?view=basket`).view, "basket");
});

test("detail fallback uses valid recipes and navigation keeps basket context separate", () => {
  const recipes = [{ id: "monitor" }];
  const route = { ...defaultRoute, view: "detail", repo: "1", recipe: "monitor", topic: "tools" };
  assert.equal(detailReturnRoute(route, recipes).view, "recipes");
  assert.equal(detailReturnRoute({ ...route, recipe: "missing" }, recipes).view, "topics");
  assert.equal(detailReturnRoute({ ...route, topic: "", recipe: "missing" }, recipes).view, "library");
  assert.equal(activeNavigationView(route, null, recipes), "topics");
  assert.equal(activeNavigationView({ ...route, recipe: "" }, { view: "basket" }, recipes), "basket");
  assert.equal(activeNavigationView({ ...route, recipe: "" }, null, recipes), "library");
});
