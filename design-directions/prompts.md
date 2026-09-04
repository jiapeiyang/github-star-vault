# 设计图生成提示词

生成方式：Codex 内置 `imagegen`。所有图片均为全新生成，没有使用现有原型或当前可运行设计的截图作为参考图。

## 方案 A 首页

```text
Use case: ui-mockup
Asset type: high-fidelity desktop website concept, homepage, full-frame 16:10 canvas
Primary request: Design an original homepage for "Star Vault", a personal GitHub starred-project knowledge library. Direction A is an industrial editorial index desk for a technical power user.
Audience: a Chinese software engineer organizing hundreds of starred repositories for discovery and learning.
Style: dark graphite and near-black surfaces, one safety-orange accent only, crisp grotesk sans typography plus restrained monospace metadata, tactile index tabs and archival labels, precise editorial asymmetry, dense but calm.
Composition: compact single-line top navigation; asymmetric hero with the exact brand text "Star Vault", a short Chinese headline "把收藏变成可行动的索引", and a large search command bar; a recent-intake column using real repository names "anthropics/skills", "herdrdev/herdr", "modelcontextprotocol/servers"; a bold domain-category index below with visible Chinese labels "AI 与 Agent", "开发者工具与自动化", "Web、前端与跨端", "设计与内容创作". Use real-looking owner avatars and small factual metadata.
Visual hierarchy: strong left-aligned title, search is the primary action, classification is visibly first-class, repository facts and personal notes look different.
Constraints: no browser chrome, no AI purple, no gradients, no glassmorphism, no neon glow, no generic dashboard KPI cards, no three equal feature cards, no charts, no rainbow category colors, no decorative dots, no em dash, no watermark. Keep key Chinese text legible and correctly spelled. Professional product design presentation.
```

## 方案 A 项目库

```text
Use case: ui-mockup
Asset type: high-fidelity desktop website concept, project library screen, full-frame 16:10 canvas
Primary request: Design the project-library view for "Star Vault" using Direction A, an industrial editorial index desk.
Audience: a Chinese software engineer filtering and reopening hundreds of GitHub repositories.
Style: dark graphite and near-black, one safety-orange accent, utilitarian typography, compact monospace repository metadata, crisp 1px rules, asymmetrical but highly usable.
Composition: compact top navigation; left fixed domain index with the eight Chinese categories "AI 与 Agent", "Web、前端与跨端", "后端与数据", "基础设施、网络与安全", "开发者工具与自动化", "设计、图像与内容创作", "计算机基础与工程实践", "商业与行业应用"; center column with search, resource-type and learning-stage filters, then compact repository rows; right reading panel showing details for "herdrdev/herdr". Visible repo rows should include "anthropics/skills", "modelcontextprotocol/servers", "datawhalechina/hello-agents", "gsd-build/get-shit-done". Clearly label automatic suggestions versus personal notes.
Constraints: no browser chrome, no AI purple, no gradients, no glassmorphism, no dashboard charts, no equal card grid, no rainbow tags, no excessive pills, no decorative status lights, no em dash, no watermark. Keep key Chinese labels and repository names legible. Professional product UI mockup.
```

## 方案 B 首页

```text
Use case: ui-mockup
Asset type: high-fidelity desktop website concept, homepage, full-frame 16:10 canvas
Primary request: Design an original homepage for "Star Vault", a personal GitHub starred-project knowledge library. Direction B is a calm open-source almanac that feels curated, readable, and enduring.
Audience: a Chinese software engineer and technical readers browsing a personal collection.
Style: cool paper-white background, ink-black typography, one forest-green accent only, contemporary grotesk sans with subtle monospace metadata, editorial publication rhythm, generous whitespace, fine rules, quiet tactile paper texture.
Composition: compact single-line navigation; left-aligned editorial hero with exact brand "Star Vault" and Chinese headline "把收藏写成自己的开源年鉴"; a wide search field; an irregular category table-of-contents layout with visible labels "AI 与 Agent", "Web、前端与跨端", "后端与数据", "开发者工具与自动化"; a right-side curated stack of real repositories with owner avatars, including "anthropics/skills", "krahets/hello-algo", "vueuse/vueuse"; a narrow timeline strip referencing "2021" and "2026".
Visual hierarchy: typography and whitespace first, category discovery second, repository imagery third. Distinguish GitHub facts from personal learning notes.
Constraints: no browser chrome, no beige luxury palette, no serif display font, no gradients, no glassmorphism, no purple, no centered giant hero, no three equal feature cards, no KPI dashboard, no rainbow categories, no decorative dots, no em dash, no watermark. Keep key Chinese text legible and correctly spelled. Professional editorial product design.
```

## 方案 B 项目库

```text
Use case: ui-mockup
Asset type: high-fidelity desktop website concept, project library screen, full-frame 16:10 canvas
Primary request: Design the project-library view for "Star Vault" using Direction B, a calm open-source almanac.
Audience: a Chinese software engineer browsing and learning from GitHub Stars.
Style: cool paper white, ink black, one forest-green accent, clean grotesk sans, monospace for repository names, magazine index layout, generous spacing with thin rules and no heavy shadows.
Composition: compact top nav; large but restrained title "项目年鉴"; search and underlined text filters near the top; a left editorial domain table of contents; a main list of repositories arranged like annotated reading entries rather than equal cards; a slim right column showing learning stage, collection date, language and a personal-note excerpt. Use real repository names "koajs/koa", "vueuse/vueuse", "tailscale/tailscale", "codecrafters-io/build-your-own-x", "nocobase/nocobase". Include a selected detail expansion for "vueuse/vueuse" with sections "仓库事实", "我的判断", "学习结论".
Constraints: no browser chrome, no beige luxury styling, no serif headline, no purple, no gradients, no glass, no generic dashboard, no data table, no equal card grid, no rainbow chips, no decorative dots, no em dash, no watermark. Keep key Chinese labels and repository names legible. Professional product design presentation.
```
