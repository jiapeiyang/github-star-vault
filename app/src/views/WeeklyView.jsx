import { ArrowRight, ArrowUpRight, BookOpen } from "@phosphor-icons/react";
import { CandidateButton } from "../components/CandidateButton.jsx";
import { HistoryNavigation } from "../components/HistoryNavigation.jsx";
import { MarkdownContent } from "../components/MarkdownContent.jsx";
import { RouteLink } from "../components/RouteLink.jsx";
import { SourceNotice } from "../components/SourceNotice.jsx";
import { formatDate } from "../domain/catalog.js";
import { guideReadingSections, issueEntries, issueIsPast, issueNumber, issuePeriod, selectionReason } from "../domain/weekly.js";

function ReadingEntry({ entry, issue, index, onRouteChange, basket, lead = false }) {
  const { repo, selection, unavailable, status } = entry;
  const sections = lead && repo?.hasGuide ? guideReadingSections(repo.contentMarkdown) : [];
  const detailRoute = anchor => ({ view: "detail", repo: String(entry.repoId), issue: issue.id, anchor });
  return <article className={`weekly-entry${lead ? " weekly-lead" : ""}`} id={`weekly-item-${entry.repoId}`}>
    <header className="weekly-entry-heading"><span className="weekly-entry-index">{String(index + 1).padStart(2, "0")}</span><div><p className="section-kicker">{lead ? "本期主读" : entry.slot === "theme" ? "同主题延伸" : "换个领域"} · {selection.categoryLabel}</p><h2>{repo ? <RouteLink route={detailRoute("")} onChange={onRouteChange}>{repo.name} <ArrowUpRight size={20}/></RouteLink> : selection.name}</h2></div>{repo && <img src={repo.avatar} alt="" loading="lazy"/>}</header>
    <p className="weekly-selection"><strong>编选依据</strong>{selectionReason(entry)}</p>
    {unavailable ? <p className="weekly-notice">{unavailable}</p> : <>
      {status && <p className="weekly-notice">{status}</p>}
      <p className="weekly-summary">{repo.summary || repo.description}</p>
      <p className="weekly-facts"><span>GitHub 收藏 · {formatDate(selection.starredAt)}</span><span>公开资料整理 · {repo.resourceType} · 核查于 {repo.reviewedAt || "暂无"}</span></p>
      <SourceNotice repo={repo}/>
      {lead && <div className="weekly-reading-path"><div className="weekly-reading-heading"><BookOpen size={22}/><div><h3>带着问题，重新读一遍</h3><p>{issue.editorial.question}</p></div></div><p className="weekly-reading-evidence">下方摘录来自现有仓库解读，依据公开资料整理；示例是否执行，以原文标注为准。</p>
        {sections.map(section => <details className="weekly-reading-section" key={section.id}><summary><span>{section.title}</span><strong>{section.prompt}</strong></summary><div><MarkdownContent>{section.markdown}</MarkdownContent><RouteLink className="text-link" route={detailRoute(section.id)} onChange={onRouteChange}>从「{section.title}」继续读完整解读 <ArrowRight size={16}/></RouteLink></div></details>)}
        {!sections.length && <p>当前没有可摘录的标准章节，可从完整解读继续阅读。</p>}
      </div>}
      <div className="weekly-entry-actions"><RouteLink className="weekly-read-link" route={detailRoute("")} onChange={onRouteChange}>{lead ? "阅读完整解读与来源" : "重读仓库解读"} <ArrowRight size={17}/></RouteLink><CandidateButton repo={repo} basket={basket}/></div>
    </>}
  </article>;
}

export function WeeklyView({ catalog, issues, error, route, onRouteChange, basket }) {
  const issue = route.issue ? issues.find(item => item.id === route.issue) : issues[0];
  if (!issue) return <main className="weekly-page"><HistoryNavigation view="weekly" onChange={onRouteChange}/><section className="weekly-empty"><span className="section-kicker">每周收藏特刊</span><h1>{error ? "特刊暂时无法打开" : route.issue ? "没有找到这一期" : "第一期，等待装订"}</h1><p>{error || (route.issue ? "这期尚未生成，或链接中的日期有误。往期只保留实际生成的期刊。" : "有符合条件的收藏时，下一次成功生成与构建后会出现在这里。可以先沿收藏时间线回顾。")}</p>{issues.length > 0 && <RouteLink className="weekly-primary-link" route={{ view: "weekly" }} onChange={onRouteChange}>打开最近一期 <ArrowRight size={18}/></RouteLink>}<RouteLink className="text-link" route={{ view: "history", source: "all" }} onChange={onRouteChange}>浏览收藏时间线 <ArrowRight size={16}/></RouteLink></section></main>;
  const entries = issueEntries(issue, catalog.repositories);
  const lead = entries[0], theme = entries.filter(entry => entry.slot === "theme"), discoveries = entries.filter(entry => entry.slot === "discovery");
  const older = issue.id !== issues[0].id;
  return <main className="weekly-page"><HistoryNavigation view="weekly" onChange={onRouteChange}/>
    <header className="weekly-masthead"><div className="weekly-edition"><span>STAR VAULT / WEEKLY</span><strong>{issueNumber(issue)}</strong><span>{older ? "往期收藏特刊" : "每周收藏特刊"}</span></div><div className="weekly-title"><p className="weekly-date"><time>{issuePeriod(issue)}</time><span>北京时间 · {entries.length} 个收藏</span></p><h1>{issue.editorial.title.split("，").map((part, index, parts) => <span key={index}>{part}{index < parts.length - 1 ? "，" : ""}</span>)}</h1><p>{issue.editorial.intro}</p><a className="weekly-primary-link" href={`#weekly-item-${lead.repoId}`}>从主读开始 <ArrowRight size={18}/></a></div></header>
    {!older && issueIsPast(issue) && <p className="weekly-notice">最近一期截至 {issue.weekEnd}。新一期会在下一次成功生成与构建后出现。</p>}
    {entries.length < 5 && <p className="weekly-notice">本期有 {entries.length} 个符合条件的收藏；保留八周重访间隔，按实际候选数量出刊。</p>}
    <div className="weekly-layout"><div className="weekly-stories"><ReadingEntry key={`${issue.id}-${lead.repoId}`} entry={lead} issue={issue} index={0} onRouteChange={onRouteChange} basket={basket} lead/>
      {theme.length > 0 && <section aria-labelledby="weekly-theme-heading"><header className="weekly-section-heading"><span>继续这条线</span><h2 id="weekly-theme-heading">同主题，继续展开</h2></header>{theme.map((entry, index) => <ReadingEntry key={`${issue.id}-${entry.repoId}`} entry={entry} issue={issue} index={index + 1} onRouteChange={onRouteChange} basket={basket}/>)}</section>}
      {discoveries.length > 0 && <section aria-labelledby="weekly-discovery-heading"><header className="weekly-section-heading"><span>留一点偶遇</span><h2 id="weekly-discovery-heading">换个领域，重新发现</h2></header>{discoveries.map((entry, index) => <ReadingEntry key={`${issue.id}-${entry.repoId}`} entry={entry} issue={issue} index={theme.length + index + 1} onRouteChange={onRouteChange} basket={basket}/>)}</section>}
      <section className="weekly-closing"><span className="section-kicker">读完以后，留一个入口</span><h2>下次需要时，想得起它。</h2><p>试着用一句话说清：它解决什么、何时会用到、从哪里开始。已经有具体任务的仓库，可以加入候选工具篮，把资料一起带走。</p><RouteLink className="text-link" route={{ view: "basket" }} onChange={onRouteChange}>查看候选工具篮 <ArrowRight size={17}/></RouteLink></section>
    </div><aside className="weekly-sidebar"><nav className="weekly-contents" aria-label="本期目录"><h2>本期目录</h2>{entries.map((entry, index) => <a key={entry.repoId} href={`#weekly-item-${entry.repoId}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{entry.repo?.name || entry.selection.name}</strong></a>)}</nav>
      <section className="weekly-archive" id="weekly-archive"><h2>往期书架</h2><label htmlFor="weekly-issue-select">选择期刊</label><select id="weekly-issue-select" value={issue.id} onChange={event => onRouteChange({ view: "weekly", issue: event.target.value, anchor: "" })}>{issues.map(item => <option value={item.id} key={item.id}>第 {issueNumber(item)} 期 · {item.id} · {item.editorial.title}</option>)}</select>{issues.length === 1 ? <p>这是第一期。以后生成的期刊会留在这里，随时可以翻回。</p> : <p>共 {issues.length} 期，名单和编选依据保留，仓库解读使用最新资料。</p>}{older && <RouteLink className="text-link" route={{ view: "weekly" }} onChange={onRouteChange}>返回最近一期 <ArrowRight size={16}/></RouteLink>}</section>
      <details className="weekly-method"><summary>这期是怎么选出来的？</summary><p>规则选编，不是热度或质量排名。优先收藏满 90 天的仓库，最近八周入选过的先休息；同等条件按期号日期稳定打散。</p><p>主题导语与阅读问题人工维护。入选时要求仍在公开 Stars、未归档、有完整解读；最多三个同主题、两个不同领域。来源变化提示仍需留意。</p><dl><dt>名单生成</dt><dd>{formatDate(issue.generatedAt, { hour: "2-digit", minute: "2-digit" })}</dd><dt>编选所用事实</dt><dd>{formatDate(issue.factsCheckedAt, { hour: "2-digit", minute: "2-digit" })}</dd><dt>当前目录同步</dt><dd>{formatDate(catalog.checkedAt, { hour: "2-digit", minute: "2-digit" })}</dd></dl><p>当期名单固定。解读、来源状态和上游事实会继续更新；收藏日期不代表上次阅读时间。</p></details>
    </aside></div>
  </main>;
}
