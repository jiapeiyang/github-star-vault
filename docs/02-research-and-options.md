# 调研与方案比较

> 核验时间：2026-09-04
> 研究方法：纵向看 GitHub Stars 管理方式的演进，横向比较当前可用工具与技术路径。

> 实施说明：本文保留调研阶段的 Astro 推荐作为历史比较。方案 E React/Vite 原型完成后，正式实现已在 [`DEVELOPMENT_PLAN.md`](../DEVELOPMENT_PLAN.md) 中冻结为 React/Vite，避免重写。

## 1. GitHub 原生能力解决了什么

GitHub 原生 Stars 已经不是一条完全没有组织能力的列表。官方当前提供：

- 公开 Lists，可在个人 Stars 页展示；该能力仍标注为 public preview。
- 按最近收藏、最近活跃、Stars 数排序。
- 按语言和仓库类型筛选。
- 按仓库名或 Topic 搜索。

但官方文档也明确：Stars 页搜索只基于仓库名或 Topic，不支持其他 qualifier。它没有个人仓库级备注、学习阶段、个人价值判断和学习结论。这就是自建系统需要覆盖的空白。

GitHub Lists 可以作为轻量分类入口，但不应成为唯一数据源：它仍处于预览期，个人内容表达能力弱，且首版若加入双向同步，会立刻引入冲突与覆盖语义。

## 2. 从“列表生成器”到“个人知识系统”

这一类工具大致经历了三种形态：

1. **README 生成器**：定时获取 Stars，按语言或 Topics 生成 Awesome 风格列表。它们解决“看得见”，但没有解决“为什么收藏”和“接下来学什么”。
2. **个人管理应用**：增加标签、备注、搜索、同步和本地数据库，解决整理与检索，但通常是登录后的私人工作台，不以公开、版本化的网站为目标。
3. **AI 增强管理器**：自动摘要、分类、语义搜索和问答越来越常见。它们降低初次整理成本，也带来成本、错误分类、覆盖人工判断和长期维护等问题。

GitHub Star Vault 应吸收三类产品的有效部分，同时保持一个清晰边界：GitHub 提供事实，自动规则或 AI 提供建议，个人内容才是最终判断。

## 3. 现有方案横向比较

`pushed_at` 只作为维护活跃信号，不代表我们已经验证了产品所有功能。

| 方案 | 自动同步 | 分类与备注 | 展示形态 | 当前判断 |
|---|---|---|---|---|
| GitHub Stars + Lists | GitHub 原生即时 | 手动公开 Lists；无仓库级个人笔记 | GitHub Stars 页 | 保留为收藏入口，不能独立形成学习闭环 |
| [maguowei/starred](https://github.com/maguowei/starred) | 模板含 scheduled Actions | 按 language/topics 分组，无个人备注 | Awesome 风格 Markdown | 同步与 README 生成可借鉴；分类维度不足 |
| [abhijithvijayan/stargazed](https://github.com/abhijithvijayan/stargazed) | 可生成每日 Action | 主要按语言分组 | Markdown | 基线简单，但工具源码维护偏旧 |
| [Astral](https://github.com/astralapp/astral) | 拉取 Stars | 多标签、规则过滤、强搜索、notes | 私人 Web 管理台 | 交互值得借鉴，不是公开版本化目录站 |
| [GithubStarsManager](https://github.com/AmintaCCCP/GithubStarsManager) | 自动同步，可对接 Lists | AI 摘要、标签、分类、向量搜索 | Web、桌面、Docker | 能力最全也最复杂；不适合作为克制的 MVP 基线 |
| [Better GitHub Stars Manager](https://github.com/izumi0uu/better-github-stars-manager) | 浏览器内增量/全量同步 | 标签、收藏、私人笔记 | Chrome 扩展 | 本地优先与保留人工数据值得借鉴；不提供公开全量目录站 |
| [Starflow](https://github.com/GEMILUXVII/starflow) | 声称双向/实时同步 | Lists、AI 分类、notes | Docker + PostgreSQL | 成熟度较低，调研时托管演示不可达 |
| [Starcat](https://github.com/starcat-app/Starcat) | OAuth 增量同步 | 标签、集合、notes、阅读状态、语义搜索 | macOS 原生应用 | 学习状态与本地搜索值得借鉴；功能与平台都偏重 |
| [github-stars-dashboard](https://github.com/Nezteb/github-stars-dashboard) | Node 脚本生成 JSON | 搜索/筛选，无人工 taxonomy | React + GitHub Pages | 证明纯静态目录可行；源码较旧，不建议直接 fork |
| [Star History](https://github.com/star-history/star-history) | 查询指定仓库 Star 变化 | 不管理个人收藏 | 趋势图与嵌入卡片 | 只适合作为未来详情页增强，不解决本问题 |

调研没有找到一个现成项目同时完整满足：

- Git 仓库是可审阅的事实源。
- 持续同步个人 Stars。
- 人工分类与备注永不被生成器覆盖。
- 对外发布静态网站。
- 用学习阶段推动收藏进入行动。

因此更合适的路径是组合成熟模式，而不是直接 fork 一个功能很重的管理器。

## 4. 同步方案比较

### 4.1 REST 全量对账 - 推荐

使用：

```http
GET /users/jiapeiyang/starred?sort=created&direction=desc&per_page=100
Accept: application/vnd.github.star+json
X-GitHub-Api-Version: 2026-03-10
```

当前 283 个 Stars 只需 3 个顺序请求。每次完整读取当前集合，再用数字 `repo.id` 与上次集合比较，能够同时发现新增、仓库改名和“不再出现在公开 Stars 中”的记录。

公开端点无需个人 PAT。GitHub Actions 中可以使用仓库自带 `GITHUB_TOKEN` 提高配额；只有未来需要读取私有 Stars 或私有 Profile 时才考虑用户授权。

### 4.2 只取第一页的增量游标 - 不选

按 `starred_at` 读取第一页很容易发现新 Star，却无法发现旧仓库被取消 Star。若再补充每日全量，就形成两套同步语义。当前三页数据没有这种复杂度的必要。

### 4.3 Events API - 不选

公开事件存在数量、保留期和延迟限制，`WatchEvent` 只表达新增 Star，没有取消 Star 事件，不能作为权威数据源。

### 4.4 Webhook - 不选

仓库级 `star` webhook 通知的是“有人收藏了这个仓库”。个人管理仓库无法通过它监听自己在全 GitHub 对其他仓库的 Star 操作。

### 4.5 GraphQL - 暂不选

GraphQL 能精确选择字段，但必须认证，还需要处理连接分页、点数和 `StarredRepositoryConnection.isOverLimit`。REST 一次列表响应已包含网站需要的大部分字段，当前规模没有足够理由增加复杂度。

## 5. “实时”的可实现定义

GitHub Actions 的 `schedule` 最短可到 5 分钟，但官方不保证准点执行；高负载时会延迟，公共仓库连续 60 天无活动时 scheduled workflow 还会被自动禁用。

建议 SLO：

- 每 6 小时检查一次，cron 放在第 17 分钟避开整点高峰。
- `workflow_dispatch` 支持手动立即同步。
- 页面同时展示“最近成功检查时间”和 Git 数据版本。
- 新 Star 在下一次成功同步后出现，最大目标延迟为 6 小时，不承诺计划时间即执行时间。

若真实使用证明 6 小时太慢，只需改为每小时。当前每轮 3 个请求，配额仍非常宽松。

## 6. 数据存储比较

| 方案 | 优点 | 代价 | 判断 |
|---|---|---|---|
| Git JSON + Markdown | 可 diff、审阅、恢复，直接静态构建 | 手工编辑不如管理台直观 | 推荐 |
| 每个仓库一个生成 Markdown | 单仓库页面直观 | 283 个文件起步，生成噪声大 | 只给真正有长笔记的项目建文件 |
| SQLite 提交到 Git | 查询强 | 二进制 diff 与合并差 | 不选 |
| Supabase、D1 等数据库 | 在线编辑、多用户方便 | 凭证、备份、运行时和成本 | 有在线编辑需求后再评估 |
| GitHub Issues/Projects | 现成界面 | 字段约束、批量同步、静态构建复杂 | 不选 |

## 7. 网站方案比较

| 方案 | 优点 | 局限 | 判断 |
|---|---|---|---|
| README + 生成 Markdown | 最快，无前端运行时 | 组合筛选、个人备注搜索和详情体验弱 | 作为第一阶段输出保留 |
| Astro + GitHub Pages | 默认构建期预渲染，适合目录与详情页；少量客户端 JS 即可筛选 | 比纯 README 多一个前端工程 | 推荐 |
| Vite + React SPA | 交互直接，静态部署成熟 | 首屏 JS/JSON 更重，详情页和 SEO 较弱 | 可行备选 |
| Jekyll/Hugo/Docusaurus | Markdown 生态成熟 | 多维仓库目录不是最自然的产品形态 | 不选 |

Astro 只负责视图。数据契约和同步脚本不依赖 Astro，未来更换前端不会重做知识库。

283 条记录可直接在客户端对紧凑 JSON 做搜索与组合筛选，无需首版引入 Pagefind、Algolia、向量数据库或服务端搜索。详情页增长到数千并出现全文笔记检索需求后，再评估 Pagefind。

## 8. 推荐组合

```text
GitHub REST public Stars
        ↓ 每 6 小时全量对账
data/github-stars.json        content/curation/*.md
        ↓ GitHub 事实                 ↓ 个人判断
        └────────── 构建时合并 ───────┘
                         ↓
              README + Astro 静态站
                         ↓
                   GitHub Pages
```

这个组合保持四个关键性质：

- 收藏入口不变。
- 自动数据与人工内容分离。
- 网站只是数据视图。
- 所有重要变化能在 Git 中审阅和恢复。

## 9. 与现有 github-ai-radar 的关系

`github-ai-radar` 解决“从 GitHub 主动发现值得关注的新项目”，GitHub Star Vault 解决“管理我已经明确收藏的项目”。两者输入、触发和成功指标不同，不应直接合并。

可以复用它的经验：每次自动化运行生成当前 run manifest，并在提交或发布前验证数据完整性与新鲜度。未来若需要，Radar 推荐的项目可以链接到 Star Vault；在有真实跨项目需求前，不建立共享框架。

## 10. 来源

官方资料：

- [GitHub: Saving repositories with stars](https://docs.github.com/en/get-started/exploring-projects-on-github/saving-repositories-with-stars)
- [REST API endpoints for starring](https://docs.github.com/en/rest/activity/starring?apiVersion=2026-03-10#list-repositories-starred-by-a-user)
- [REST API rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
- [REST API best practices](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api#use-conditional-requests)
- [GraphQL Users reference](https://docs.github.com/en/graphql/reference/users)
- [GraphQL StarredRepositoryConnection](https://docs.github.com/en/graphql/reference/repos#starredrepositoryconnection)
- [GitHub Actions schedule](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)
- [When GITHUB_TOKEN triggers workflow runs](https://docs.github.com/en/actions/concepts/security/github_token#when-github_token-triggers-workflow-runs)
- [GitHub star webhook](https://docs.github.com/en/webhooks/webhook-events-and-payloads#star)
- [GitHub Events API](https://docs.github.com/en/rest/activity/events#list-public-events-for-a-user)
- [Astro: Deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [Astro: On-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/)
- [Pagefind documentation](https://pagefind.app/docs/)
- [Vite: Deploying a static site](https://vite.dev/guide/static-deploy.html)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

项目资料见上方比较表，均于 2026-09-04 核验仓库或官网可访问性。
