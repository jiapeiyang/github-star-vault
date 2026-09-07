import { ArrowLeft } from "@phosphor-icons/react";
import { CurationForm } from "../components/CurationForm.jsx";

export function CurationView({ repo, catalog, onOpenRepo, onDirtyChange }) {
  return <main className="workspace-page curation-page"><button className="back-link" type="button" onClick={() => onOpenRepo(repo.repoId)}><ArrowLeft size={16} /> 返回项目详情</button><header className="curation-page-title"><p>资料维护</p><h1>{repo.curation ? "完善仓库资料" : "补充仓库介绍"}</h1><span>编辑、预览，导出后提交到你的资料库。</span></header><section className="curation-sheet"><CurationForm key={repo.repoId} repo={repo} catalog={catalog} onOpenRepo={onOpenRepo} onDirtyChange={onDirtyChange} /></section></main>;
}
