export function safeContentUrl(value) {
  if (value.startsWith("#")) return `#content-${value.slice(1)}`;
  if (!/^https?:\/\//i.test(value)) return "";
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function nodeText(node) {
  return node.value || (node.children || []).map(nodeText).join("");
}

// 与页内链接共用 content- 前缀，避免正文标题占用页面控件的 id。
export function contentHeadings() {
  return (tree) => {
    const counts = new Map();
    const visit = (node) => {
      if (node.type === "heading") {
        const slug = nodeText(node).toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s+/g, "-") || "section";
        const count = counts.get(slug) || 0;
        counts.set(slug, count + 1);
        node.data = { ...node.data, hProperties: { id: `content-${slug}${count ? `-${count}` : ""}` } };
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

export function contentOutline(markdown) {
  const counts = new Map();
  let fenced = false;
  return markdown.split("\n").flatMap(line => {
    if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; return []; }
    const match = !fenced && /^##\s+(.+)$/.exec(line);
    if (!match) return [];
    const title = match[1].replace(/[*`]/g, "").trim();
    const slug = title.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s+/g, "-") || "section";
    const count = counts.get(slug) || 0; counts.set(slug, count + 1);
    return [{ title, id: `content-${slug}${count ? `-${count}` : ""}` }];
  });
}
