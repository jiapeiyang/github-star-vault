import { ArrowRight, ArrowUpRight, Clock, GitFork, LineVertical, Shuffle, Star } from "@phosphor-icons/react";
import { assetUrl, formatCount, formatDate } from "../domain/catalog.js";

function CategoryRail({ categories, repositories, checkedAt, onOpenLibrary }) {
  const years = Object.entries(repositories.reduce((counts, repo) => {
    if (repo.sourceStatus === "starred") {
      const year = new Date(repo.starredAt).getFullYear();
      counts[year] = (counts[year] || 0) + 1;
    }
    return counts;
  }, {})).sort(([, leftCount], [, rightCount]) => rightCount - leftCount).slice(0, 2);
  return <aside className="home-category-rail" aria-label="领域分类">
    <div className="rail-heading"><h2>领域分类</h2><ArrowRight size={23} aria-hidden="true" /></div>
    <div className="rail-categories">{categories.filter((item) => item.id !== "unclassified").map((category) => <button type="button" key={category.id} onClick={() => onOpenLibrary({ category: category.id })}><span>{category.label}</span><ArrowRight size={16} aria-hidden="true" /></button>)}</div>
    <button className="rail-all" type="button" onClick={() => onOpenLibrary()}>查看全部分类 <ArrowRight size={17} aria-hidden="true" /></button>
    <div className="timeline-mini" id="timeline"><h3>收藏时间线</h3>{years.map(([year, count]) => <div key={year}><strong>{year}</strong><span>{count} 个收藏<br />按真实 starred_at 统计</span></div>)}<p>最近成功检查：{formatDate(checkedAt)}</p></div>
  </aside>;
}

function RepoMeta({ repo }) {
  return <div className="repo-meta-line"><span>{repo.language}</span><span><Star weight="fill" size={13} />{formatCount(repo.stars)}</span><span><GitFork size={13} />{formatCount(repo.forks)}</span><span><Clock size={13} />{formatDate(repo.pushedAt)}</span></div>;
}

export function HomeView({ catalog, onOpenRepo, onOpenLibrary, onNavigate }) {
  const repositories = catalog.repositories.filter((repo) => repo.sourceStatus === "starred" && !repo.personalArchived);
  const curated = repositories.filter((repo) => repo.category !== "unclassified");
  const featuredRepo = repositories.find((repo) => repo.name === "anthropics/skills") || curated[0] || repositories[0];
  const interests = [
    ...repositories.filter((repo) => repo.stage === "learning"),
    ...repositories.filter((repo) => repo.stage === "queued"),
    ...repositories.filter((repo) => repo.category !== "unclassified"),
  ].filter((repo, index, values) => values.findIndex((item) => item.repoId === repo.repoId) === index).slice(0, 3);
  const learning = repositories.find((repo) => repo.stage === "learning");
  const learned = repositories.find((repo) => repo.stage === "learned");
  const inbox = repositories.filter((repo) => repo.stage === "inbox");
  const revisitPool = repositories.filter((repo) => !["inbox", "learning"].includes(repo.stage));
  const randomRepo = revisitPool[(new Date(catalog.checkedAt).getUTCDate() + revisitPool.length) % revisitPool.length];
  if (!featuredRepo) return null;

  return <main className="home-page"><div className="home-magazine-grid">
    <section className="cover-intro"><p className="issue-label">个人 GitHub 项目策展</p><h1>值得重访的<br />开源项目</h1><div className="cover-stats"><span><strong>{catalog.stats.active}</strong>公开 Stars</span><span><strong>{catalog.stats.curated}</strong>已整理</span><span><strong>{repositories.filter((repo) => repo.stage === "queued").length}</strong>待学习</span></div></section>
    <aside className="cover-manifesto"><LineVertical className="magenta-slash" size={34} weight="bold" aria-hidden="true" /><p>长期主义者的代码收藏夹<br />持续发现，认真沉淀，定期重访</p><strong>UPDATED EVERY 6 HOURS</strong><small>最近成功检查 · {formatDate(catalog.checkedAt)}</small></aside>
    <CategoryRail categories={catalog.categories} repositories={repositories} checkedAt={catalog.checkedAt} onOpenLibrary={onOpenLibrary} />
    <article className="featured-copy"><span className="section-kicker">本期精选</span><h2>{featuredRepo.name}</h2><p>{featuredRepo.editorialSummary}</p><RepoMeta repo={featuredRepo} /><button className="editor-note" type="button" onClick={() => onOpenRepo(featuredRepo)}><img src={assetUrl("assets/avatars/jiapeiyang.webp")} alt="jiapeiyang" /><span><strong>{featuredRepo.note ? "个人判断" : "GitHub 事实"}</strong>{featuredRepo.note || "尚未人工整理，先查看官方描述与元数据。"}</span><ArrowUpRight size={19} aria-hidden="true" /></button></article>
    <button className="featured-visual" type="button" onClick={() => onOpenRepo(featuredRepo)} aria-label={`查看 ${featuredRepo.name}`}><img src={assetUrl("assets/feature-a.webp")} fetchPriority="high" alt="黑色背景上的白色字母 A 与洋红色斜线" /></button>
    <section className="current-interest" id="current-interest"><div className="interest-title"><span>当前关注</span><small>CURRENT INTEREST</small></div>{interests.map((repo) => <button className="interest-story" type="button" key={repo.repoId} onClick={() => onOpenRepo(repo)}><div className="interest-story-title"><img src={repo.avatar} alt="" /><div><h3>{repo.name}</h3><span>{repo.categoryLabel}</span></div></div><p>{repo.note || repo.description}</p><RepoMeta repo={repo} /><span className="story-action">阅读条目 <ArrowUpRight size={16} /></span></button>)}</section>
    <section className="home-action-strip" aria-label="本周行动"><div className="action-strip-title"><span>本周行动</span><small>READ · SORT · RETURN</small></div>
      <button type="button" onClick={() => learning && onOpenRepo(learning)}><small>继续学习</small><strong>{learning?.name || "暂无学习中项目"}</strong><span>{learning?.takeaway || "从待学习列表选择一个项目开始。"}</span><ArrowUpRight size={18} /></button>
      <button type="button" onClick={() => onNavigate("inbox")}><small>新收藏收件箱</small><strong>{inbox.length} 个待整理</strong><span>{inbox[0]?.name || "最近同步没有新增项目"}</span><ArrowRight size={18} /></button>
      <button type="button" onClick={() => learned && onOpenRepo(learned)}><small>最近学习记录</small><strong>{learned?.name || "暂无记录"}</strong><span>{learned?.takeaway || "完成学习后在策展文件中留下结论。"}</span><ArrowUpRight size={18} /></button>
      <button type="button" onClick={() => randomRepo && onOpenRepo(randomRepo)}><small>随机重访</small><strong>{randomRepo?.name}</strong><span>从旧收藏中重新发现一个项目</span><Shuffle size={18} /></button>
    </section>
  </div></main>;
}
