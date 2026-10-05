import { RepoLink } from "./RepoLink.jsx";

const rows = [["task", "适用任务"], ["input", "准备什么"], ["output", "得到什么"], ["start", "从哪里开始"], ["requirements", "使用前提"], ["limitations", "限制与边界"]];

export function TopicComparison({ comparison, repositories, onOpenRepo }) {
  const entries = comparison.entries.map(entry => ({ ...entry, repo: repositories.find(repo => repo.repoId === entry.repoId) })).filter(entry => entry.repo && !entry.repo.personalArchived);
  if (entries.length < 2) return null;
  return <section className="topic-comparison" aria-label="项目轻量对照">
    <header><span className="section-kicker">公开资料归纳 · 核查于 {comparison.reviewedAt}</span><h2>{comparison.title}</h2><p>{comparison.description}</p></header>
    <div className="comparison-scroll" tabIndex="0" role="region" aria-label="项目对照表，可横向滚动">
      <table>
        <caption>按任务选择入口；这份对照未运行第三方项目，不构成效果或兼容性保证。</caption>
        <thead><tr><th scope="col">选择依据</th>{entries.map(entry => <th scope="col" key={entry.repoId}>
          <RepoLink repoId={entry.repoId} onOpen={onOpenRepo}>{entry.repo.name}</RepoLink>
          {(entry.repo.archived || entry.repo.sourceStatus === "missing") && <small>{entry.repo.archived ? "上游已归档" : "已退出公开 Stars"}</small>}
        </th>)}</tr></thead>
        <tbody>{rows.map(([key, label]) => <tr key={key}><th scope="row">{label}</th>{entries.map(entry => <td key={entry.repoId}>{entry[key]}</td>)}</tr>)}
          <tr><th scope="row">公开来源</th>{entries.map(entry => <td key={entry.repoId}><ul>{entry.sources.map((source, index) => <li key={source}><a href={source} target="_blank" rel="noreferrer">来源 {index + 1} · 查看原文</a></li>)}</ul></td>)}</tr>
        </tbody>
      </table>
    </div>
    <p className="comparison-mobile-hint">窄屏下可横向滚动对照表，或打开仓库解读继续阅读。</p>
  </section>;
}
