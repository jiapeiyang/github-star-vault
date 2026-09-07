import { ArrowLeft, ArrowUpRight, GithubLogo, Star, Tag } from "@phosphor-icons/react";
import { MarkdownContent } from "../components/MarkdownContent.jsx";
import { contentOutline } from "../domain/markdown.js";
import { formatCount, formatDate } from "../domain/catalog.js";
export function DetailView({repo,repositories,onBack,onOpenRepo,onOpenCuration}) {
  const related=repo.relatedRepoIds.map(id=>repositories.find(r=>r.repoId===id)).filter(Boolean);
  const outline=repo.hasGuide?contentOutline(repo.contentMarkdown):[];
  return <main className="detail-page"><button className="back-link" type="button" onClick={onBack}><ArrowLeft size={17}/>返回浏览</button>
    <header className="detail-cover"><div className="detail-identity"><img src={repo.avatar} alt=""/><div><p>{repo.categoryLabel} · {repo.resourceType}</p><h1>{repo.name}</h1><span>{repo.summary||repo.description}</span></div></div><div className="detail-actions"><a href={repo.url} target="_blank" rel="noreferrer"><GithubLogo size={19}/>GitHub <ArrowUpRight size={15}/></a>{repo.homepage&&<a href={repo.homepage} target="_blank" rel="noreferrer">上游主页 <ArrowUpRight size={15}/></a>}</div></header>
    <section className="fact-ribbon" aria-label="GitHub 仓库事实"><div><small>语言</small><strong>{repo.language}</strong></div><div><small>Stars</small><strong><Star size={18}/>{formatCount(repo.stars)}</strong></div><div><small>License</small><strong>{repo.license}</strong></div><div><small>上游归档状态</small><strong>{repo.archived?"已归档":"未归档"}</strong></div><div><small>收藏日期</small><strong>{formatDate(repo.starredAt)}</strong></div><div><small>公开 Stars 状态</small><strong>{repo.sourceStatus==="starred"?"当前已 Star":"已退出公开 Stars"}</strong></div></section>
    <div className="guide-layout"><article className="guide-story"><header className="guide-heading"><span>仓库解读</span>{repo.hasGuide&&<small>公开资料整理 · 核查于 {repo.reviewedAt}</small>}</header>
      {repo.hasGuide?<MarkdownContent key={repo.repoId}>{repo.contentMarkdown}</MarkdownContent>:<div className="guide-empty"><h2>详细解读尚未补充</h2><p>{repo.summary||repo.description}</p><p>可以先查看上游说明与文档。</p><a href={repo.url} target="_blank" rel="noreferrer">阅读上游 README <ArrowUpRight size={16}/></a></div>}
      <details className="original-description"><summary>GitHub 原始描述</summary><p>{repo.description}</p></details>
      <details className="maintenance-entry"><summary>资料维护</summary><button className="text-link" type="button" onClick={()=>onOpenCuration(repo)}>编辑仓库资料</button></details>
    </article><aside className="guide-sidebar">{outline.length>0&&<nav className="guide-outline" aria-label="解读目录"><strong>本文目录</strong>{outline.map((h,i)=><a key={h.id} href={`#${h.id}`}><span>{String(i+1).padStart(2,"0")}</span>{h.title}</a>)}</nav>}
      <section><h2>策展标签</h2><div className="detail-tags">{repo.tags.length?repo.tags.map(t=><span key={t}><Tag size={12}/>{t}</span>):<p>尚未分类整理</p>}</div></section>
      <section><h2>资料来源</h2>{repo.sources.length?<ul>{repo.sources.map((url,i)=><li key={url}><a href={url} target="_blank" rel="noreferrer">来源 {i+1} · 查看原文<ArrowUpRight size={12}/></a></li>)}</ul>:<p>上游仓库 README</p>}<dl><dt>内容更新</dt><dd>{repo.contentUpdatedAt||"暂无"}</dd><dt>上游更新</dt><dd>{formatDate(repo.pushedAt)}</dd><dt>最近同步</dt><dd>{formatDate(repo.lastSyncedAt,{hour:"2-digit",minute:"2-digit"})}</dd></dl></section>
      {related.length>0&&<section className="related-feature"><h2>关联仓库</h2>{related.map(r=><button key={r.repoId} type="button" onClick={()=>onOpenRepo(r.repoId)}><img src={r.avatar} alt=""/><div><strong>{r.name}</strong><small>{r.summary||r.description}</small></div><ArrowUpRight size={16}/></button>)}</section>}
    </aside></div>
  </main>;
}
