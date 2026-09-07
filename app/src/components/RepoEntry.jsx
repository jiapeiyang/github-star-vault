import { ArrowUpRight, Star } from "@phosphor-icons/react";
import { formatCount, formatDate } from "../domain/catalog.js";
import { highlightParts, searchMatch } from "../domain/search.js";
import { RepoLink } from "./RepoLink.jsx";

export function Highlight({text,query}) {
  return highlightParts(text,query).map((part,i)=>part.matched?<mark key={i}>{part.text}</mark>:part.text);
}
export function RepoEntry({repo,layout="list",query="",onOpen}) {
  const match=searchMatch(repo,query);
  return <article id={`repo-${repo.repoId}`} className={layout==="cards"?"repo-card":"library-repo-row"}>
    <RepoLink className={layout==="cards"?"repo-card-main":"repo-row-main"} repoId={repo.repoId} onOpen={onOpen}>
      <img src={repo.avatar} alt="" loading="lazy"/><div className="repo-row-copy"><div><h3><Highlight text={repo.name} query={query}/></h3><span><Star weight="fill" size={13}/>{formatCount(repo.stars)}</span></div>
        <p><Highlight text={match.text} query={query}/></p>
        <div className="topic-line">{repo.hasGuide&&<span className="guide-badge">仓库解读</span>}{repo.guideStatus==="limited"&&<span>资料受限</span>}{repo.personalArchived&&<span>个人归档</span>}{repo.archived&&<span>上游归档</span>}{repo.sourceStatus==="missing"&&<span>已退出公开 Stars</span>}{repo.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
      </div><time dateTime={repo.starredAt}>收藏 {formatDate(repo.starredAt)}</time><ArrowUpRight size={18} aria-hidden="true"/>
    </RepoLink>
    {match.anchor&&<RepoLink className="match-jump" repoId={repo.repoId} anchor={match.anchor} onOpen={onOpen}>查看命中段落 · {match.section}<ArrowUpRight size={14}/></RepoLink>}
  </article>;
}
