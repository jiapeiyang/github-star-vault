# GitHub Star Vault MVP 开发计划

> 版本：v1.0
> 制定日期：2026-09-05
> 适用范围：从已确认的方案 E 原型推进到可持续同步、可人工策展、可公开访问的 MVP
> 文档优先级：本计划与 `docs/03-architecture-and-data-model.md`、`docs/04-roadmap-and-acceptance.md` 冲突时，以本计划为准

## 1. 交付目标

MVP 要完成一条真实可运行的主链路：

```text
在 GitHub Star
→ 最迟在下一次成功同步后进入 Star Vault
→ 新项目进入 inbox，历史库存进入 imported
→ 通过 Git 文件补充个人分类、判断和学习记录
→ 自动生成 README 索引和网站数据
→ 公开网站可以搜索、筛选、阅读和回顾
→ GitHub Pages 保持最近一次成功构建的版本
```

完成后，仓库不是一套静态设计稿，而是个人 GitHub Stars 的版本化知识库。当前方案 E 原型继续作为视觉和交互基线。

## 2. 已冻结的产品与技术决策

| 项目 | v1 决策 | 原因 |
|---|---|---|
| 产品名称 | `github-star-vault` / Star Vault | 与现有目录和产品定义一致 |
| 仓库可见性 | Public | 数据来源是公开 Stars，目标包含公开展示 |
| 站点可见性 | Public | 不引入登录和权限系统 |
| 站点框架 | React 19 + Vite 6 | 当前原型已验证，继续使用可避免 Astro 重写 |
| 部署 | GitHub Pages | 无服务器、无数据库，与 Git 仓库同源 |
| 主语言 | 中文 | 仓库名、命令和技术术语保留原文 |
| 同步方式 | GitHub REST 全量对账 | 当前规模约 283 条，动态分页简单且能发现退出公开 Stars 的项目 |
| 同步时效 | 每 6 小时 + 手动触发 | 满足持续更新，同时避免秒级同步的额外服务 |
| 同步实现 | Python 3 标准库 | 无需为少量 HTTP、JSON 和文件操作引入依赖 |
| GitHub 事实 | `data/repositories.json` | 由同步脚本独占写入 |
| 人工内容 | `content/repos/<repo_id>.md` | 只为真正整理过的项目创建文件 |
| 策展元数据 | TOML frontmatter | Python `tomllib` 可解析，不引入 YAML 依赖 |
| 长笔记 | Markdown 正文 | 适合逐步补充学习结论和实践记录 |
| 公共网站 | 只读 | 不在 MVP 中引入数据库、鉴权和写入 API |
| 原型整理表单 | 改为策展模板生成器 | 可生成并复制 Markdown，但不能假装已经持久化 |
| AI | 不作为 MVP 依赖 | 首先验证整理和找回习惯，机器结果不能覆盖人工判断 |

正式推送远程仓库前，唯一允许重新打开的产品决策是“个人备注是否默认公开”。如果改为私有，数据目录和部署边界必须重新设计，不能只在 UI 隐藏。

### 2.1 依赖政策

- Python 同步、校验和生成脚本只使用标准库。
- 前端沿用当前 React、Vite 和 Phosphor，不为状态、请求或搜索增加新依赖。
- Python 测试使用 `unittest`，纯前端领域函数使用 Node `node:test`。
- 不为 UI 单元测试新建 jsdom 或 Testing Library 基础设施；核心用户旅程通过构建后的浏览器验收覆盖。
- 后续只有出现标准库或现有依赖无法满足的明确需求时，才新增第三方包，并在对应 PR 说明原因。

## 3. MVP 边界

### 3.1 必须完成

- 导入全部公开 Stars，不写死页数。
- 保存 `starred_at`，按数字 `repo_id` 去重并处理改名或 owner 转移。
- 区分当前仍在 Stars、已退出公开 Stars、上游归档和个人归档。
- 首次导入默认进入 `imported`，上线后新增默认进入 `inbox`。
- GitHub 事实与人工内容分文件、分字段维护。
- 支持人工分类、资源类型、学习阶段、最多 5 个标签、一句话价值和学习结论。
- `learned` 必须至少有一条非空学习结论。
- 自动生成 README 中的分类和阶段索引。
- 将方案 E 原型接入完整真实数据。
- 完成搜索、组合筛选、排序、URL 状态、详情、收件箱、学习页和关于页。
- 每 6 小时自动同步，支持 `workflow_dispatch` 手动触发。
- 构建并发布 GitHub Pages，展示最近成功检查时间和数据 commit。

### 3.2 本阶段明确不做

- 私有 Stars、私人笔记层和多套发布权限。
- 登录、注册、评论、多用户协作和在线编辑后台。
- AI 自动分类、自动摘要、语义搜索和自然语言问答。
- 浏览器扩展、Webhook 或秒级同步。
- 数据库、消息队列、搜索服务和服务端 API。
- 全量抓取仓库 README、Release 或源码。
- 间隔重复算法、推荐流和社交功能。

## 4. 目标目录结构

实施开始时，将已验证的 `prototype/` 重命名为 `app/`，作为正式网站基础，不新建第二套前端。

```text
github-star-vault/
├── .github/
│   └── workflows/
│       └── site.yml
├── app/
│   ├── public/
│   │   ├── assets/
│   │   └── data/
│   │       ├── catalog.json          # 生成文件，禁止手改
│   │       └── build-meta.json       # 生成文件，禁止手改
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── domain/
│   │   │   ├── catalog.js
│   │   │   ├── filters.js
│   │   │   └── routing.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tests/
│   ├── package.json
│   └── vite.config.mjs
├── config/
│   ├── project.json
│   ├── categories.json
│   ├── resource-types.json
│   └── stages.json
├── content/
│   └── repos/
│       └── <repo_id>.md
├── data/
│   └── repositories.json
├── scripts/
│   ├── sync_stars.py
│   ├── verify_data.py
│   ├── build_catalog.py
│   └── generate_readme.py
├── tests/
│   ├── fixtures/
│   │   └── github/
│   └── test_*.py
├── design-directions/
├── docs/
├── DEVELOPMENT_PLAN.md
└── README.md
```

### 4.1 文件职责

| 路径 | 所有者 | 是否允许人工编辑 |
|---|---|---|
| `data/repositories.json` | `sync_stars.py` | 否 |
| `content/repos/*.md` | 用户 | 是 |
| `config/*.json` | 用户/产品定义 | 是 |
| `app/public/data/*.json` | `build_catalog.py` | 否 |
| README 自动索引区 | `generate_readme.py` | 否 |
| README 其他区域 | 用户 | 是 |
| `app/src/` | 前端实现 | 是，但不保存事实或个人笔记 |

同步脚本只能写入 `data/repositories.json`。它不能扫描、格式化或重写 `content/`。

`app/public/data/*.json` 是构建期产物，加入 `.gitignore`，不提交到仓库。它们必须由本次构建从已提交的数据和内容重新生成，避免生成文件与自身 commit hash 形成循环依赖。

## 5. 数据契约

### 5.1 GitHub 事实文件

`data/repositories.json` 的 v1 结构：

```json
{
  "schema_version": 1,
  "github_username": "jiapeiyang",
  "sync": {
    "checked_at": "2026-09-05T10:00:00Z",
    "api_version": "当前受支持版本",
    "active_count": 283
  },
  "repositories": [
    {
      "repo_id": 1119232564,
      "node_id": "R_kgDO...",
      "full_name": "owner/repository",
      "owner": "owner",
      "url": "https://github.com/owner/repository",
      "description": null,
      "homepage": null,
      "language": null,
      "topics": [],
      "license_spdx": null,
      "stargazers_count": 0,
      "forks_count": 0,
      "open_issues_count": 0,
      "fork": false,
      "github_archived": false,
      "visibility": "public",
      "starred_at": "2026-09-04T12:54:28Z",
      "pushed_at": "2026-09-04T12:00:00Z",
      "updated_at": "2026-09-04T12:00:00Z",
      "source_status": "starred",
      "discovered_in_initial_import": true,
      "first_seen_at": "2026-09-05T10:00:00Z",
      "last_seen_at": "2026-09-05T10:00:00Z",
      "missing_detected_at": null
    }
  ]
}
```

约束：

- `repo_id` 是唯一主键，`full_name` 可变化。
- `source_status` 只有 `starred` 和 `missing`。
- `missing` 表示“不再出现在当前公开 Stars 中”，不能断言用户主动取消 Star。
- `missing_detected_at` 是系统发现时间，不是实际取消时间。
- `discovered_in_initial_import` 一旦写入不再变化；重新 Star 也保留原值。
- `repositories` 按 `source_status`、`starred_at desc`、`repo_id` 稳定排序。
- 只保存网站和 README 使用的字段，不保存完整 API 响应。

### 5.2 人工策展文件

`content/repos/<repo_id>.md` 使用 TOML frontmatter：

```markdown
+++
repo_id = 1119232564
category = "ai-agent"
resource_type = "collection"
stage = "queued"
tags = ["Agent Skills", "中文资源"]
note = "用于对照不同平台的 Skill 规范和组织方式。"
related = []
updated_by_user_at = "2026-09-05"
+++

## 学习结论

- 待实际使用后补充。

## 实践记录

<!-- 可选：链接、命令或过程记录。 -->
```

约束：

- 文件名必须与 `repo_id` 一致。
- 每个仓库最多一份人工文件。
- `category`、`resource_type` 和 `stage` 必须来自配置枚举。
- `tags` 最多 5 个，不重复保存语言字段。
- `note` 必填，控制在一两句话内。
- `stage = "learned"` 时，“学习结论”必须包含非占位内容。
- `related` 只保存 `repo_id`，构建时验证目标存在。
- Markdown 中的外链只允许 `http` 或 `https`。

### 5.3 默认阶段推导

```text
存在人工策展文件
  → 使用人工 stage

不存在人工策展文件，source_status = missing
  → 默认列表隐藏，详情和历史筛选中可见

不存在人工策展文件，discovered_in_initial_import = true
  → imported

不存在人工策展文件，discovered_in_initial_import = false
  → inbox
```

上游 `github_archived = true` 与个人 `stage = archived` 必须分别展示。

### 5.4 前端目录数据

`build_catalog.py` 合并事实、人工内容和枚举配置，生成：

- `app/public/data/catalog.json`：页面使用的完整只读目录。
- `app/public/data/build-meta.json`：检查时间、数据 commit、数量和 Schema 版本。

前端使用 `import.meta.env.BASE_URL + "data/catalog.json"` 加载，兼容本地根路径和 GitHub Pages 仓库子路径。

## 6. 同步生命周期与失败语义

### 6.1 正常流程

```text
读取旧快照
→ 顺序读取 GitHub 所有分页
→ 在内存中规范化字段
→ 按 repo_id 与旧快照对账
→ 运行 Schema、唯一性、可见性和数量校验
→ 写入同目录临时文件
→ 原子替换 data/repositories.json
→ 输出 added / kept / missing / renamed 摘要
```

GitHub 请求：

- `GET /users/{username}/starred?sort=created&direction=desc&per_page=100`
- `Accept: application/vnd.github.star+json`
- API 版本从 `config/project.json` 读取，禁止散落在多个文件。
- 跟随 `Link` header 读取下一页，不能假设永远只有 3 页。
- `GITHUB_TOKEN` 可选；本地公开读取可以匿名，Actions 中使用仓库令牌提高配额。

### 6.2 明确失败语义

| 场景 | 行为 | 正式文件 | 部署 |
|---|---|---|---|
| 任意分页请求失败 | 退出非零 | 不修改 | 不部署 |
| 响应无法解析 | 退出非零 | 不修改 | 不部署 |
| `repo_id` 重复或字段非法 | 退出非零 | 不修改 | 不部署 |
| 旧活跃集合非空，新集合为 0 | 退出非零 | 不修改 | 不部署 |
| 人工内容校验失败 | 退出非零 | 工作树可能有未提交数据，仓库不更新 | 不部署 |
| 网站构建失败 | 退出非零 | 数据 commit 可以存在，当前 Pages 不替换 | 旧站继续服务 |
| 两个 workflow 同时提交冲突 | 当前运行失败 | 已发布数据不回滚 | 手动重跑 |
| 没有数据变化 | 成功退出 | 不制造 diff 或 commit | 构建可继续 |

有意清空数据时只允许人工运行 `sync_stars.py --allow-empty`。定时任务永远不传该参数。

### 6.3 防御机制三问

#### 分页完整后才替换

1. 坏什么：部分分页写入会把大量仓库误标为 missing，造成数据错乱。
2. 多久一次：频率未知。
3. 代价分级：A 级。

因此采用内存汇总、完整校验和同目录原子替换。

#### 非空集合突然变为零时拒绝发布

1. 坏什么：认证、Profile 可见性或 API 异常会清空整个项目库。
2. 多久一次：频率未知。
3. 代价分级：A 级。

因此默认失败，并提供只能人工显式使用的 `--allow-empty`。

#### 人工内容与生成内容物理隔离

1. 坏什么：同步或生成器覆盖个人笔记，无法从页面恢复。
2. 多久一次：频率未知。
3. 代价分级：A 级。

因此按目录和字段所有权隔离，并测试同步前后人工文件字节不变。

不为定时任务延迟、一次 push 冲突或 API 临时限流加入锁、重试队列和备用调度器。这些场景频率未知，旧站仍可用，代价为 B 级。

## 7. 开发里程碑

| 里程碑 | 重点 | 前置 | 参考投入 |
|---|---|---|---:|
| M0 | 工程基线和配置 | 无 | 0.5 天 |
| M1 | 全量同步和事实校验 | M0 | 1.5～2.5 天 |
| M2 | 人工策展、合并和 README | M1 | 1.5～2 天 |
| M3 | 方案 E 接入真实数据 | M2 | 2～3 天 |
| M4 | Actions 和 Pages | M1～M3 | 1 天 |
| M5 | 完整验收 | M4 | 0.5 天 + 两周观察 |

参考投入用于控制批次大小，不作为交付日期承诺。每个里程碑只有在自己的完成标准通过后才能进入下一阶段。

### Milestone 0：工程基线与决策落盘

目标：把原型提升为正式应用基础，建立不会互相覆盖的目录边界。

任务：

- [x] 将 `prototype/` 重命名为 `app/`，保持方案 E 页面和 QA 资产可追踪。
- [x] 更新根 README、应用 README 和所有本地路径引用。
- [x] 创建 `config/`、`content/repos/`、`data/`、`scripts/`、`tests/fixtures/github/`。
- [x] 写入四份 v1 枚举与项目配置。
- [x] 在 `.gitignore` 中忽略临时文件、构建目录、浏览器会话和本地令牌。
- [ ] 在 `app/src/generated` 或组件中删除 11 条演示数据的事实源地位；演示数据仅作为 fixture 保留。
- [ ] 配置 GitHub Pages 的 Vite `base`，仓库名变化时只修改一个配置值。

验收：

```bash
npm --prefix app ci
npm --prefix app run build
npm --prefix app run test:sites
```

完成标准：应用外观与当前原型一致；目录所有权写入 `AGENTS.md`；尚未接入真实数据时仍可用 fixture 启动。

### Milestone 1：数据契约、同步与验证

目标：安全导入完整公开 Stars，并能重复运行。

任务：

- [ ] 实现 `scripts/sync_stars.py` 的网络客户端、Link 分页和字段规范化。
- [ ] 支持 `--username`、`--output`、`--fixture-dir`、`--now`、`--allow-empty`。
- [ ] 实现首次导入、后续新增、保留、改名、missing 和重新 Star 对账。
- [ ] 实现临时文件写入与原子替换。
- [ ] 实现 `scripts/verify_data.py`。
- [ ] 保存多页、改名、missing、空集合和坏响应 fixtures。
- [ ] 使用固定时间参数保证 fixture 测试可重复。
- [ ] 运行一次真实全量导入并记录快照时间。

必须测试：

- [ ] 多页完整合并，页数动态变化。
- [ ] 第二页失败不修改旧文件。
- [ ] 旧集合非空而新集合为零时拒绝写入。
- [ ] 相同 `repo_id` 改名后仍为一条记录。
- [ ] 新项目被标记为非初始导入。
- [ ] 旧项目缺失时转为 `missing`，不被删除。
- [ ] 重新 Star 后恢复 `starred`，人工内容关联不变。
- [ ] fork 和上游 archived 只标记，不自动隐藏数据文件。
- [ ] 相同输入重复运行不产生字节差异。
- [ ] 所有 `source_status=starred` 的记录都是 public。

验收命令：

```bash
python3 -m unittest discover -s tests -p 'test_*.py'
python3 scripts/sync_stars.py --username jiapeiyang
python3 scripts/verify_data.py data/repositories.json
python3 scripts/sync_stars.py --username jiapeiyang --fixture-dir tests/fixtures/github/stable
git diff --exit-code data/repositories.json
```

最后两条使用固定 fixture 验证幂等性；不能用变化中的在线数据判断“无 diff”。

### Milestone 2：人工策展、合并目录与 README

目标：形成不会被同步覆盖的个人知识层。

任务：

- [ ] 实现 TOML frontmatter + Markdown 正文解析。
- [ ] 实现配置枚举和人工文件校验。
- [ ] 实现默认阶段推导。
- [ ] 实现 GitHub 事实与人工内容按 `repo_id` 合并。
- [ ] 生成前端 `catalog.json` 和 `build-meta.json`。
- [ ] 在 README 中加入唯一生成标记：`STAR_VAULT:CATALOG:START/END`。
- [ ] 生成器只替换标记内部内容，标记外字节保持不变。
- [ ] 人工整理至少 5 个真实项目，覆盖 AI、前端、资料合集、上游归档和仅参考。
- [ ] 为收件箱表单实现“复制策展 Markdown”，不显示虚假的保存成功。

必须测试：

- [ ] 同步前后 `content/` 文件字节不变。
- [ ] 文件名、frontmatter `repo_id` 和事实主键一致。
- [ ] 非法分类、类型或阶段构建失败，并指出文件路径。
- [ ] 超过 5 个标签构建失败。
- [ ] `learned` 没有非占位结论时构建失败。
- [ ] `related` 指向不存在的仓库时构建失败。
- [ ] 仓库改名后仍关联原人工文件。
- [ ] README 标记外内容不变。
- [ ] GitHub 文本中的换行、竖线和 HTML 字符不会破坏 Markdown 或页面。

验收命令：

```bash
python3 scripts/verify_data.py data/repositories.json content/repos
python3 scripts/build_catalog.py
python3 scripts/generate_readme.py
git diff --check
```

完成标准：README 可以从分类和学习阶段找到 5 个已整理项目；重新同步和重新生成不会丢失人工内容。

### Milestone 3：方案 E 正式网站

目标：用完整数据替换原型数据，同时保持已确认的视觉方向。

任务：

- [ ] 将页面数据入口统一改为 `catalog.json`，删除组件内事实 mock。
- [ ] 把当前大组件按 `views/`、`components/` 和 `domain/` 拆分，宿主只保留接线。
- [ ] 首页接入真实统计、最近新增、继续学习、最近学习和随机重访。
- [ ] 项目库支持搜索名称、owner、描述、Topics、个人标签、判断和结论。
- [ ] 支持分类、类型、语言、阶段、标签、上游归档、个人归档和 source status 筛选。
- [ ] 支持最近收藏、最近更新和 Stars 数排序。
- [ ] 筛选状态写入 URL，并正确响应前进/后退。
- [ ] 仓库详情完整区分 GitHub 事实、个人内容和派生状态。
- [ ] 收件箱保留策展模板生成与复制，不执行远端写入。
- [ ] 学习工作台展示真实阶段分组；公开站不提供虚假持久化操作。
- [ ] 关于页读取真实构建元数据和数据边界。
- [ ] 上游 archived、个人 archived 和 missing 使用不同标签。
- [ ] 处理加载、空结果、数据加载失败和 404 状态。
- [ ] 保持方案 E：黑白、单一洋红、编辑分栏、Phosphor 图标和真实头像。

前端模块职责：

| 模块 | 责任 |
|---|---|
| `domain/catalog.js` | Schema 检查、索引和派生字段 |
| `domain/filters.js` | 纯函数搜索、筛选、排序 |
| `domain/routing.js` | URL 读取、写入和 popstate |
| `views/*` | 页面级组织，不保存事实数据 |
| `components/*` | 可复用展示与输入控件 |

必要测试：

- [ ] 搜索个人备注能找到仓库。
- [ ] 分类 + 阶段 + 语言组合筛选正确。
- [ ] missing 和个人归档默认隐藏。
- [ ] 上游归档默认可见并有标识。
- [ ] 三种排序稳定，值相同时用 `repo_id` 收尾。
- [ ] URL 可恢复状态，浏览器返回恢复上一个筛选。
- [ ] 详情通过 `repo_id` 或稳定 slug 打开，改名后旧人工内容仍存在。

浏览器验收：

1. 30 秒内找到“AI 与 Agent”且处于“待学习”的项目。
2. 找到前端分类中被上游作者 archived 的项目。
3. 找到最近一个月收藏的 Python AI 项目。
4. 只凭个人一句话判断找回一个记不起名称的仓库。
5. 从 inbox 生成一份策展 Markdown，保存后重新构建并看到阶段变化。
6. 手机宽度无横向溢出，所有关键操作可用键盘访问。

验收命令：

```bash
python3 scripts/build_catalog.py
npm --prefix app ci
npm --prefix app run build
npm --prefix app run test:sites
```

完成后重新执行方案 E 同尺寸截图对照，并让 `app/design-qa.md` 包含 `final result: passed`。

### Milestone 4：GitHub Actions 与 Pages

目标：自动同步、验证、构建和发布同属一次可审计运行。

工作流触发：

- `push` 到 `main`：使用仓库中的当前数据构建并发布。
- `workflow_dispatch`：先同步，再验证、构建和发布。
- `schedule`：每 6 小时同步一次；cron 避开整点。

工作流顺序：

```text
checkout
→ setup Python
→ schedule/dispatch 时同步 Stars
→ 校验事实与人工内容
→ 生成 README
→ 有语义变化时提交 data 和 README 索引
→ 使用新的 HEAD 生成 catalog 和 build-meta
→ setup Node
→ npm ci、测试、构建
→ 上传 Pages artifact
→ 部署
```

`catalog.json` 和 `build-meta.json` 不提交。数据或 README commit 完成后再生成它们，因此 `build-meta.json` 可以准确记录本次构建使用的 HEAD。网站构建失败时不部署，Pages 继续保留旧版本；已经提交的数据仍可审阅和修复。

权限：

- 同步与提交 job：`contents: write`。
- Pages 构建/部署 job：`pages: write`、`id-token: write`，其余关闭。
- 不创建 PAT；先使用仓库提供的 `GITHUB_TOKEN`。
- 日志不打印 token、Cookie、Authorization header 或完整环境变量。

必须验证：

- [ ] 手动 Action 能完整读取所有分页。
- [ ] 新 Star 在手动同步后进入 `inbox`。
- [ ] 新增人工文件后重新同步，内容字节不变。
- [ ] fixture 中 missing 项目退出默认视图，人工内容仍可找回。
- [ ] 构建失败不会替换当前 Pages。
- [ ] 没有变化时不产生空 commit。
- [ ] 构建产物和 Action artifact 中没有令牌或私有仓库数据。
- [ ] Pages 子路径下资源、刷新和 URL 查询参数可用。

### Milestone 5：发布验收与两周观察

发布前逐项通过：

- [ ] 远程仓库、README、Actions 和 Pages 均为预期的 Public。
- [ ] 当前活跃数量与同一次 API 全量读取一致。
- [ ] 12 个已知上游归档样例在新快照中重新核对，不沿用旧数量断言。
- [ ] 随机抽查 10 个仓库的名称、Stars、语言、收藏时间和链接。
- [ ] 随机抽查 5 个人工文件的分类、阶段、笔记和详情展示。
- [ ] 桌面和手机完成核心检索任务。
- [ ] README 索引和网站使用同一份合并目录。
- [ ] 最近成功检查时间与数据 commit 可见。
- [ ] `git diff --check`、Python 测试、前端测试和构建全部通过。

上线后记录两周：

- 新 Star 数量与 7 天内整理率。
- 每次整理耗时。
- `imported` 库存减少量。
- 实际使用的搜索字段与筛选组合。
- 旧项目被重新打开的数量。
- `queued/learning` 进入 `learned` 的数量。
- `learned` 且无有效结论的数量，目标为 0。

只有这些数据证明真实瓶颈后，才进入 AI 分类、在线编辑、Pagefind 或浏览器扩展评估。

## 8. Issue 与提交拆分建议

每个批次保持可独立验证，避免一个分支同时修改同步、数据格式、网站和工作流。

| 顺序 | Issue | 建议提交 |
|---:|---|---|
| 1 | 工程目录和 v1 配置 | `chore: establish star vault project structure` |
| 2 | REST 客户端与分页 fixtures | `feat: fetch complete public star pages` |
| 3 | 对账、原子写入与数据校验 | `feat: reconcile and verify star snapshots` |
| 4 | TOML/Markdown 策展解析 | `feat: add versioned repository curation` |
| 5 | 合并目录与 README 生成 | `feat: generate catalog and readme indexes` |
| 6 | 方案 E 接入真实数据 | `feat: connect magazine UI to catalog data` |
| 7 | 搜索、筛选、详情和学习流验收 | `feat: complete catalog discovery flows` |
| 8 | Actions 与 Pages | `ci: sync and publish star vault` |
| 9 | 真实链路验收和文档 | `docs: record mvp acceptance evidence` |

提交前必须检查 diff，生成文件与手写文件分开审阅；不顺手重构任务范围之外的旧代码。

## 9. 总体验收标准

MVP 只有同时满足下面条件才算完成：

1. 一次真实同步导入全部当前公开 Stars，分页数量可核对。
2. 同一 fixture 重复同步不产生 diff。
3. 任意分页失败、空集合异常或 Schema 错误都不会覆盖旧快照。
4. 人工内容在重新同步后字节不变。
5. README 和网站来自同一份合并目录。
6. 用户能完成收藏进入 inbox、人工整理、进入学习、留下结论和公开查看的完整流程。
7. 搜索与组合筛选通过四个 30 秒检索任务。
8. GitHub Actions 能手动和定时运行，Pages 只发布通过校验的构建。
9. 公开仓库、日志和构建产物中没有敏感凭证或私有仓库信息。
10. 桌面与移动端通过视觉 QA，`final result: passed`。

## 10. 我们没有防什么

- 不保证 GitHub Actions 按 cron 秒级准点执行，只保证下一次成功运行后数据一致。
- 不为偶发 API 限流和 workflow push 冲突加入自动重试、锁或队列；失败时保留旧站并允许手动重跑。
- 不保证 missing 的实际发生时间，只记录系统发现时间。
- 不为 283 条数据引入虚拟列表、服务端搜索、缓存层或数据库。
- 不自动删除 missing 记录，也不自动删除任何人工内容。
- 不自动接受机器分类建议。
- 不在 MVP 内解决私有笔记与公开站点的双层权限问题。

## 11. 开工顺序

后续开发从 Milestone 0 开始，但第一个具有业务价值的纵向切片是：

```text
目录与配置
→ 多页 fixture
→ sync_stars.py
→ verify_data.py
→ 首次真实导入
```

这一切片完成后先审阅真实 `data/repositories.json`，确认数量、字段、改名和 missing 语义，再进入人工策展和网站接线。不要先继续扩充前端功能。
