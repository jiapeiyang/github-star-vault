# jiapeiyang GitHub Stars 实证快照

## 快照信息

- GitHub 用户：[`jiapeiyang`](https://github.com/jiapeiyang?tab=stars)
- 采集时间：2026-09-04 13:00:30 UTC / 2026-09-04 21:00:30 Asia/Shanghai
- API：`GET /users/jiapeiyang/starred?sort=created&direction=desc&per_page=100`
- Header：`Accept: application/vnd.github.star+json`
- API version：`2026-03-10`
- 分页：3 页，每页最多 100 条
- 范围：当时公开可见的 Stars，不包含请求者无权访问的私有仓库

公开 Stars 是动态数据。调研过程中连续观察到 281、282、283 三个数量；本文件统一采用 13:00:30 UTC 完成的 283 条全量快照。

## 总体数据

| 指标 | 数量 | 占比 |
|---|---:|---:|
| 公开 Stars | 283 | 100% |
| 2026 年收藏 | 149 | 52.7% |
| 2021 年收藏 | 83 | 29.3% |
| 没有 GitHub Topics | 97 | 34.3% |
| 没有主语言 | 41 | 14.5% |
| 没有描述 | 8 | 2.8% |
| 上游已 archived | 12 | 4.2% |
| fork | 2 | 0.7% |

## 收藏年份

| 年份 | 数量 |
|---|---:|
| 2026 | 149 |
| 2021 | 83 |
| 2017 | 19 |
| 2018 | 17 |
| 2019 | 4 |
| 2023 | 4 |
| 2022 | 3 |
| 2016 | 2 |
| 2024 | 2 |

这不是均匀积累的书签库。2021 年与 2026 年形成两个明显高峰：早期内容更多是 Web、Node、Vue、面试与工程学习资料；当前高峰转向 Claude Code、Codex、Agent、Skills 和 MCP。

## 主要语言

| 语言 | 数量 |
|---|---:|
| JavaScript | 76 |
| TypeScript | 53 |
| Python | 46 |
| 未标注 | 41 |
| Go | 14 |
| Shell | 11 |
| Rust | 10 |
| HTML | 8 |
| Swift | 4 |

语言适合过滤，不适合成为唯一主分类。近期 100 条数据中，同一仓库经常同时命中“AI 与 Agent”“前端”“开发者工具”或“内容创作”。

## 高频 Topics

| Topic | 数量 |
|---|---:|
| `claude-code` | 42 |
| `javascript` | 30 |
| `codex` | 29 |
| `claude` | 26 |
| `react` | 23 |
| `ai` | 20 |
| `llm` | 18 |
| `ai-agents` | 18 |
| `vue` | 17 |
| `ai-agent` | 16 |
| `agent-skills` | 14 |
| `skills` | 14 |
| `nodejs` | 14 |
| `mcp` | 13 |
| `typescript` | 13 |

Topics 能提供初始分类建议，但 97 个仓库完全没有 Topics，而且 Topic 由仓库作者维护，不能表示个人收藏目的。

## 最近收藏样例

| 收藏时间 UTC | 仓库 |
|---|---|
| 2026-09-04 12:55:36 | `multica-ai/andrej-karpathy-skills` |
| 2026-09-04 12:54:28 | `yzfly/awesome-skills-zh` |
| 2026-09-04 12:31:11 | `libukai/awesome-agent-skills` |
| 2026-09-04 12:24:32 | `virgiliojr94/book-to-skill` |
| 2026-09-04 12:22:03 | `deusyu/translate-book` |
| 2026-09-04 06:23:58 | `datawhalechina/Agent-Learning-Hub` |
| 2026-09-04 06:21:34 | `datawhalechina/hello-agents` |

同一天内连续新增多个项目，证明“持续自动同步”是实际需求。它不证明秒级更新有必要，因此方案仍采用 6 小时 SLO 与手动触发。

## 最早收藏样例

| 收藏时间 UTC | 仓库 |
|---|---|
| 2017-03-26 | `request/request` |
| 2017-03-13 | `i5ting/vsc` |
| 2017-03-13 | `ElemeFE/node-interview` |
| 2017-03-08 | `koajs/koa` |
| 2016-09-23 | `xwartz/wechat-app-demo` |
| 2016-08-11 | `lessfish/underscore-analysis` |

旧仓库不能只用“最近更新”判断价值。有些项目可能已归档或技术过时，有些仍是理解基础概念的好资料。个人备注与学习结论需要与上游活跃度分开。

## 对需求的直接影响

1. 首次导入必须进入 `imported`，不能把 283 个历史项目都塞进 `inbox`。
2. 主分类以领域为核心，语言和 Topics 作为筛选。
3. 必须支持上游 archived 标识。
4. 搜索必须覆盖个人备注，补足 GitHub 原生搜索。
5. 同步必须动态分页，不能写死当前 3 页。
6. 数量与元数据都必须带快照时间，不能当作永久事实。

## 限制

- 本次只观察公开 API，无法证明私有 Stars 是否存在。
- Topics、描述、主语言与 Stars 数均由 GitHub 当前响应给出，之后可能变化。
- 规则命中的主题是需求分析线索，不是人工确认分类。
- 本目录没有保存完整原始 API 响应；完整数据应由未来同步脚本按正式 Schema 首次导入。
