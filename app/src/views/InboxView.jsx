import { ArrowDown, ArrowUp, CaretLeft, CaretRight, Clock, Tray } from "@phosphor-icons/react";
import { formatDate } from "../domain/catalog.js";
import { getInboxState, SOURCE_CHECK_LABELS } from "../domain/inbox.js";
import { CurationForm } from "../components/CurationForm.jsx";

export function InboxView({ catalog, route, onRouteChange, onOpenRepo, onDirtyChange }) {
  const state = getInboxState(catalog.repositories, route, catalog.topics);
  const move = (patch) => onRouteChange({ repo: "", ...patch });
  const filter = (patch) => move({ queuePage: "1", ...patch });
  const hasFilters = route.queueQuery || route.queueStatus !== "all" || route.queueTopic !== "all" || route.queueCheckedBefore;
  return <main className="workspace-page"><header className="workspace-hero"><div><p>仓库资料 · 内容维护</p><h1>补充仓库资料</h1></div><div className="workspace-summary"><strong>{state.queues.unclassified.length}</strong><span>个项目待分类<br />另有 {state.queues.undescribed.length} 个待补充解读</span></div></header>
    <div className="inbox-mode-tabs">{[["unclassified", "待分类"], ["undescribed", "待补介绍"], ["review", "来源待核查"], ["limited", "资料受限"], ["all", "全部资料"]].map(([queue, label]) => <button key={queue} className={state.queue === queue ? "is-active" : ""} type="button" onClick={() => move({ queue, queuePage: "1", queueQuery: "" })}>{label} {state.queues[queue].length}</button>)}</div>
    <p className="maintenance-explanation">{catalog.sourcesCheckedAt?`最近一次检查命令：${formatDate(catalog.sourcesCheckedAt,{hour:"2-digit",minute:"2-digit"})}，各项目检查时间见列表。`:"尚无来源检查记录。"} README 变化只是复核线索；版本相同不代表全部文档和 API 均未变化。</p>
    <a className="mobile-queue-link" href="#queue-list">选择其他项目 <ArrowDown size={16} /></a>
    <div className="inbox-layout"><aside className="queue-column" id="queue-list"><div className="section-label"><Tray size={19} /><span>{"项目列表"}</span></div>
      <label className="queue-search"><span>搜索当前队列</span><input type="search" value={route.queueQuery} onChange={(event) => move({ queueQuery: event.target.value, queuePage: "1" })} placeholder="仓库名称、描述或标签" /></label>
      <div className="queue-filters">
        <label><span>来源检查结果</span><select value={state.route.queueStatus} onChange={event => filter({ queueStatus: event.target.value })}><option value="all">全部检查结果</option>{Object.entries(SOURCE_CHECK_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
        <label><span>用途专题</span><select value={state.route.queueTopic} onChange={event => filter({ queueTopic: event.target.value })}><option value="all">全部项目</option>{catalog.topics.map(topic => <option key={topic.id} value={topic.id}>{topic.title}</option>)}</select></label>
        <label><span>检查日期不晚于（北京时间）</span><input type="date" value={state.route.queueCheckedBefore} onChange={event => filter({ queueCheckedBefore: event.target.value })} /></label>
        <label><span>队列排序</span><select value={state.route.queueSort} onChange={event => filter({ queueSort: event.target.value })}><option value="starred">最近收藏</option><option value="checked">检查最早优先 · 未检查在前</option></select></label>
      </div>
      {hasFilters && <button className="text-link queue-clear" type="button" onClick={() => filter({ queueQuery: "", queueStatus: "all", queueTopic: "all", queueCheckedBefore: "" })}>清除队列筛选</button>}
      <nav className="queue-pagination" aria-label="资料列表分页"><button type="button" aria-label="上一页" disabled={state.page <= 1} onClick={() => move({ queuePage: String(state.page - 1) })}><CaretLeft size={18} /></button><span>第 {state.page} / {state.pages} 页 · {state.total} 个</span><button type="button" aria-label="下一页" disabled={state.page >= state.pages} onClick={() => move({ queuePage: String(state.page + 1) })}><CaretRight size={18} /></button></nav>
      <div className="queue-items">{state.items.map((repo) => <button className={state.selected?.repoId === repo.repoId ? "queue-item is-active" : "queue-item"} aria-current={state.selected?.repoId === repo.repoId ? "true" : undefined} type="button" key={repo.repoId} onClick={() => onRouteChange({ repo: String(repo.repoId) })}><img src={repo.avatar} alt="" loading="lazy" /><span><strong>{repo.name}</strong><small><Clock size={12} /> 收藏于 {formatDate(repo.starredAt)}</small><small>{SOURCE_CHECK_LABELS[repo.sourceCheck?.status || "unchecked"]}{repo.sourceCheck?.checked_at && ` · ${formatDate(repo.sourceCheck.checked_at, { hour: "2-digit", minute: "2-digit" })}`}</small>{repo.sourceCheck?.reason && <small>{repo.sourceCheck.reason}</small>}</span></button>)}</div>
      {!state.items.length && <div className="queue-empty"><strong>{hasFilters ? "没有匹配的项目" : "当前队列没有项目"}</strong><span>{hasFilters ? "调整检查结果、日期或专题，或清除队列筛选。" : "可切换其他队列。来源状态以实际检查记录为准。"}</span></div>}
      {state.selected && <a className="mobile-queue-link" href="#curation-sheet">回到整理表单 <ArrowUp size={16} /></a>}
    </aside><section className="curation-sheet" id="curation-sheet">{state.selected ? <CurationForm key={state.selected.repoId} repo={state.selected} catalog={catalog} onOpenRepo={onOpenRepo} onDirtyChange={onDirtyChange} /> : <div className="sheet-empty"><h2>当前列表是空的</h2><p>切换队列，或调整搜索条件。</p></div>}</section></div>
  </main>;
}
