import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
import { CandidateButton } from "../components/CandidateButton.jsx";
import { RepoLink } from "../components/RepoLink.jsx";
import { RouteLink } from "../components/RouteLink.jsx";
import { SourceNotice } from "../components/SourceNotice.jsx";
import { TopicNavigation } from "../components/TopicNavigation.jsx";
import { recipeTools } from "../domain/recipes.js";

function Lines({ values }) {
  return <ul>{values.map((value, i) => <li key={i}>{value}</li>)}</ul>;
}

function RecipeTool({ tool, basket, onOpenRepo }) {
  const { repo } = tool;
  return <article className="recipe-tool">
    <header><img src={repo.avatar} alt="" loading="lazy" /><div><span>{tool.role}</span><h3><RepoLink repoId={repo.repoId} onOpen={onOpenRepo}>{repo.name}</RepoLink></h3></div></header>
    <p>{tool.reason}</p>
    <dl className="recipe-tool-details"><div><dt>使用前提</dt><dd><Lines values={tool.requirements} /></dd></div><div><dt>限制与未知</dt><dd><Lines values={tool.limitations} /></dd></div></dl>
    <p className="recipe-tool-meta">{!repo.hasGuide ? "待补解读" : repo.guideStatus === "limited" ? "资料受限" : "完整解读"} · 仓库资料核查 {repo.reviewedAt || "未记录"}{repo.archived && " · 上游归档"}{repo.sourceStatus === "missing" && " · 已退出公开 Stars"}</p>
    <SourceNotice repo={repo} />
    <div className="recipe-tool-actions"><RepoLink repoId={repo.repoId} onOpen={onOpenRepo}>查看解读 <ArrowUpRight size={16} /></RepoLink><a href={tool.entryUrl} target="_blank" rel="noreferrer">官方入口 <ArrowUpRight size={16} /></a><CandidateButton repo={repo} basket={basket} /></div>
    <details className="recipe-tool-sources"><summary>这项选择的资料依据</summary><ul>{tool.sources.map((url, i) => <li key={url}><a href={url} target="_blank" rel="noreferrer">来源 {i + 1} · 查看原文</a></li>)}</ul></details>
  </article>;
}

export function RecipesView({ catalog, recipes, error, route, onRouteChange, onOpenRepo, basket }) {
  const selected = recipes.find(recipe => recipe.id === route.recipe);
  const directoryLink = <RouteLink className="back-link" route={{ view: "recipes" }} onChange={onRouteChange}><ArrowLeft size={16} />返回任务配方</RouteLink>;
  if (error) return <main className="recipes-page"><TopicNavigation view="recipes" onChange={onRouteChange} /><h1>任务配方暂不可用</h1><p role="alert">{error}</p><RouteLink route={{ view: "library" }} onChange={onRouteChange}>浏览项目库</RouteLink></main>;
  if (route.recipe && !selected) return <main className="recipes-page">{directoryLink}<h1>没有找到这条任务配方</h1><p>检查地址，或返回目录挑选一条任务。</p></main>;
  return <main className="recipes-page">
    <TopicNavigation view="recipes" onChange={onRouteChange} />
    {selected ? <>
      {directoryLink}
      <header className="recipe-cover"><span className="section-kicker">TASK RECIPE / 任务配方</span><h1>{selected.title}</h1><p>{selected.summary}</p><small>公开资料归纳，组合未实测 · 配方核查于 {selected.reviewedAt}</small></header>
      <div className="recipe-intro"><section><h2>需要准备</h2><Lines values={selected.inputs} /></section><section><h2>最后得到</h2><Lines values={selected.outputs} /></section></div>
      <div className="recipe-requirements"><strong>开始之前</strong><Lines values={selected.requirements} /></div>
      <div className="recipe-layout"><div className="recipe-steps">
        {selected.steps.map((step, index) => {
          const tools = recipeTools(step, selected, catalog.repositories);
          return <section className="recipe-step" id={`recipe-step-${step.id}`} key={step.id}>
            <header><span>{String(index + 1).padStart(2, "0")}</span><div>{step.optional && <small>可选 · 不需要时可跳过</small>}<h2>{step.title}</h2></div></header>
            <dl className="recipe-step-details"><div><dt>输入</dt><dd><Lines values={step.inputs} /></dd></div><div><dt>动作</dt><dd><Lines values={step.actions} /></dd></div><div><dt>产出</dt><dd><Lines values={step.outputs} /></dd></div><div><dt>检查点</dt><dd><Lines values={step.checks} /></dd></div></dl>
            {tools.map(tool => <RecipeTool key={tool.repoId} tool={tool} basket={basket} onOpenRepo={onOpenRepo} />)}
            {step.toolIds.length > 0 && !tools.length && <p className="recipe-empty">暂无可展示候选。已保留本步骤；个人归档项目仍可从项目库的显式归档入口查看。</p>}
          </section>;
        })}
      </div><aside className="recipe-sidebar"><nav aria-label="配方步骤"><strong>阅读顺序</strong>{selected.steps.map((step, index) => <RouteLink key={step.id} route={{ view: "recipes", recipe: selected.id, anchor: `recipe-step-${step.id}` }} onChange={onRouteChange}><span>{String(index + 1).padStart(2, "0")}</span>{step.title}</RouteLink>)}</nav><p>顺序用于理解任务。加入候选只表示想继续比较，不代表已采用或执行。</p><RouteLink className="recipe-basket-link" route={{ view: "basket" }} onChange={onRouteChange}>查看候选 {basket.repoIds.length} <ArrowUpRight size={18} /></RouteLink>{selected.topicIds.map(id => <RouteLink key={id} route={{ view: "topics", topic: id }} onChange={onRouteChange}>继续阅读相关专题 <ArrowUpRight size={16} /></RouteLink>)}</aside></div>
      <footer className="recipe-sources"><h2>配方资料来源</h2><p>配方作者根据以下公开资料整理顺序；单个仓库的核查日期与 README 观察状态另外展示。</p><ul>{selected.sources.map((url, i) => <li key={url}><a href={url} target="_blank" rel="noreferrer">来源 {i + 1} · 查看原文</a></li>)}</ul></footer>
    </> : <>
      <header className="feed-heading"><div><p>围绕一个目标，串起收藏中的工具</p><h1>任务配方</h1></div><span>{recipes.length} 条路线</span></header>
      <p className="recipe-directory-intro">先读步骤与前提，再挑候选。每条路线都区分工具分工、预期产出和还没验证的部分。</p>
      <div className="recipe-directory">{recipes.map((recipe, index) => <article key={recipe.id}><span className="recipe-number">{String(index + 1).padStart(2, "0")}</span><div><h2><RouteLink route={{ view: "recipes", recipe: recipe.id }} onChange={onRouteChange}>{recipe.title}<ArrowUpRight size={24} /></RouteLink></h2><p>{recipe.summary}</p><dl><div><dt>准备</dt><dd>{recipe.inputs.join("；")}</dd></div><div><dt>产出</dt><dd>{recipe.outputs.join("；")}</dd></div></dl><small>{recipe.steps.length} 步 · 公开资料归纳，组合未实测 · 核查于 {recipe.reviewedAt}</small></div></article>)}</div>
      {!recipes.length && <p>尚未收录任务配方，可以先浏览项目库。</p>}
    </>}
  </main>;
}
