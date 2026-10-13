import { useMemo, useRef, useState } from "react";
import { ClipboardText, DownloadSimple, X } from "@phosphor-icons/react";
import { RepoLink } from "../components/RepoLink.jsx";
import { RouteLink } from "../components/RouteLink.jsx";
import { candidateEntries, CANDIDATE_LIMIT, TASK_BRIEF_LIMIT } from "../domain/candidate-basket.js";
import { buildCandidateExport, guideLabel, sourceLabel } from "../domain/candidate-export.js";

export function CandidateBasketView({ catalog, basket, onRouteChange, onOpenRepo }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const [status, setStatus] = useState("");
  const [copying, setCopying] = useState(false);
  const brief = useRef(null);
  const clearTrigger = useRef(null);
  const removers = useRef(new Map());
  const entries = candidateEntries(basket, catalog.repositories);
  const output = useMemo(() => {
    const generatedAt = new Date().toISOString();
    return { ...buildCandidateExport({ basket: { repoIds: basket.repoIds, taskBrief: basket.taskBrief }, catalog, siteUrl: window.location.href, generatedAt }), filename: `star-vault-candidates-${generatedAt.slice(0, 10)}.md` };
  }, [basket.repoIds, basket.taskBrief, catalog]);

  const remove = entry => {
    const index = basket.repoIds.indexOf(entry.repoId);
    const adjacent = basket.repoIds[index + 1] ?? basket.repoIds[index - 1];
    basket.toggle(entry.repo || { repoId: entry.repoId });
    setStatus("");
    // 被点击的按钮会卸载，下一帧将焦点交给相邻条目或任务说明。
    requestAnimationFrame(() => (removers.current.get(adjacent) || brief.current)?.focus());
  };
  const exportFile = async kind => {
    if (output.error) return;
    setStatus("");
    if (kind === "copy") {
      setCopying(true);
      try { await navigator.clipboard.writeText(output.text); setStatus(`已复制 ${output.filename}。`); }
      catch { setStatus("浏览器未允许复制。可下载文件，或从下方预览中手动复制。"); }
      finally { setCopying(false); }
    } else {
      let url;
      try {
        url = URL.createObjectURL(new Blob([output.text], { type: "text/markdown;charset=utf-8" }));
        const anchor = document.createElement("a");
        anchor.href = url; anchor.download = output.filename;
        document.body.append(anchor);
        try { anchor.click(); } finally { anchor.remove(); }
        setStatus(`已发起下载 ${output.filename}。`);
      } catch { setStatus("未能发起下载，请从下方预览中手动复制。"); }
      finally { if (url) setTimeout(() => URL.revokeObjectURL(url), 1000); }
    }
  };

  return <main className="candidate-page">
    <header className="feed-heading"><div><p>为这一次选择，带走完整资料</p><h1>候选工具篮</h1></div><span>{basket.repoIds.length} / {CANDIDATE_LIMIT} 个候选</span></header>
    <p className="candidate-intro">仅在此标签页暂存，刷新时保留；关闭标签页后的恢复不作保证。需要长期保留时请导出。加入候选不代表采用或实测。</p>
    <div className="candidate-workspace"><div>
      <label className="candidate-brief"><strong>这次想完成什么</strong><textarea ref={brief} aria-label="这次想完成什么" value={basket.taskBrief} maxLength={TASK_BRIEF_LIMIT} rows={4} aria-describedby="candidate-brief-help" placeholder="例如：为两台自有 VPS 选择监控面板，先比较部署前提和后续维护，再给实施方案。" onChange={event => { basket.changeBrief(event.target.value); setStatus(""); }} /><span id="candidate-brief-help">可留空 · {basket.taskBrief.length} / {TASK_BRIEF_LIMIT} 字符 · 请勿输入密钥或密码</span></label>
      <div className="candidate-list-heading"><h2>本次候选</h2><RouteLink route={{ view: "library" }} onChange={onRouteChange}>继续找项目</RouteLink></div>
      <div className="candidate-list">{entries.map(entry => <article key={entry.repoId} className="candidate-item">
        {entry.repo ? <><RepoLink clean repoId={entry.repoId} onOpen={onOpenRepo} className="candidate-identity"><img src={entry.repo.avatar} alt="" loading="lazy" /><h3>{entry.repo.name}</h3></RepoLink><p>{entry.repo.summary || entry.repo.description}</p><p className="candidate-item-meta">{guideLabel(entry.repo)} · 人工核查 {entry.repo.reviewedAt || "未记录"} · 正文更新 {entry.repo.contentUpdatedAt || "未记录"}</p><p className="candidate-item-meta">{sourceLabel(entry.repo)}{entry.repo.sourceCheck && ` · 观察时间 ${entry.repo.sourceCheck.checked_at || catalog.sourcesCheckedAt || "未记录"}`}</p>{entry.repo.guideLimitation && <p className="candidate-item-meta">资料限制：{entry.repo.guideLimitation}</p>}<p className="candidate-item-flags">{[entry.repo.personalArchived && "个人归档", entry.repo.archived && "上游归档", entry.repo.sourceStatus === "missing" && "已退出公开 Stars"].filter(Boolean).join(" · ")}</p></> : <><h3>项目资料暂不可用</h3><p>repo ID：{entry.repoId}。此项仍保留在名单中，请移除后再导出。</p></>}
        <button className="candidate-remove" type="button" ref={node => { if (node) removers.current.set(entry.repoId, node); else removers.current.delete(entry.repoId); }} aria-label={`移除候选：${entry.repo?.name || entry.repoId}`} onClick={() => remove(entry)}><X size={16} aria-hidden="true" />移除</button>
      </article>)}</div>
      {!entries.length && <div className="candidate-empty"><h3>还没有候选</h3><p>从用途搜索或任务配方找到项目，点击「加入候选」。</p><RouteLink route={{ view: "recipes" }} onChange={onRouteChange}>浏览任务配方</RouteLink></div>}
      {(entries.length > 0 || basket.taskBrief) && <div className="candidate-clear">{confirmClear ? <><p>清空全部候选和任务说明？此操作无法撤销。</p><button autoFocus type="button" className="secondary-action" onClick={() => { basket.clear(); setConfirmClear(false); setStatus(""); brief.current?.focus(); }}>确认清空</button><button type="button" className="text-link" onClick={() => { setConfirmClear(false); requestAnimationFrame(() => clearTrigger.current?.focus()); }}>取消</button></> : <button ref={clearTrigger} className="text-link" type="button" onClick={() => setConfirmClear(true)}>清空工具篮</button>}</div>}
    </div><aside className="candidate-export"><h2>带走资料</h2><p>包含任务说明、全部候选的 GitHub 事实、人工解读全文、公开来源和核查日期。</p><p>解读完整不代表示例已运行。导出后可以带到 Codex 等工具继续讨论。</p><div className="candidate-export-actions"><button className="primary-action" type="button" disabled={!!output.error} onClick={() => exportFile("download")}><DownloadSimple size={18} />下载 Markdown</button><button className="secondary-action" type="button" disabled={!!output.error || copying} onClick={() => exportFile("copy")}><ClipboardText size={18} />{copying ? "正在复制…" : "复制 Markdown"}</button></div><p className="candidate-export-status" role="status">{status}</p>{output.error ? <p className="candidate-export-error">{output.error}</p> : <small>{output.text.length.toLocaleString("zh-CN")} 字符 · 当前已加载资料，不是实时查询</small>}</aside></div>
    {!output.error && <section className="candidate-preview"><h2>完整导出预览</h2><p>可直接选择文本手动复制；复制和下载都不会清空工具篮。</p><textarea readOnly aria-label="候选资料 Markdown 预览" value={output.text} rows={18} spellCheck={false} /></section>}
  </main>;
}
