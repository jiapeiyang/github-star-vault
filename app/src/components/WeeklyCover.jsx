import { ArrowRight } from "@phosphor-icons/react";
import { RouteLink } from "./RouteLink.jsx";
import { issueEntries, issueNumber, issuePeriod } from "../domain/weekly.js";

export function WeeklyCover({ issue, repositories, onChange }) {
  if (!issue) return null;
  const lead = issueEntries(issue, repositories)[0];
  return <section className="weekly-home-cover" aria-label="每周收藏特刊">
    <div className="weekly-home-edition"><span>每周收藏特刊</span><strong>{issueNumber(issue)}</strong><time>{issuePeriod(issue)}</time></div>
    <div className="weekly-home-story"><span className="section-kicker">从收藏，到重新读懂</span><h2>{issue.editorial.title}</h2><p>{issue.editorial.intro}</p><RouteLink className="weekly-primary-link" route={{ view: "weekly", issue: issue.id }} onChange={onChange}>打开本期 <ArrowRight size={18}/></RouteLink></div>
    <div className="weekly-home-lead">{lead.repo && <img src={lead.repo.avatar} alt="" loading="lazy"/>}<small>本期主读</small><strong>{lead.repo?.name || lead.selection.name}</strong><span>{issue.entries.length} 个收藏，慢慢重读</span></div>
  </section>;
}
