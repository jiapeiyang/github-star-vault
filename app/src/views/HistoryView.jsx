import { CatalogControls } from "../components/CatalogControls.jsx";
import { RepoEntry } from "../components/RepoEntry.jsx";
import { filterRepositories, groupByMonth } from "../domain/filters.js";
export function HistoryView({catalog,route,onRouteChange,onOpenRepo}) {
  const matches=filterRepositories(catalog.repositories,{...route,sort:"starred"});
  const groups=groupByMonth(matches);
  return <main className="history-page"><header className="feed-heading"><div><p>沿着时间，翻回当时的收藏</p><h1>收藏回顾</h1></div><span>{matches.length} 个已收录项目</span></header>
    <CatalogControls catalog={catalog} route={route} onChange={onRouteChange} history/>
    <label className="history-category"><span>领域</span><select value={route.category} onChange={e=>onRouteChange({category:e.target.value})}><option value="all">全部领域</option>{catalog.categories.map(c=><option value={c.id} key={c.id}>{c.label}</option>)}</select></label>
    <p className="history-scope">按收藏日期（北京时间）分组。包含建库时可见与之后同步收录的记录；退出公开 Stars 不等于主动取消收藏，重新 Star 可能改变日期。</p>
    {groups.map(([month,repos])=><section className="history-month" key={month}><header><h2>{month.replace("-"," / ")}</h2><span>{repos.length} 个收藏</span></header><div>{repos.map(repo=><RepoEntry key={repo.repoId} repo={repo} query={route.q} onOpen={onOpenRepo}/>)}</div></section>)}
    {!groups.length&&<div className="empty-state"><h2>这个范围没有收藏记录</h2><p>调整年份、日期范围或关键词。</p></div>}
  </main>;
}
