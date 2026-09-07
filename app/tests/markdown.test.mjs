import test from "node:test";
import assert from "node:assert/strict";
import { safeContentUrl, contentHeadings } from "../src/domain/markdown.js";
import { contentHighlights } from "../src/domain/highlight.js";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";

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

test("highlight marks text without changing code, heading IDs or enabling HTML", () => {
 const html=renderToStaticMarkup(React.createElement(Markdown,{
  skipHtml:true,urlTransform:safeContentUrl,remarkPlugins:[contentHeadings,[contentHighlights,{query:"OCR"}]],
 },"## OCR 示例\n\nOCR 与 `OCR`\n\n```js\nconst x = 'OCR';\n```\n\n<img src=x onerror=alert(1)>"));
 assert.match(html,/<h2 id="content-ocr-示例"><mark>OCR<\/mark> 示例<\/h2>/);
 assert.match(html,/<code>OCR<\/code>/);
 assert.match(html,/<pre><code class="language-js">const x = &#x27;OCR&#x27;;/);
 assert.doesNotMatch(html,/<img|onerror=/);
});
