import { ArrowUpRight } from "@phosphor-icons/react";
import { TopicLink } from "../components/TopicLink.jsx";
import { RepoLink } from "../components/RepoLink.jsx";

export function TopicsView({catalog,route,onRouteChange,onOpenRepo}) {
  const topics=(catalog.topics||[]).map(topic=>({...topic,entries:topic.entries.filter(entry=>!catalog.repositories.find(r=>r.repoId===entry.repoId)?.personalArchived)}));
  const selected=route.topic?topics.find(topic=>topic.id===route.topic):null;
  if(route.topic&&!selected)return <main className="topics-page"><h1>没有找到这个专题</h1><TopicLink onChange={onRouteChange}>浏览全部专题</TopicLink></main>;
  const visible=selected?[selected]:topics;
  return <main className="topics-page">
    {selected&&<TopicLink className="back-link" onChange={onRouteChange}>返回用途专题</TopicLink>}
    <header className="feed-heading"><div><p>从一件要做的事，找到合适的工具</p><h1>{selected?.title||"用途专题"}</h1></div><span>{selected?`${selected.entries.length} 个项目`:`${topics.length} 个专题`}</span></header>
    {visible.map((topic,index)=><section className="topic-section" key={topic.id}>
      <header><span className="section-kicker">{String(index+1).padStart(2,"0")} / 按用途比较</span>{!selected&&<h2><TopicLink topic={topic.id} onChange={onRouteChange}>{topic.title}<ArrowUpRight size={22}/></TopicLink></h2>}<p>{topic.description}</p></header>
      <div className="topic-projects">{topic.entries.map(entry=>{
        const repo=catalog.repositories.find(r=>r.repoId===entry.repoId);
        if(!repo)return null;
        return <article key={repo.repoId}><RepoLink repoId={repo.repoId} onOpen={onOpenRepo}><img src={repo.avatar} alt="" loading="lazy"/><div><h3>{repo.name}</h3><p>{entry.reason}</p><small>{repo.resourceType}{repo.archived?" · 上游已归档":""}{repo.sourceStatus==="missing"?" · 已退出公开 Stars":""}</small></div><ArrowUpRight size={18}/></RepoLink></article>;
      })}</div>
    </section>)}
    {!topics.length&&<p>专题尚未收录。</p>}
  </main>;
}
