import test from "node:test";
import assert from "node:assert/strict";
import { safeContentUrl, contentHeadings } from "../src/domain/markdown.js";

test("only web links and scoped heading anchors remain clickable", () => {
  for (const link of ["javascript:alert(1)", "data:text/html,test", "/relative", "//external.test", "file:///secret", "https://"]) assert.equal(safeContentUrl(link), "");
  assert.equal(safeContentUrl("https://example.test/"), "https://example.test/");
  assert.equal(safeContentUrl("#学习结论"), "#content-学习结论");
});

test("Chinese headings and duplicates have stable scoped ids", () => {
  const tree = { children: [0, 1].map(() => ({ type: "heading", children: [{ type: "text", value: "学习结论" }] })) };
  contentHeadings()(tree);
  assert.deepEqual(tree.children.map((n) => n.data.hProperties.id), ["content-学习结论", "content-学习结论-1"]);
});
