import { ArrowDown, ArrowUp, CaretLeft, CaretRight, Clock, Tray } from "@phosphor-icons/react";
import { formatDate } from "../domain/catalog.js";
import { getInboxState } from "../domain/inbox.js";
import { CurationForm } from "../components/CurationForm.jsx";

export function InboxView({ catalog, route, onRouteChange, onOpenRepo, onDirtyChange }) {
  const state = getInboxState(catalog.repositories, route);
  const move = (patch) => onRouteChange({ repo: "", ...patch });
  return <main className="workspace-page"><header className="workspace-hero"><div><p>每周整理 · 收件箱</p><h1>把 Star 变成判断</h1></div><div className="workspace-summary"><strong>{state.queues.inbox.length}</strong><span>个新收藏待整理<br />另有 {state.queues.imported.length} 个历史项目</span></div></header>
    <div className="inbox-mode-tabs">{[["inbox", "新收藏"], ["imported", "历史待整理"]].map(([queue, label]) => <button key={queue} className={state.queue === queue ? "is-active" : ""} type="button" onClick={() => move({ queue, queuePage: "1", queueQuery: "" })}>{label} {state.queues[queue].length}</button>)}</div>
    <a className="mobile-queue-link" href="#queue-list">选择其他项目 <ArrowDown size={16} /></a>
    <div className="inbox-layout"><aside className="queue-column" id="queue-list"><div className="section-label"><Tray size={19} /><span>{state.queue === "inbox" ? "等待整理" : "历史库存"}</span></div>
      <label className="queue-search"><span>搜索当前队列</span><input type="search" value={route.queueQuery} onChange={(event) => move({ queueQuery: event.target.value, queuePage: "1" })} placeholder="仓库名称、描述或标签" /></label>
      <nav className="queue-pagination" aria-label="收件箱分页"><button type="button" aria-label="上一页" disabled={state.page <= 1} onClick={() => move({ queuePage: String(state.page - 1) })}><CaretLeft size={18} /></button><span>第 {state.page} / {state.pages} 页 · {state.total} 个</span><button type="button" aria-label="下一页" disabled={state.page >= state.pages} onClick={() => move({ queuePage: String(state.page + 1) })}><CaretRight size={18} /></button></nav>
      <div className="queue-items">{state.items.map((repo) => <button className={state.selected?.repoId === repo.repoId ? "queue-item is-active" : "queue-item"} aria-current={state.selected?.repoId === repo.repoId ? "true" : undefined} type="button" key={repo.repoId} onClick={() => onRouteChange({ repo: String(repo.repoId) })}><img src={repo.avatar} alt="" /><span><strong>{repo.name}</strong><small><Clock size={12} /> 收藏于 {formatDate(repo.starredAt)}</small></span></button>)}</div>
      {!state.items.length && <div className="queue-empty"><strong>{route.queueQuery ? "没有匹配的项目" : "当前队列已整理完成"}</strong><span>{route.queueQuery ? "试试其他关键词，或清除搜索。" : "新的 Star 会在下一次成功同步后进入这里。"}</span>{route.queueQuery && <button type="button" onClick={() => move({ queueQuery: "", queuePage: "1" })}>清除队列搜索</button>}</div>}
      {state.selected && <a className="mobile-queue-link" href="#curation-sheet">回到整理表单 <ArrowUp size={16} /></a>}
    </aside><section className="curation-sheet" id="curation-sheet">{state.selected ? <CurationForm key={state.selected.repoId} repo={state.selected} catalog={catalog} onOpenRepo={onOpenRepo} onDirtyChange={onDirtyChange} /> : <div className="sheet-empty"><h2>当前列表是空的</h2><p>切换队列，或调整搜索条件。</p></div>}</section></div>
  </main>;
}
