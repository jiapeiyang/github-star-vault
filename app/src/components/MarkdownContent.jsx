import { useRef, useState } from "react";
import { contentHighlights } from "../domain/highlight.js";
import Markdown from "react-markdown";
import { safeContentUrl, contentHeadings } from "../domain/markdown.js";
function CodeBlock({children}) {
  const [status,setStatus]=useState("");
  const code = useRef(null);
  const copy=async()=>{try{await navigator.clipboard.writeText(code.current.textContent);setStatus("已复制");}catch{setStatus("复制未获允许，请手动选择代码");}};
  return <div className="code-block"><div className="code-toolbar"><span role="status">{status}</span><button type="button" onClick={copy}>复制代码</button></div><pre ref={code}>{children}</pre></div>;
}
const components = {
  a: ({ href, children }) => href ? <a href={href} {...(!href.startsWith("#") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a> : <span>{children}</span>,
  img: ({ alt }) => <span className="content-image-placeholder">图片：{alt || "此处不加载远程图片"}</span>,
  pre: CodeBlock,
};
export function MarkdownContent({children, query=""}) {
  return <div className="markdown-content"><Markdown skipHtml urlTransform={safeContentUrl} remarkPlugins={[contentHeadings, [contentHighlights,{query}]]} components={components}>{children}</Markdown></div>;
}
