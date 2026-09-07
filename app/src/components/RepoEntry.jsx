import { ArrowUpRight, Star } from "@phosphor-icons/react";
import { formatCount, formatDate } from "../domain/catalog.js";
import { matchExcerpt, queryWords } from "../domain/filters.js";

export function Highlight({ text, query }) {
  const words = queryWords(query);
  if (!words.length) return text;
  const escaped = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return String(text).split(new RegExp(`(${escaped.join("|")})`, "gi")).map((part, index) => words.includes(part.toLowerCase()) ? <mark key={index}>{part}</mark> : part);
}
export function RepoEntry({ repo, layout = "list", query = "", onOpen }) {
  return <article id={`repo-${repo.repoId}`} className={layout === "cards" ? "repo-card" : "library-repo-row"}>
    <button className={layout === "cards" ? "repo-card-main" : "repo-row-main"} type="button" onClick={() => onOpen(repo.repoId)}>
      <img src={repo.avatar} alt="" loading="lazy" /><div className="repo-row-copy"><div><h3><Highlight text={repo.name} query={query} /></h3><span><Star weight="fill" size={13} />{formatCount(repo.stars)}</span></div>
        <p><Highlight text={matchExcerpt(repo, query)} query={query} /></p>
        <div className="topic-line">{repo.hasGuide && <span className="guide-badge">仓库解读</span>}{repo.personalArchived && <span>个人归档</span>}{repo.archived && <span>上游归档</span>}{repo.sourceStatus === "missing" && <span>已退出公开 Stars</span>}{repo.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      </div><time dateTime={repo.starredAt}>收藏 {formatDate(repo.starredAt)}</time><ArrowUpRight size={18} aria-hidden="true" />
    </button></article>;
}
