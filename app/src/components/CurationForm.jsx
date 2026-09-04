import { useEffect, useState } from "react";
import { ArrowUpRight, ClipboardText, DownloadSimple, Plus, X } from "@phosphor-icons/react";
import { buildCurationTemplate, formChanged, initialCurationForm, validateCuration } from "../domain/curation.js";
import { MarkdownContent } from "./MarkdownContent.jsx";

export function CurationForm({ repo, catalog, onOpenRepo, onDirtyChange }) {
  const [form, setForm] = useState(() => initialCurationForm(repo));
  const [exported, setExported] = useState(() => initialCurationForm(repo));
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState(false);
  const errors = validateCuration(repo, form, catalog);
  const blocked = !!errors.file;
  const template = blocked ? "" : buildCurationTemplate(repo, form);
  const dirty = formChanged(form, exported);
  useEffect(() => {
    onDirtyChange(dirty);
    return () => onDirtyChange(false);
  }, [dirty, onDirtyChange]);

  const change = (patch) => { setForm((current) => ({ ...current, ...patch })); setStatus(""); };
  const error = (field) => (attempted || field === "file") && errors[field] ? <p id={`error-${field}`} className="field-error">{errors[field]}</p> : null;
  const fieldProps = (field) => ({ "aria-invalid": attempted && !!errors[field], "aria-describedby": attempted && errors[field] ? `error-${field}` : undefined });
  const exportFile = async (kind) => {
    setAttempted(true);
    if (Object.keys(errors).length) { setStatus("请先修改标出的字段，文件尚未导出。"); return; }
    if (kind === "copy") {
      try {
        await navigator.clipboard.writeText(template);
      } catch {
        setStatus("浏览器未允许复制。可以下载文件，或从文件预览中手动复制。");
        return;
      }
    } else {
      const url = URL.createObjectURL(new Blob([template], { type: "text/markdown;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${repo.repoId}.md`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    setExported(form);
    setStatus(`${kind === "copy" ? "已复制" : "已发起下载"} ${repo.repoId}.md。放入 content/repos/，审阅并提交后才会更新网站。`);
  };

  return <form className="curation-form" noValidate onSubmit={(event) => { event.preventDefault(); exportFile("download"); }}>
    <div className="curation-heading"><div><span>{repo.curation ? "修改策展文件" : "新建策展文件"}</span><h2>{repo.name}</h2><p>{repo.description}</p></div><button className="text-link" type="button" onClick={() => onOpenRepo(repo.repoId)}>查看详情 <ArrowUpRight size={16} /></button></div>
    {error("file")}
    <div className="curation-grid">
      <label><span>主分类</span><select value={form.category} onChange={(event) => change({ category: event.target.value })} {...fieldProps("category")}>{catalog.categories.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select>{error("category")}</label>
      <label><span>资源类型</span><select value={form.resourceType} onChange={(event) => change({ resourceType: event.target.value })} {...fieldProps("resourceType")}>{catalog.resourceTypes.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select>{error("resourceType")}</label>
      <label className="full-field"><span>一句话价值</span><textarea value={form.note} onChange={(event) => change({ note: event.target.value })} rows={3} placeholder="这个项目对你有什么用？" {...fieldProps("note")} />{error("note")}</label>
      <label><span>学习阶段</span><select value={form.stage} onChange={(event) => change({ stage: event.target.value })} {...fieldProps("stage")}>{catalog.stages.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select>{error("stage")}</label>
      <fieldset className="tag-editor"><legend>个人标签 · 最多 5 个</legend>{form.tags.map((tag, index) => <div key={index}><input aria-label={`标签 ${index + 1}`} value={tag} onChange={(event) => change({ tags: form.tags.map((value, i) => i === index ? event.target.value : value) })} {...fieldProps("tags")} /><button type="button" aria-label={`移除标签 ${index + 1}`} onClick={() => change({ tags: form.tags.filter((_, i) => i !== index) })}><X size={16} /></button></div>)}<button type="button" className="text-link" disabled={form.tags.length >= 5} onClick={() => change({ tags: [...form.tags, ""] })}><Plus size={16} /> 添加标签</button>{error("tags")}</fieldset>
      <div className="full-field related-readonly"><strong>关联项目</strong><p>{repo.relatedRepoIds.length ? repo.relatedRepoIds.map((id) => catalog.repositories.find((item) => item.repoId === id)?.name || id).join("、") : "暂无关联项目"}</p><small>导出时保留现有关联，修改关联请编辑 Git 文件。</small></div>
      <div className="full-field note-editor"><div className="note-editor-tabs" role="group" aria-label="笔记显示方式"><button type="button" aria-pressed={!preview} onClick={() => setPreview(false)}>编辑正文</button><button type="button" aria-pressed={preview} onClick={() => setPreview(true)}>阅读预览</button></div>{preview ? <MarkdownContent>{form.body}</MarkdownContent> : <label><span>学习笔记 · Markdown</span><textarea value={form.body} onChange={(event) => change({ body: event.target.value })} rows={15} spellCheck={false} {...fieldProps("body")} /></label>}{error("body")}</div>
    </div>
    <p className="session-notice">修改仅保留在当前页面。导出文件后，放入仓库的 content/repos/ 并提交，网站才会更新。</p>
    <div className="export-actions"><button className="primary-action" type="submit" disabled={blocked}><DownloadSimple size={18} /> 下载策展文件</button><button className="secondary-action" type="button" disabled={blocked} onClick={() => exportFile("copy")}><ClipboardText size={18} /> 复制 Markdown</button><span>{dirty ? "有未导出修改" : "无未导出修改"}</span></div>
    <p className="export-status" role="status">{status}</p>
    {!blocked && <details className="template-preview"><summary>查看导出文件内容</summary><textarea aria-label="导出文件预览" readOnly value={template} rows={12} /></details>}
  </form>;
}
