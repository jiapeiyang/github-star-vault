export function safeNoteUrl(value) {
  if (value.startsWith("#")) return `#note-${value.slice(1)}`;
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

// 与页内链接共用 note- 前缀，避免笔记标题占用页面控件的 id。
export function noteHeadings() {
  return (tree) => {
    const counts = new Map();
    const visit = (node) => {
      if (node.type === "heading") {
        const slug = nodeText(node).toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s+/g, "-") || "section";
        const count = counts.get(slug) || 0;
        counts.set(slug, count + 1);
        node.data = { ...node.data, hProperties: { id: `note-${slug}${count ? `-${count}` : ""}` } };
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
