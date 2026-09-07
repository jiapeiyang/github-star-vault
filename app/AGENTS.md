# Star Vault App Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Treat `public/data/*.json` as generated files from the repository root. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact. Before handoff, run `npm test`, `npm run build`, and `npm run test:sites`.

## Durable visual direction

- Use方案 E“开发者杂志”作为后续视觉基线。
- Keep a near-white and true-black palette with one vivid magenta accent.
- Use bold contemporary sans typography, monospace repository names, asymmetric editorial columns, thin rules, and large real owner avatars.
- Keep classification prominent and visibly separate GitHub facts, public-source repository explanations, and any automatic suggestions; remove the personal learning system as specified in the current plan.
- Do not drift back to dashboard KPI cards, glassmorphism, gradients, rainbow categories, or generic equal-card grids.

## Durable product direction

- 2026-09-07 用户明确：网站主要用于回忆历史关注的仓库、浏览和搜索，学习阶段、笔记及学习完成统计全部删除。
- 后续主流程围绕收藏回顾、仓库解读、如何使用和有来源的示例；实施时删除学习工作台、相关字段、笔记内容和校验，不保留兼容入口或折叠备注区。
- 详情要兼顾快速理解与深入阅读，列表继续使用简洁摘要；不同资源类型采用相应的使用说明，不给教程或资源合集硬套安装命令。
- `../DEVELOPMENT_PLAN_V1.2.md` 是本次调整后的实施方案，各批次状态见交付记录，不把本地开发写成线上发布。
