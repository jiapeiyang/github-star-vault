import { Cards, Funnel, ListBullets, X } from "@phosphor-icons/react";
import { defaultRoute } from "../domain/routing.js";
import { collectionDate } from "../domain/filters.js";
export function CatalogControls({ catalog, route, onChange, history = false }) {
  const repos = catalog.repositories;
  const languages = [...new Set(repos.map(r => r.language))].sort();
  const tags = [...new Set(repos.flatMap(r => r.tags))].sort((a,b) => a.localeCompare(b,"zh-CN"));
  const years = [...new Set(repos.map(r => collectionDate(r.starredAt).slice(0,4)))].sort().reverse();
  const select = (key, label, options) => <label><span>{label}</span><select value={route[key]} onChange={e => onChange({[key]: e.target.value})}>{options.map(([id, title]) => <option value={id} key={id}>{title}</option>)}</select></label>;
  const labels = {q:`搜索：${route.q}`,category:catalog.categories.find(c=>c.id===route.category)?.label,type:catalog.resourceTypes.find(c=>c.id===route.type)?.label,language:route.language,tag:`标签：${route.tag}`,year:`${route.year} 年收藏`,from:`从 ${route.from}`,to:`至 ${route.to}`,coverage:route.coverage==="ready"?"有解读":"待补解读",origin:"建库后新收藏",source:route.source==="missing"?"已退出公开 Stars":route.source==="all"?"全部已收录":"当前 Stars",archive:({all:"包含个人归档",github:"上游已归档",personal:"个人归档"})[route.archive]};
  const base = {...defaultRoute,source:history?"all":"starred"};
  const keys=Object.keys(labels).filter(k=>route[k]&&route[k]!==base[k]);
  const clear=()=>onChange(Object.fromEntries(Object.keys(labels).map(k=>[k,base[k]])));
  return <>
    <div className="filter-deck">
      {select("type","资源类型",[["all","全部类型"],...catalog.resourceTypes.map(c=>[c.id,c.label])])}
      {select("language","语言",[["all","全部语言"],...languages.map(l=>[l,l])])}
      <label><span>策展标签 · 可搜索</span><input type="search" list="catalog-tags" aria-label="搜索策展标签" placeholder="输入或选择标签" value={route.tag==="all"?"":route.tag} onChange={e=>onChange({tag:e.target.value||"all"})} /><datalist id="catalog-tags">{tags.map(t=><option value={t} key={t}/>)}</datalist></label>
      {select("year","收藏年份",[["all","全部年份"],...years.map(y=>[y,`${y} 年`])])}
      {!history&&select("sort","排序",[["starred","最近收藏"],["updated","上游最近更新"],["stars","Stars 数"]])}
      {!history&&<div className="layout-toggle" aria-label="视图切换">{[["list","列表",ListBullets],["cards","卡片",Cards]].map(([id,label,Icon])=><button key={id} type="button" aria-pressed={route.layout===id} className={route.layout===id?"is-active":""} onClick={()=>onChange({layout:id})}><Icon size={18}/>{label}</button>)}</div>}
    </div>
    <details className="advanced-filters"><summary>更多筛选 · 日期、来源与解读</summary><div className="filter-deck">
      <label><span>收藏起始日期</span><input type="date" aria-label="收藏起始日期" value={route.from} onChange={e=>onChange({from:e.target.value})}/></label>
      <label><span>收藏截止日期</span><input type="date" aria-label="收藏截止日期" value={route.to} onChange={e=>onChange({to:e.target.value})}/></label>
      {select("source","收录范围",[["starred","当前 Stars"],["all","全部已收录记录"],["missing","已退出公开 Stars"]])}
      {select("archive","归档状态",[["active","默认视图"],["all","包含个人归档"],["github","上游已归档"],["personal","个人归档"]])}
      {select("coverage","仓库解读",[["all","全部资料"],["ready","已有解读"],["missing","尚未补充解读"]])}
      {select("origin","收录时间",[["all","全部收藏"],["new","建库后新收藏"]])}
    </div></details>
    <div className="active-filters"><span><Funnel size={15}/>{keys.length?`${keys.length} 个条件`:history?"全部已收录记录":"全部当前公开项目"}</span>{keys.map(k=><button type="button" className="filter-chip" aria-label={`移除${labels[k]||route[k]}`} key={k} onClick={()=>onChange({[k]:base[k]})}>{labels[k]||route[k]}<X size={12}/></button>)}{keys.length>0&&<button type="button" onClick={clear}>清除全部</button>}</div>
  </>;
}
