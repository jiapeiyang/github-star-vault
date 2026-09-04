import { ArrowLeft } from "@phosphor-icons/react";
import { CurationForm } from "../components/CurationForm.jsx";

export function CurationView({ repo, catalog, onOpenRepo, onDirtyChange }) {
  return <main className="workspace-page curation-page"><button className="back-link" type="button" onClick={() => onOpenRepo(repo.repoId)}><ArrowLeft size={16} /> 返回项目详情</button><header className="curation-page-title"><p>个人策展</p><h1>{repo.curation ? "继续沉淀你的判断" : "写下收藏的理由"}</h1><span>编辑、预览，导出后提交到你的知识库。</span></header><section className="curation-sheet"><CurationForm key={repo.repoId} repo={repo} catalog={catalog} onOpenRepo={onOpenRepo} onDirtyChange={onDirtyChange} /></section></main>;
}
