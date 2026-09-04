import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, ClipboardText, Clock, Tag, Tray } from "@phosphor-icons/react";
import { formatDate } from "../domain/catalog.js";
import { buildCurationTemplate } from "../domain/curation.js";

export function InboxView({ catalog, selectedRepoId, onSelectRepo, onOpenRepo }) {
  const inbox = catalog.repositories.filter((repo) => repo.sourceStatus === "starred" && repo.stage === "inbox");
  const imported = catalog.repositories.filter((repo) => repo.sourceStatus === "starred" && repo.stage === "imported");
  const selectedFromUrl = catalog.repositories.find((repo) => String(repo.repoId) === selectedRepoId);
  const initialMode = selectedFromUrl?.stage === "imported" || inbox.length === 0 ? "imported" : "inbox";
  const [mode, setMode] = useState(initialMode);
  const candidates = mode === "inbox" ? inbox : imported;
  const [selectedId, setSelectedId] = useState(selectedFromUrl?.repoId || candidates[0]?.repoId || null);
  const selected = candidates.find((repo) => repo.repoId === selectedId) || candidates[0];
  const [form, setForm] = useState({ category: "ai-agent", resourceType: "collection", stage: "queued", note: "", tags: "" });
  const [copyState, setCopyState] = useState("");
  const categoryOptions = catalog.categories.filter((item) => item.id !== "unclassified");
  const resourceOptions = catalog.resourceTypes.filter((item) => item.id !== "unclassified");
  const template = useMemo(() => selected ? buildCurationTemplate(selected, form) : "", [form, selected]);

  useEffect(() => {
    if (!selected) return;
    setSelectedId(selected.repoId);
    setForm({ category: selected.category === "unclassified" ? "ai-agent" : selected.category, resourceType: selected.resourceTypeId === "unclassified" ? "collection" : selected.resourceTypeId, stage: "queued", note: selected.note || selected.description.slice(0, 120), tags: selected.tags.join("、") });
    setCopyState("");
  }, [selected?.repoId]);

  const copyTemplate = async (event) => {
    event.preventDefault();
    if (!selected || !form.note.trim()) return;
    try {
      await navigator.clipboard.writeText(template);
      setCopyState(`已复制 content/repos/${selected.repoId}.md`);
    } catch {
      setCopyState("浏览器未允许复制，请从下方文本框手动复制。 ");
    }
  };

  const chooseMode = (nextMode) => {
    setMode(nextMode);
    const first = (nextMode === "inbox" ? inbox : imported)[0];
    setSelectedId(first?.repoId || null);
    if (first) onSelectRepo(first);
  };

  return <main className="workspace-page"><header className="workspace-hero"><div><p>每周整理 · 收件箱</p><h1>把 Star 变成判断</h1></div><div className="workspace-summary"><strong>{inbox.length}</strong><span>个新收藏待整理<br />另有 {imported.length} 个历史项目</span></div></header>
    <div className="inbox-mode-tabs"><button className={mode === "inbox" ? "is-active" : ""} type="button" onClick={() => chooseMode("inbox")}>新收藏 {inbox.length}</button><button className={mode === "imported" ? "is-active" : ""} type="button" onClick={() => chooseMode("imported")}>历史待整理 {imported.length}</button></div>
    <div className="inbox-layout"><aside className="queue-column"><div className="section-label"><Tray size={19} /><span>{mode === "inbox" ? "等待整理" : "历史库存"}</span></div>{candidates.length ? candidates.slice(0, 30).map((repo) => <button className={selected?.repoId === repo.repoId ? "queue-item is-active" : "queue-item"} type="button" key={repo.repoId} onClick={() => { setSelectedId(repo.repoId); onSelectRepo(repo); }}><img src={repo.avatar} alt="" /><span><strong>{repo.name}</strong><small><Clock size={12} /> 收藏于 {formatDate(repo.starredAt)}</small></span></button>) : <div className="queue-empty"><Check size={32} /><strong>本周已整理完成</strong><span>新的 Star 会在下一次成功同步后进入这里。</span></div>}</aside>
      <section className="curation-sheet">{selected ? <form onSubmit={copyTemplate}><div className="curation-heading"><div><span>01 / 生成策展文件</span><h2>{selected.name}</h2><p>{selected.description}</p></div><button className="text-link" type="button" onClick={() => onOpenRepo(selected.repoId)}>查看完整资料 <ArrowUpRight size={16} /></button></div>
        <div className="curation-grid"><label><span>主分类</span><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categoryOptions.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label><label><span>资源类型</span><select value={form.resourceType} onChange={(event) => setForm({ ...form, resourceType: event.target.value })}>{resourceOptions.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label><label className="full-field"><span>一句话价值</span><textarea required value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} rows="3" maxLength="160" /></label><label><span>下一步</span><select value={form.stage} onChange={(event) => setForm({ ...form, stage: event.target.value })}><option value="queued">加入待学习</option><option value="learning">开始学习</option><option value="reference">设为仅参考</option><option value="archived">个人归档</option></select></label><label><span>个人标签 · 最多 5 个</span><div className="input-with-icon"><Tag size={17} /><input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="用顿号分隔" /></div></label></div>
        <div className="session-notice">公开网站只读。此处生成真实策展文件内容，复制到仓库并 commit 后，下一次构建才会生效。</div><button className="primary-action" type="submit"><ClipboardText size={18} /> 复制策展文件</button>{copyState && <p className="copy-status" role="status">{copyState}</p>}<label className="template-preview"><span>文件预览</span><textarea readOnly value={template} rows="12" /></label>
      </form> : <div className="sheet-empty"><Check size={48} /><h2>当前列表是空的</h2><p>切换到历史待整理，或等待下一次同步。</p></div>}</section>
    </div>
  </main>;
}
