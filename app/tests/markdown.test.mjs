import test from "node:test";
import assert from "node:assert/strict";
import { safeNoteUrl, noteHeadings } from "../src/domain/markdown.js";

test("only web links and scoped heading anchors remain clickable", () => {
  for (const link of ["javascript:alert(1)", "data:text/html,test", "/relative", "//external.test", "file:///secret", "https://"]) assert.equal(safeNoteUrl(link), "");
  assert.equal(safeNoteUrl("https://example.test/"), "https://example.test/");
  assert.equal(safeNoteUrl("#学习结论"), "#note-学习结论");
});

test("Chinese headings and duplicates have stable scoped ids", () => {
  const tree = { children: [0, 1].map(() => ({ type: "heading", children: [{ type: "text", value: "学习结论" }] })) };
  noteHeadings()(tree);
  assert.deepEqual(tree.children.map((n) => n.data.hProperties.id), ["note-学习结论", "note-学习结论-1"]);
});
