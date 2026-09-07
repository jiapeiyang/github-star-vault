import { CatalogControls } from "../components/CatalogControls.jsx";
import { RepoEntry } from "../components/RepoEntry.jsx";
import { filterRepositories } from "../domain/filters.js";
export function LibraryView({ catalog, route, onRouteChange, onOpenRepo }) {
  const filtered=filterRepositories(catalog.repositories,route);
  return <main className="library-page full-library"><aside className="library-sidebar"><div className="library-title"><span>项目</span><strong>特刊</strong></div><div className="sidebar-categories" aria-label="按领域筛选">{[{id:"all",label:"全部领域"},...catalog.categories].map((c,i)=><button className={route.category===c.id?"is-active":""} aria-pressed={route.category===c.id} type="button" key={c.id} onClick={()=>onRouteChange({category:c.id})}><span>{String(i).padStart(2,"0")}</span><strong>{c.label}</strong></button>)}</div><blockquote>记得它能做什么，<br/>就能再次找到它。</blockquote></aside>
    <section className="library-feed"><header className="feed-heading"><div><p>按用途找回你的收藏</p><h1>项目库</h1></div><span>{filtered.length} / {route.source==="starred"?catalog.stats.active:catalog.stats.total} 个项目</span></header>
      <CatalogControls catalog={catalog} route={route} onChange={onRouteChange}/>
      {filtered.length?<div className={route.layout==="cards"?"repo-card-grid":"repo-feed"}>{filtered.map(repo=><RepoEntry key={repo.repoId} repo={repo} layout={route.layout} query={route.q} onOpen={onOpenRepo}/>)}</div>:<div className="empty-state"><h2>没有匹配的项目</h2><p>尝试更短的关键词，或移除上方的一个条件。</p></div>}
    </section></main>;
}
