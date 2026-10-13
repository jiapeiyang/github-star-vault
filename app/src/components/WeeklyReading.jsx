import { ArrowRight, BookOpen } from "@phosphor-icons/react";
import { MarkdownContent } from "./MarkdownContent.jsx";
import { RouteLink } from "./RouteLink.jsx";

export function WeeklyReading({ reading, issue, entries, onRouteChange }) {
  return <section className="weekly-deep-reading" aria-label="本期编辑导读">
    <div className="weekly-reading-heading"><BookOpen size={22}/><div><span className="section-kicker">本期导读 · 公开资料整理</span><h3>{reading.title}</h3></div></div>
    <p className="weekly-reading-evidence">导读核查于 {reading.reviewedAt}，独立于首次出刊；示例验证范围见正文。</p>
    <MarkdownContent>{reading.contentMarkdown}</MarkdownContent>
    {reading.connections.length > 0 && <section className="weekly-connections" aria-label="同主题阅读路线"><h4>接下来，把这条线继续读下去</h4>{reading.connections.map(connection => {
      const entry = entries.find(item => item.repoId === connection.repoId);
      return <div className="weekly-connection" key={connection.repoId}><h5>{connection.title}</h5><p>{connection.note}</p>{entry.repo ? <><RouteLink className="text-link" route={{ view: "detail", repo: String(entry.repoId), issue: issue.id }} onChange={onRouteChange}>{entry.repo.name} <ArrowRight size={16}/></RouteLink>{entry.status && <p className="weekly-notice">{entry.status}</p>}</> : <p className="weekly-notice">{entry.selection.name} · {entry.unavailable}</p>}</div>;
    })}</section>}
    <details className="weekly-reading-sources"><summary>本期导读的公开来源（{reading.sources.length}）</summary><ul>{reading.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></details>
  </section>;
}
