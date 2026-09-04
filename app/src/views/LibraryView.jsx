import { ArrowUpRight, Cards, Check, Funnel, ListBullets, Star, X } from "@phosphor-icons/react";
import { formatCount, formatDate } from "../domain/catalog.js";
import { filterRepositories } from "../domain/filters.js";

function CategorySidebar({ categories, active, onChange }) {
  const items = [{ id: "all", label: "全部领域" }, ...categories];
  return <aside className="library-sidebar"><div className="library-title"><span>项目</span><strong>特刊</strong></div><div className="sidebar-categories" aria-label="按领域筛选">{items.map((category, index) => <button className={active === category.id ? "is-active" : ""} type="button" key={category.id} onClick={() => onChange({ category: category.id })}><span>{String(index).padStart(2, "0")}</span><strong>{category.label}</strong></button>)}</div><blockquote>真正的收藏不是占有，<br />而是持续的对话与实践。<cite>Star Vault</cite></blockquote></aside>;
}

function RepoEntry({ repo, layout, onOpen }) {
  return <article className={layout === "cards" ? "repo-card" : "library-repo-row"}><button className={layout === "cards" ? "repo-card-main" : "repo-row-main"} type="button" onClick={() => onOpen(repo.repoId)}><img src={repo.avatar} alt="" /><div className="repo-row-copy"><div><h3>{repo.name}</h3><span><Star weight="fill" size={13} />{formatCount(repo.stars)}</span></div><p>{repo.editorialSummary}</p><div className="topic-line">{repo.personalArchived && <span>个人归档</span>}{repo.archived && <span>上游归档</span>}{repo.sourceStatus === "missing" && <span>已退出公开 Stars</span>}{repo.tags.length ? repo.tags.map((tag) => <span key={tag}>{tag}</span>) : repo.topics.slice(0, 2).map((topic) => <span key={topic}>{topic}</span>)}</div></div><time dateTime={repo.starredAt}>收藏 {formatDate(repo.starredAt)}</time><ArrowUpRight size={18} aria-hidden="true" /></button></article>;
}

export function LibraryView({ catalog, route, onRouteChange, onOpenRepo }) {
  const repositories = catalog.repositories;
  const filtered = filterRepositories(repositories, route);
  const languages = [...new Set(repositories.map((repo) => repo.language))].sort((a, b) => a.localeCompare(b, "zh-CN"));
  const tags = [...new Set(repositories.flatMap((repo) => repo.tags))].sort((a, b) => a.localeCompare(b, "zh-CN"));
  const stageLabel = catalog.stages.find((item) => item.id === route.stage)?.label;
  const categoryLabel = catalog.categories.find((item) => item.id === route.category)?.label;
  const typeLabel = catalog.resourceTypes.find((item) => item.id === route.type)?.label;
  const active = [route.q && `搜索：${route.q}`, route.category !== "all" && categoryLabel, route.stage !== "all" && stageLabel, route.type !== "all" && typeLabel, route.language !== "all" && route.language, route.tag !== "all" && `标签：${route.tag}`, route.source !== "starred" && (route.source === "missing" ? "已退出公开 Stars" : "全部来源"), route.archive !== "active" && ({ all: "包含个人归档", github: "上游已归档", personal: "个人已归档" }[route.archive])].filter(Boolean);
  const clear = () => onRouteChange({ q: "", category: "all", stage: "all", type: "all", language: "all", tag: "all", source: "starred", archive: "active" });

  return <main className="library-page full-library"><CategorySidebar categories={catalog.categories} active={route.category} onChange={onRouteChange} /><section className="library-feed">
    <header className="feed-heading"><div><p>开发者文化杂志 · GitHub Stars 项目库</p><h1>项目特刊</h1></div><span>{filtered.length} / {route.source === "starred" ? catalog.stats.active : catalog.stats.total} 个项目</span></header>
    <div className="filter-deck">
      <label><span>资源类型</span><select value={route.type} onChange={(event) => onRouteChange({ type: event.target.value })}><option value="all">全部类型</option>{catalog.resourceTypes.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
      <label><span>语言</span><select value={route.language} onChange={(event) => onRouteChange({ language: event.target.value })}><option value="all">全部语言</option>{languages.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>个人标签</span><select value={route.tag} onChange={(event) => onRouteChange({ tag: event.target.value })}><option value="all">全部标签</option>{tags.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>数据状态</span><select value={route.source} onChange={(event) => onRouteChange({ source: event.target.value })}><option value="starred">当前 Stars</option><option value="missing">已退出公开 Stars</option><option value="all">全部记录</option></select></label>
      <label><span>归档状态</span><select value={route.archive} onChange={(event) => onRouteChange({ archive: event.target.value })}><option value="active">默认视图</option><option value="all">包含个人归档</option><option value="github">上游已归档</option><option value="personal">个人已归档</option></select></label>
      <label><span>排序</span><select value={route.sort} onChange={(event) => onRouteChange({ sort: event.target.value })}><option value="starred">最近收藏</option><option value="updated">最近更新</option><option value="stars">Stars 数</option></select></label>
      <div className="layout-toggle" aria-label="视图切换"><button className={route.layout === "list" ? "is-active" : ""} type="button" onClick={() => onRouteChange({ layout: "list" })}><ListBullets size={18} /> 列表</button><button className={route.layout === "cards" ? "is-active" : ""} type="button" onClick={() => onRouteChange({ layout: "cards" })}><Cards size={18} /> 卡片</button></div>
    </div>
    <div className="stage-tabs" aria-label="按学习阶段筛选"><button className={route.stage === "all" ? "is-active" : ""} type="button" onClick={() => onRouteChange({ stage: "all" })}>全部阶段</button>{catalog.stages.map((stage) => <button className={route.stage === stage.id ? "is-active" : ""} type="button" key={stage.id} onClick={() => onRouteChange({ stage: stage.id })}>{stage.label}</button>)}</div>
    <div className="active-filters"><span><Funnel size={15} />{active.length ? `${active.length} 个条件` : "全部当前公开项目"}</span>{active.map((item) => <em key={item}><Check size={12} />{item}</em>)}{active.length > 0 && <button type="button" onClick={clear}><X size={14} /> 清除全部</button>}</div>
    {filtered.length ? <div className={route.layout === "cards" ? "repo-card-grid" : "repo-feed"}>{filtered.map((repo) => <RepoEntry repo={repo} layout={route.layout} onOpen={onOpenRepo} key={repo.repoId} />)}</div> : <div className="empty-state"><h2>没有匹配的项目</h2><p>减少一个条件，或返回查看全部项目。</p><button type="button" onClick={clear}>清除筛选</button></div>}
  </section></main>;
}
