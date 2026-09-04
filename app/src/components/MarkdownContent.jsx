import Markdown from "react-markdown";
import { noteHeadings, safeNoteUrl } from "../domain/markdown.js";

const components = {
  a: ({ href, children }) => href ? <a href={href} {...(!href.startsWith("#") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a> : <span>{children}</span>,
  img: ({ alt }) => <span className="note-image-placeholder">图片：{alt || "本版不展示图片"}</span>,
};

export function MarkdownContent({ children }) {
  return <div className="markdown-content"><Markdown skipHtml urlTransform={safeNoteUrl} remarkPlugins={[noteHeadings]} components={components}>{children}</Markdown></div>;
}
