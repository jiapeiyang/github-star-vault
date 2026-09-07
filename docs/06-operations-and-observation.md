# 上线运行与两周观察

> 观察周期：2026-09-05～2026-09-19
>
> 当前状态：已启动
>
> 跟踪 Issue：[#1 MVP 上线后两周使用观察](https://github.com/jiapeiyang/github-star-vault/issues/1)
>
> **2026-09-07 定位调整**：后续观察以 [v1.2 计划的使用指标](../DEVELOPMENT_PLAN_V1.2.md#9-使用观察与成功指标) 为准，重点是收藏找回、解读帮助程度、示例质量与历史回顾。用户要求在实施时删除学习阶段、笔记及完成统计；本文的旧学习流程和指标仅保留为历史基线，不再执行。Issue 本身本轮未修改。

## 1. 线上入口

- 公开仓库：<https://github.com/jiapeiyang/github-star-vault>
- GitHub Pages：<https://jiapeiyang.github.io/github-star-vault/>
- 自动化工作流：<https://github.com/jiapeiyang/github-star-vault/actions/workflows/site.yml>

工作流在每天 UTC `00:17`、`06:17`、`12:17`、`18:17` 自动运行，也支持 `workflow_dispatch` 手动触发。每次成功运行按同一条流水线完成同步、校验、README 生成、测试、构建和 Pages 发布。

## 2. 观察基线

基线来自 2026-09-05 的三页 GitHub API 全量读取及同一响应生成的正式快照。

| 指标 | 基线 |
|---|---:|
| 当前公开 Stars | 284 |
| 历史记录总数 | 285 |
| missing | 1 |
| 已人工策展 | 6 |
| `imported` | 278 |
| `inbox` | 0 |
| `queued` | 1 |
| `learning` | 1 |
| `learned` | 1 |
| `reference` | 3 |
| 个人 `archived` | 0 |
| 上游 archived | 12 |

基线验收同时完成：随机 10 个仓库的名称、Stars、语言、收藏时间和链接核对；6 份人工文件的文件名、`repo_id`、分类、阶段、笔记及网站合并数据核对；固定 fixture 重复同步的文件哈希一致。

## 3. 指标口径

| 指标 | 口径 | 记录位置 |
|---|---|---|
| 新 Star 数量 | 观察期内首次出现且 `discovered_in_initial_import=false` 的记录数 | 数据快照 |
| 7 天内整理率 | 新 Star 中在 `first_seen_at` 后 7 天内建立人工策展文件的比例 | 数据快照 + Git 历史 |
| 单次整理耗时 | 从开始判断到策展文件通过校验的实际分钟数 | Issue 手工记录 |
| `imported` 库存减少量 | 278 减去检查日的 `imported` 数量 | 合并目录 |
| 搜索与筛选组合 | 为找回项目实际输入的字段、筛选项及是否找到 | Issue 手工记录 |
| 旧项目重访数量 | 观察期内主动重新打开的首次导入项目数，同一项目当天只计一次 | Issue 手工记录 |
| 学习完成数 | 观察期内从 `queued` 或 `learning` 进入 `learned` 的项目数 | Git 历史 |
| 无有效结论的 `learned` | `stage=learned` 但没有非占位学习结论的数量，目标为 0 | 构建校验 |

网站不采集访问行为。搜索组合、重访和整理耗时由使用者在 Issue 中手工记录，避免为两周验证引入分析 SDK、Cookie 或服务端存储。

## 4. 检查节奏

| 日期 | 动作 | 状态 |
|---|---|---|
| 2026-09-05 | 记录上线基线，确认自动同步和 Pages | 已完成 |
| 2026-09-12 | 汇总第一周指标，记录主要阻力 | 待执行 |
| 2026-09-19 | 汇总两周指标，决定是否进入下一阶段 | 待执行 |

每次检查在 Issue #1 追加一条评论，使用下面的模板：

```markdown
## YYYY-MM-DD

- 新 Star：
- 7 天内已整理：
- 单次整理耗时：
- imported：
- 使用过的搜索/筛选：
- 旧项目重访：
- queued/learning → learned：
- 无有效结论的 learned：0
- 本周最明显的阻力：
```

## 5. 日常操作

手动立即同步并发布：

```bash
gh workflow run site.yml --repo jiapeiyang/github-star-vault
gh run list --repo jiapeiyang/github-star-vault --workflow site.yml --limit 1
```

新增或修改人工策展内容后，在本地验证：

```bash
python3 scripts/verify_data.py
python3 scripts/build_catalog.py
python3 scripts/generate_readme.py
cd app
npm test
GITHUB_PAGES=true npm run build
npm run test:sites
```

同步失败时先查看对应 Actions 日志。失败运行不会部署新的 Pages，线上继续保留最近一次成功版本；修复明确原因后手动重跑，不在脚本中加入无条件重试。

## 6. 两周后的决策门槛

只有观察记录显示真实瓶颈时，才评估下一项能力：

- 分类或写摘要持续占据主要整理时间，再评估 AI 建议。
- 现有字段多次找不到已知项目，再评估 Pagefind 或语义搜索。
- Git 文件编辑成为主要阻力，再评估在线编辑。
- 6 小时同步窗口确实阻断使用，再评估浏览器扩展或更短周期。

## 7. 我们没有防什么

- 不自动采集搜索、点击和停留行为；观察期使用 Issue 手工记录。
- 不为 GitHub API 临时限流或并发 push 增加锁、重试队列和备用调度器。
- 不保证定时任务秒级准点，只以最近一次成功同步为准。
- 不在观察期引入 AI 分类、数据库、在线编辑或私有笔记权限层。

## 8. v1.1 观察分段

2026-09-05 的 v1.1 增加完整笔记阅读、队列分页和策展文件编辑下载。发布结果见 [v1.1 验收记录](../app/design-qa-v1.1.md)。正式内容基线仍为 active 284、策展 6、imported 278；30 个分类草案未导入。

后续记录整理耗时时注明使用 v1 复制模板还是 v1.1 编辑下载流程。只有实际确认并提交的新策展文件才计入整理率，下载或预览不计入。

## 9. 首批分类导入后的观察口径

2026-09-05 用户授权助手直接归纳后，新增 30 个正式分类文件。本批结束时分类覆盖为 36/284，待分类 248；学习阶段 imported 仍为 278，因为分类本身不证明已经开始或完成学习。新增 30 项的学习结论为空。

后续分别记录“分类覆盖率”和“个人学习整理率”，不把本批助手完成的用途归纳算作用户完成学习。

## 10. 全量分类完成后的基线

2026-09-05 按用户要求继续整理剩余 248 个仓库，累计 284 个当前公开 Stars 已全部分类，待分类为 0。此前 36 份记录保持原样；新增文件的学习结论和实践记录为空，imported 阶段仍为 278。

分类分布：Web/前端/跨端 75，开发者工具与自动化 74，设计/图像/内容创作 40，AI 与 Agent 31，计算机基础与工程实践 25，后端与数据 20，基础设施/网络/安全 11，商业与行业应用 8。

后续新 Star 仍按已有同步逻辑进入 inbox，本次人工归纳不是后台自动分类服务。观察重点从清空分类库存转为实际检索、学习选择和个人结论积累。
