import { ArrowsClockwise, GithubLogo, PencilSimple, ShieldCheck } from "@phosphor-icons/react";
import { formatDate } from "../domain/catalog.js";

export function AboutView({ catalog }) {
  return <main className="about-page"><header className="about-hero"><p>ABOUT · DATA · METHOD</p><h1>收藏只是入口，<br />判断才是资产。</h1><div><strong>Star Vault</strong><span>一个以 GitHub Stars 为入口、以个人判断为核心、以学习行动为结果的版本化开源项目知识库。</span></div></header>
    <section className="provenance-grid"><article><GithubLogo size={26} /><span>01</span><h2>GitHub 事实</h2><p>仓库名称、描述、语言、Topics、Stars、Forks、Issues、归档状态与更新时间。</p><small>自动同步 · 不由人工改写</small></article><article><ArrowsClockwise size={26} /><span>02</span><h2>自动建议</h2><p>MVP 不生成自动分类。未来如果启用，建议必须和人工确认结果分开保存。</p><small>当前关闭 · 不作为依赖</small></article><article><PencilSimple size={26} /><span>03</span><h2>个人内容</h2><p>一句话价值、学习阶段、个人标签、学习结论和实践记录，通过 Git 文件版本化。</p><small>人工维护 · 同步不覆盖</small></article></section>
    <div className="about-columns"><section><h2>状态怎么流转</h2><ol><li><strong>新收藏</strong><span>同步后进入收件箱</span></li><li><strong>待学习 / 仅参考</strong><span>完成最低成本整理</span></li><li><strong>学习中</strong><span>阅读、运行或实际试用</span></li><li><strong>已学习</strong><span>至少留下一条个人结论</span></li></ol></section><section><h2>当前数据快照</h2><dl><div><dt>当前公开 Stars</dt><dd>{catalog.stats.active}</dd></div><div><dt>已人工整理</dt><dd>{catalog.stats.curated}</dd></div><div><dt>上游已归档</dt><dd>{catalog.stats.githubArchived}</dd></div><div><dt>最近成功检查</dt><dd>{formatDate(catalog.checkedAt)}</dd></div><div><dt>同步频率</dt><dd>每 6 小时</dd></div></dl></section><aside><ShieldCheck size={26} /><h2>公开边界</h2><p>网站只读，不包含账号、评论、私有仓库和内部信息。个人注释默认公开，敏感内容不进入仓库、日志或构建产物。</p></aside></div>
  </main>;
}
