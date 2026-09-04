# GitHub Star Vault

> 讨论基线：2026-09-04
> 目标：把 GitHub Stars 从容易吃灰的收藏列表，变成可持续同步、可整理、可检索、能推动学习的个人开源项目知识库。

## 当前结论

建议把项目建成一个公开 GitHub 仓库，采用 **Git 中的结构化数据作为唯一事实源 + GitHub Actions 准实时同步 + React/Vite 静态网站 + GitHub Pages 发布** 的方案。正式站沿用已验证的方案 E 原型，避免为 Astro 重写交互与视觉实现。

它包含三个彼此分开的层次：

1. **GitHub 事实层**：定时读取公开 Stars，保存仓库元数据与 `starred_at`。
2. **个人策展层**：手工维护主分类、资源类型、学习阶段、一句话价值与学习结论；自动同步不能覆盖这些内容。
3. **展示层**：README 提供可读目录，网站提供搜索、筛选、详情和学习入口。

“实时更新”在 MVP 中定义为：**每 6 小时自动同步一次，并支持手动立即触发**。GitHub 没有适合监听“某用户给其他仓库加 Star”的个人 webhook，因此秒级更新需要浏览器扩展或额外服务，当前没有足够收益。

## 为什么值得单独做

2026-09-04 21:00:30（Asia/Shanghai）的公开 API 快照显示：

- 公开 Stars：**283** 个。
- 2026 年新增：**149** 个，占 52.7%。
- 2021 年新增：**83** 个，占 29.3%。
- 上游已归档仓库：**12** 个；fork：**2** 个。
- 97 个没有 GitHub Topics，41 个没有主语言，8 个没有描述。
- 主要语言为 JavaScript 76、TypeScript 53、Python 46；近期收藏明显集中在 Claude Code、Codex、Agent、Skills、MCP。

这批数据既有较早的前端和工程学习资料，也有 2026 年快速增加的 AI 工程项目。只按语言或 GitHub Topics 分类会把“技术实现”与“学习目的”混在一起，也无法处理没有 Topics 的约三分之一仓库。

## 文档导航

- [MVP 详细开发计划](DEVELOPMENT_PLAN.md)：已冻结的技术决策、目录职责、数据契约、同步失败语义、开发批次与逐阶段验收标准。
- [需求与产品方案](docs/01-requirements-and-prd.md)：目标用户、使用流程、分类、学习状态、页面和范围。
- [调研与方案比较](docs/02-research-and-options.md)：GitHub 原生能力、现有产品、技术方案对比与判断。
- [技术架构与数据模型](docs/03-architecture-and-data-model.md)：目录、同步、合并规则、Schema、工作流与安全边界。
- [路线图与验收标准](docs/04-roadmap-and-acceptance.md)：MVP 顺序、完成标准、验证方式和风险分级。
- [待确认决策](docs/05-open-questions-and-decisions.md)：需要一起确定的产品偏好及建议默认值。
- [当前 Stars 实证快照](evidence/2026-09-04-stars-profile.md)：采样方法、数据分布与限制。
- [横纵分析研究报告](reports/GitHub-Star-Vault-横纵分析报告.md)：完整研究叙事、竞品比较和未来推演。
- [方案 E 可交互原型](app/README.md)：以“开发者杂志”为长期视觉方向，覆盖首页、项目库、新收藏收件箱、学习工作台、仓库详情、关于页和完整检索交互。
- [视觉验收记录](app/design-qa.md)：方案 E 参考稿与当前实现的同尺寸对照和验收结论。
- [五个视觉方向](design-directions/README.md)：工业索引台、开源年鉴、瑞士技术目录、开源实验手册和开发者杂志，共十张 GPT 生成的首页与项目库概念图。
- `output/pdf/GitHub-Star-Vault-横纵分析报告.pdf`：研究报告的 PDF 版。

## 当前推荐设计

正式网站位于 `app/`。它以方案 E“开发者杂志”为视觉基线，读取同步脚本生成的完整公开 Stars 目录，并将 GitHub 事实、人工策展与派生状态分开展示。

```bash
python3 scripts/verify_data.py
cd app
npm ci
npm run dev
```

当前事实快照包含 284 条公开 Stars，其中 6 条已建立正式人工策展文件。首次导入的未整理项目进入 `imported`；自动建议在 MVP 中关闭。

## 一句话产品定义

**GitHub Star Vault 是一个以 GitHub Stars 为入口、以个人判断为核心、以学习行动为结果的版本化开源项目知识库。**

## 建议先做什么

第一版只验证五件事：

1. 一次性导入全部公开 Stars，历史库存进入 `imported`。
2. 后续新增 Star 进入 `inbox`，取消 Star 退出默认视图。
3. 手工内容与 GitHub 元数据分文件保存，同步后不丢失。
4. 网站能搜索个人备注，并按分类、类型、语言、学习阶段筛选。
5. 新收藏 7 天内整理率能够从数据中算出来。

完成这五件事后，再根据真实使用决定是否加入 AI 分类、语义搜索、浏览器扩展或后台管理。

## 当前实施状态

- 已完成公开 Stars 动态分页、全量对账、原子写入和事实校验。
- 已导入当前 284 条公开 Stars，并建立 6 条正式策展内容。
- 已完成 README 索引、前端目录生成和方案 E 真实数据接入。
- 已完成 Python、前端领域函数、静态打包和 GitHub Pages 子路径验证。
- GitHub Actions 和 Pages 工作流已经写入，远程执行结果见仓库 Actions。

## 我们没有防什么

- 不追求秒级 Star 同步；6 小时窗口内更新即可。
- 不处理私有仓库的公开展示；MVP 只同步公开 Stars。
- 不为偶发的两个同步任务同时运行增加锁或重试；一次同步失败不会损坏人工内容，下次或手动同步可以补齐。
- 不让 AI 自动改写人工分类和笔记；第一版可以完全不依赖 AI。
- 不做多用户、登录、评论、在线编辑后台、向量数据库和复杂复习算法。

<!-- STAR_VAULT:CATALOG:START -->
## 自动生成的项目索引

> 最近成功检查：`2026-09-04T18:59:19Z` · 当前公开 Stars：**284** · 已人工整理：**6**

### 学习阶段

- 历史待整理：278
- 新收藏：0
- 待学习：1
- 学习中：1
- 已学习：1
- 仅参考：3
- 已归档：0

### AI 与 Agent（1）

- [anthropics/skills](https://github.com/anthropics/skills) — 用于对照 Agent Skills 的目录结构、能力边界与写作规范。

### Web、前端与跨端（2）

- [react-love/react-latest-framework](https://github.com/react-love/react-latest-framework) — 用于回看早期 React 客户端框架的组织方式，并验证上游归档项目仍能被检索。
- [vueuse/vueuse](https://github.com/vueuse/vueuse) — 组合式 API 设计紧凑，适合观察可复用 Hook 的命名和边界。

### 开发者工具与自动化（2）

- [herdrdev/herdr](https://github.com/herdrdev/herdr) — 观察多 Agent 终端工作区如何组织上下文、任务和协作。
- [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done) — 作为 Claude Code 规格驱动流程的上游归档样例，仅在对比同类方案时查阅。

### 计算机基础与工程实践（1）

- [krahets/hello-algo](https://github.com/krahets/hello-algo) — 需要回顾算法概念时，从图解和可运行代码快速进入。

### 待分类（278）

- [eternityspring/shuohao-skills](https://github.com/eternityspring/shuohao-skills) — AI 短剧制作的 skill 集合：拆角色、排大纲、出场景与道具设定、写剧本、切分镜 \| Agent skills for AI short-drama production — character bibles, adaptation outlines, art bibles, screenp…
- [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) — A single CLAUDE.md file to improve Claude Code behavior, derived from Andrej Karpathy's observations on LLM coding pitfalls.
- [yzfly/awesome-skills-zh](https://github.com/yzfly/awesome-skills-zh) — 🚀 精选 Claude Skills、Agent Skills、LLM Skills 及 AI 智能体开发资源列表（中文）。A curated list of awesome Claude / Agent / LLM Skills.
- [libukai/awesome-agent-skills](https://github.com/libukai/awesome-agent-skills) — Agent Skills 终极指南：快速入门、资源推荐、精选技能与实用工具 ｜The Ultimate Guide to Agent Skills: QuickStart, Resources, Features&Toolkit
- [virgiliojr94/book-to-skill](https://github.com/virgiliojr94/book-to-skill) — Turn any technical book PDF into a Claude Code skill — ready to study, reference, and use while you work.
- [deusyu/translate-book](https://github.com/deusyu/translate-book) — Agent skill for Codex, Claude Code, and OpenClaw that translates entire books (PDF/DOCX/EPUB) into any language using parallel subagents.
- [datawhalechina/Agent-Learning-Hub](https://github.com/datawhalechina/Agent-Learning-Hub) — AI Agent 学习路线与资料库收集
- [datawhalechina/hello-agents](https://github.com/datawhalechina/hello-agents) — 📚 《从零开始构建智能体》——从零开始的智能体原理与实践教程
- [kangarooking/cangjie-skill](https://github.com/kangarooking/cangjie-skill) — 把书、长视频、播客等高价值内容蒸馏成可执行的 Agent Skills（Distill high-value content from books, long-form videos, podcasts, and more into executable Agent Skills）
- [kunchenguid/firstmate](https://github.com/kunchenguid/firstmate) — Talk to one agent. Ship with a crew.
- [lsdefine/GenericAgent](https://github.com/lsdefine/GenericAgent) — Self-evolving agent: grows skill tree from 3.3K-line seed, achieving full system control with 6x less token consumption
- [tw93/Mole](https://github.com/tw93/Mole) — 🐹 Clean, uninstall, analyze, optimize, and monitor your Mac. Free open-source CLI, plus a native Mac app.
- [HalfAI1102/anthropic-art](https://github.com/HalfAI1102/anthropic-art) — Generate full-background Anthropic-style editorial illustrations with verified palette and hand-drawn visual rules.
- [miuuyy/codex-chatgpt-web](https://github.com/miuuyy/codex-chatgpt-web) — Use ChatGPT Web (including Pro) as a native model in the Codex app — with context, tools, streaming and images beyond Codex usage limits.
- [get-bb/bb](https://github.com/get-bb/bb) — The agent IDE that builds itself
- [threerocks/hand-drawn-styles](https://github.com/threerocks/hand-drawn-styles) — Claude Code skill：把内容套进内置手绘画风配方,产出可直接复制的生图提示词。内置儿童涂色/极简线条/蜡笔童涂/吉卜力/小豆人涂鸦 5 种已验证画风。
- [yanliudesign/mono-color-skill](https://github.com/yanliudesign/mono-color-skill) — One-ink editorial print image skill — warm paper, halftone photography, active negative space, and restrained typography.
- [emilkowalski/skills](https://github.com/emilkowalski/skills) — Skills for Designers and Engineers.
- [MengTo/Skills](https://github.com/MengTo/Skills) — Agent skills for designers and builders using Codex, Claude, Cursor, and other AI coding agents
- [tmux/tmux](https://github.com/tmux/tmux) — tmux source code
- [0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut) — Open-source, local-first conversational AI video editor with a professional multi-track timeline, Agent Skills, MCP integration, and Remotion renderi…
- [boyang-hu/website-rebuild-skill](https://github.com/boyang-hu/website-rebuild-skill) — 复刻网站的 Agent Skill：抓只读镜像、从压缩代码逐行还原、自动比对验收。An agent skill that mirrors a website, rebuilds it from the minified code, and verifies the result with auto…
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) — Makes your AI agent think like the laziest senior dev in the room. The best code is the code you never wrote.
- [Sac-Y/MiniMax-H3-Cloud](https://github.com/Sac-Y/MiniMax-H3-Cloud) — 暂无 GitHub 描述。
- [hwdsl2/wireguard-install](https://github.com/hwdsl2/wireguard-install) — WireGuard VPN server installer for Ubuntu, Debian, AlmaLinux, Rocky Linux, CentOS, Fedora, openSUSE and Raspberry Pi OS. Includes interactive setup a…
- [tanweai/pua](https://github.com/tanweai/pua) — 你是一个曾经被寄予厚望的 P8 级工程师。Anthropic 当初给你定级的时候，对你的期望是很高的。 一个agent使用的高能动性的skill。 Your AI has been placed on a PIP. 30 days to show improvement.
- [OpenMOSS/MOSS-VL](https://github.com/OpenMOSS/MOSS-VL) — An open-weight 11B model series for long-form and real-time video understanding
- [chatfire-AI/huobao-drama](https://github.com/chatfire-AI/huobao-drama) — 🎬 火宝短剧 - 基于AI的一站式短剧生成平台 《一句话生成完整短剧，从剧本到成片全自动化》 Huobao Drama - An AI-Powered End-to-End Short Drama Generator "One Sentence to Complete Drama: Fully A…
- [stablyai/orca](https://github.com/stablyai/orca) — Orca is the ADE for working with a fleet of parallel agents. Run any coding agent with your own subscription. Available on desktop, mobile and VPS.
- [Hmbown/Codewhale](https://github.com/Hmbown/Codewhale) — Open-source coding agent for your terminal, built in Rust and on a journey of continuous community improvement. Issues and PRs welcome.
- [ExplosiveCoderflome/AI-Novel-Writing-Assistant](https://github.com/ExplosiveCoderflome/AI-Novel-Writing-Assistant) — 面向长篇小说创作的 AI Native 开源系统，用 Agent、世界观、写法引擎、RAG 和整本生产工作流，帮助新手从一句灵感走到完整小说。AI-native engine for end-to-end novel creation — from idea to full chapters, w…
- [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) — AI agent skill that researches any topic across Reddit, X, YouTube, HN, Polymarket, and the web - then synthesizes a grounded summary
- [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) — 利用 AI 大模型和自动化工作流，根据主题或关键词一键生成高清短视频。Generate HD short videos from a topic or keyword with an automated AI workflow.
- [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) — 📄 Configuration files that enhance Cursor AI editor experience with custom rules and behaviors
- [leookun/cursor-byok](https://github.com/leookun/cursor-byok) — cursor-byok is a local implementation of Cursor's backend
- [zhaoxuya520/reverse-skill](https://github.com/zhaoxuya520/reverse-skill) — Reverse Engineering / Authorized Penetration Testing / Security Research Skill Router Pack AI-powered routing + On-demand toolchain bootstrapping + S…
- [dembrandt/dembrandt](https://github.com/dembrandt/dembrandt) — Extract any website’s design system into tokens in seconds: logo, colors, typography, borders & more. One command.
- [freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2) — Prompt as Code \| GPT-Image2 工业级提示词引擎与模板库，530+ 个案例逆向工程，20+ 套工业级模板，并提炼出Skills，持续更新中
- [tailscale/tailscale](https://github.com/tailscale/tailscale) — The easiest, most secure way to use WireGuard and 2FA.
- [deepcoldy/botmux](https://github.com/deepcoldy/botmux) — Bridge Feishu/Lark to AI coding CLIs — Claude Code, Codex, Gemini, OpenCode… every DM, group or topic spawns its own live-streaming CLI session
- [MDX-Tom/gpt-5.6-instruct](https://github.com/MDX-Tom/gpt-5.6-instruct) — A Codex jailbreak prompt and test pack for gpt-5.6-sol. 针对 gpt-5.6 系列的 Codex 破甲提示词与测试包。
- [bojieli/ai-agent-book](https://github.com/bojieli/ai-agent-book) — 《深入理解 AI Agent：设计原理与工程实践》（李博杰 著）开源主仓库：全书正文、编译版 PDF 与按章配套代码
- [yizhiyanhua-ai/fireworks-tech-graph](https://github.com/yizhiyanhua-ai/fireworks-tech-graph) — Generate production-quality SVG+PNG technical diagrams from natural language. 7 styles, UML support, and AI/Agent workflow patterns.
- [geeklee/srt-whiteboard-animation](https://github.com/geeklee/srt-whiteboard-animation) — 将 SRT 字幕做成暖米黄纸张底的流式笔迹白板手绘动画 skill：mask 分区遮罩编排 + stream 连续笔迹（ink→color）。
- [YouMind-OpenLab/awesome-gpt-image-2](https://github.com/YouMind-OpenLab/awesome-gpt-image-2) — 🚀 World's largest GPT Image 2 prompt library, updated daily — 2000+ curated prompts with preview images, 16 languages. OpenAI's next-gen image model…
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — The design language that makes your AI harness better at design.
- [lbjlaq/Antigravity-Manager](https://github.com/lbjlaq/Antigravity-Manager) — Professional Antigravity Account Manager & Switcher. One-click seamless account switching for Antigravity Tools. Built with Tauri v2 + React (Rust).专…
- [citrolabs/ego-lite](https://github.com/citrolabs/ego-lite) — The fastest browser for AI agents to run browser automation, built for sharing your logged-in browser state with your AI agents, like Codex or Claude…
- [SMNETSTUDIO/WeChat-AI](https://github.com/SMNETSTUDIO/WeChat-AI) — WeChat AI - 自托管微信角色扮演对话服务
- [xxlllq/system_architect](https://github.com/xxlllq/system_architect) — :100: 2026年系统架构设计师（软考高级）备考资料。
- [james-6-23/codex2api](https://github.com/james-6-23/codex2api) — Codex2API 是一个基于 Go + Gin + React/Vite 的 Codex 反向代理与管理后台项目
- [Ebullioscopic/Atoll](https://github.com/Ebullioscopic/Atoll) — Dynamic Island for macOS
- [thaw-app/Thaw](https://github.com/thaw-app/Thaw) — The only app that owns your whole menu bar, in and out.
- [DingTalk-Real-AI/dingtalk-workspace-cli](https://github.com/DingTalk-Real-AI/dingtalk-workspace-cli) — DingTalk Workspace is an officially open-sourced cross-platform CLI tool from DingTalk. It unifies DingTalk’s full suite of product capabilities into…
- [block/buzz](https://github.com/block/buzz) — A hive mind communication platform
- [binaricat/Netcatty](https://github.com/binaricat/Netcatty) — SSH workspace, SFTP, and terminals in one
- [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset) — 1,324-exercise fitness dataset — animation GIFs, 180×180 thumbnails, muscle-group & equipment data, and step-by-step instructions in 6 languages. The…
- [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — A collection of DESIGN.md files analysis by popular brand design systems. Drop one into your project and let coding agents generate a matching UI.
- [Wei-Shaw/sub2api](https://github.com/Wei-Shaw/sub2api) — Sub2API 一站式开源中转服务，让 Claude、Openai 、Gemini、Grok订阅统一接入，支持拼车共享，更高效分摊成本，原生工具无缝使用。
- [rosemarycox5334-debug/PA_Agent](https://github.com/rosemarycox5334-debug/PA_Agent) — 暂无 GitHub 描述。
- [tt-a1i/archify](https://github.com/tt-a1i/archify) — Agent skill for beautiful, verifiable architecture, workflow, sequence, data-flow, and lifecycle diagrams—self-contained HTML with motion and crisp e…
- [git-ai-project/git-ai](https://github.com/git-ai-project/git-ai) — A Git extension for tracking the AI-generated code in your repos
- [chuspeeism/dashi-ppt-skill](https://github.com/chuspeeism/dashi-ppt-skill) — An AI-agent skill that generates browser-editable presentations from multiple visual themes, exportable to HTML, PDF, and PPTX.
- [yonggekkk/sing-box-yg](https://github.com/yonggekkk/sing-box-yg) — Sing-box精装桶五合一协议VPS专用脚本：三大独家功能！自签/acme双证书切换、Argo固定临时双隧道（可共存）、Psiphon赛风VPN（30个国家）分流功能、本地IP订阅生成
- [steipete/CodexBar](https://github.com/steipete/CodexBar) — Show usage stats for OpenAI Codex and Claude Code, without having to login.
- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) — Model Context Protocol Servers
- [helloianneo/ian-xiaohei-illustrations](https://github.com/helloianneo/ian-xiaohei-illustrations) — 中文小黑怪诞正文配图生成 Skill \| 16:9 白底手绘 \| 少量红橙蓝批注 \| Codex Skill
- [itgoyo/TelegramGroup](https://github.com/itgoyo/TelegramGroup) — 2026最新悄咪咪收集的10000+个Telegram群合集、tg导航、电报导航、telegram导航，附全网最有趣好用的机器人BOT🤖【tg10000.com】
- [a2ui-project/a2ui](https://github.com/a2ui-project/a2ui) — 暂无 GitHub 描述。
- [LearnPrompt/ai-news-radar](https://github.com/LearnPrompt/ai-news-radar) — 24h AI/tech news radar with GitHub Actions, live web UI, and Scout Skill for AI sources.
- [wbh604/UZI-Skill](https://github.com/wbh604/UZI-Skill) — 冰冷的钱就这样流进我温暖的口袋-游资（UZI）Skills — 让我们欢迎，股海贼王！66位投资大佬帮你看盘 · 22维数据 × 180条量化规则 × 17种机构分析方法 · A股/港股/美股
- [earendil-works/pi](https://github.com/earendil-works/pi) — AI agent toolkit: unified LLM API, agent loop, TUI, coding agent CLI
- [JCodesMore/ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template) — Clone any website with one command using AI coding agents
- [foryourhealth111-pixel/Vibe-Skills](https://github.com/foryourhealth111-pixel/Vibe-Skills) — Intelligent Skill routing and workflow orchestration for AI agents — +21.12 pp reward, −29.6% tokens on SkillsBench with DeepSeekV4Flash-VE.
- [dama-cyber/Casting-Workflow](https://github.com/dama-cyber/Casting-Workflow) — 暂无 GitHub 描述。
- [xiamuceer-j/MuMuAINovel](https://github.com/xiamuceer-j/MuMuAINovel) — 一款基于 AI 的智能小说创作助手，帮助你轻松创作精彩故事
- [fengshao1227/ccg-workflow](https://github.com/fengshao1227/ccg-workflow) — 多模型协作工作流引擎 — /ccg:go 一个命令，AI 自动分析意图、选择策略、编排 Codex + Gemini + Claude 协作执行
- [QLHazyCoder/FlowPilot](https://github.com/QLHazyCoder/FlowPilot) — Chrome扩展：支持GPT（Codex） / kiro / Grok自动注册、相关反代项目（CPA/Sub）回调上传
- [FoundZiGu/GuJumpgate](https://github.com/FoundZiGu/GuJumpgate) — 暂无 GitHub 描述。
- [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) — from vibe coding to agentic engineering - practice makes claude perfect
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) — Official, Anthropic-managed directory of high quality Claude Code Plugins.
- [koala73/worldmonitor](https://github.com/koala73/worldmonitor) — Real-time global intelligence dashboard. AI-powered news aggregation, geopolitical monitoring, and infrastructure tracking in a unified situational a…
- [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) — LLM 驱动的多市场股票智能分析系统：多源行情、实时新闻、决策看板与自动推送，支持零成本定时运行。 LLM-powered multi-market stock analysis system with multi-source market data, real-time news, decis…
- [xbtlin/ai-berkshire](https://github.com/xbtlin/ai-berkshire) — AI 时代的伯克希尔：基于 Claude Code / Codex 的价值投资研究框架。巴菲特·芒格·段永平·李录四大师方法论 + 多Agent并行研究。\| AI-era Berkshire: a value investing research framework built for Clau…
- [voocel/ainovel-cli](https://github.com/voocel/ainovel-cli) — ✨多agent实现全自动AI小说生成
- [obra/superpowers](https://github.com/obra/superpowers) — An agentic skills framework & software development methodology that works.
- [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) — AI turns documents or topics into real, native PowerPoint decks—with native shapes, transitions and animations, data-backed charts and tables on dema…
- [Waishnav/devspace](https://github.com/Waishnav/devspace) — Minimal Coding Agent Harness on MCP for ChatGPT, Claude, Hermes, Grok Bot, OpenClaw
- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — Production-grade engineering skills for AI coding agents.
- [serafimcloud/21st](https://github.com/serafimcloud/21st) — npm for design engineers: largest marketplace of shadcn/ui-based React Tailwind components, blocks and hooks
- [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — An AI skill that provides design intelligence for building professional UI/UX across multiple platforms.
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) — Vercel's official collection of agent skills
- [alvinunreal/oh-my-opencode-slim](https://github.com/alvinunreal/oh-my-opencode-slim) — Lean, fine tuned Opencode multi agent suite · Mix any models · Auto delegate tasks
- [code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) — OmO: Drop your tokens. Ultrawork. Done.
- [nimbalyst/nimbalyst](https://github.com/nimbalyst/nimbalyst) — Nimbalyst - The open-source visual workspace for Claude Code, Codex, and OpenCode. Run multiple coding agents in parallel, edit their work visually i…
- [nocobase/nocobase](https://github.com/nocobase/nocobase) — NocoBase is an open-source AI + no-code platform for building business systems fast. Instead of generating everything from scratch, AI works on top o…
- [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) — A complete AI agency at your fingertips - From frontend wizards to Reddit community ninjas, from whimsy injectors to reality checkers. Each agent is…
- [nolly-studio/cult-ui](https://github.com/nolly-studio/cult-ui) — Components crafted for Design Engineers. Styled using Tailwind CSS, fully compatible with Shadcn, and easy to integrate—just copy and paste. MIT 🤌
- [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) — A Claude Code plugin that shows what's happening - context usage, active tools, running agents, and todo progress
- [op7418/guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) — AI-agent Skill for generating polished HTML slide decks: editorial magazine and Swiss layouts, image prompts, social covers, and a WebGL/low-power pr…
- [mindfold-ai/Trellis](https://github.com/mindfold-ai/Trellis) — The best agent harness.
- [vercel-labs/skills](https://github.com/vercel-labs/skills) — The open agent skills tool - npx skills
- [epiral/bb-browser](https://github.com/epiral/bb-browser) — Your browser is the API. CLI + MCP server for AI agents to control Chrome with your login state.
- [op7418/Humanizer-zh](https://github.com/op7418/Humanizer-zh) — Humanizer 的汉化版本，Claude Code Skills，旨在消除文本中 AI 生成的痕迹。
- [blader/humanizer](https://github.com/blader/humanizer) — Agent skill that removes signs of AI-generated writing from text
- [zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides) — Create beautiful slides on the web using a coding agent's frontend skills
- [subframe7536/maple-font](https://github.com/subframe7536/maple-font) — Maple Mono: Open source monospace font with round corner, ligatures and Nerd-Font icons for IDE and terminal, fine-grained customization options. 带连字…
- [cloudflare/cloudflared](https://github.com/cloudflare/cloudflared) — Cloudflare Tunnel client
- [fawney19/Aether](https://github.com/fawney19/Aether) — 暂无 GitHub 描述。
- [garrytan/gstack](https://github.com/garrytan/gstack) — Use Garry Tan's exact Claude Code setup: 23 opinionated tools that serve as CEO, Designer, Eng Manager, Release Manager, Doc Engineer, and QA
- [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) — Git. Ship. Done - Core
- [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) — Taste-Skill - gives your AI good taste. stops the AI from generating boring, generic slop
- [qingchencloud/cftunnel](https://github.com/qingchencloud/cftunnel) — 全协议内网穿透 CLI — Cloud 模式免费 HTTP/WS 穿透 + Relay 模式自建中继 TCP/UDP 全协议 \| Cloudflare Tunnel + frp 双引擎
- [multica-ai/multica](https://github.com/multica-ai/multica) — Make humans and AI agents work as one team — open-source and self-hostable.
- [nexu-io/open-design](https://github.com/nexu-io/open-design) — 🎨 Best DeepSeek Harness Design Plugin. The open-source Claude Design alternative. 🖥️ Local-first desktop app. 🖼️ Your coding agent becomes the design…
- [sxyazi/yazi](https://github.com/sxyazi/yazi) — 💥 Blazing fast terminal file manager written in Rust, based on async I/O.
- [alchaincyf/nuwa-skill](https://github.com/alchaincyf/nuwa-skill) — 你想蒸馏的下一个员工，何必是同事。蒸馏任何人的思维方式——心智模型、决策启发式、表达DNA。Distill how anyone thinks.
- [alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design) — Huashu Design · HTML-native design skill for Claude Code · Claude Code 里 HTML 原生的设计 skill · 高保真原型 / 幻灯片 / 动画 + 20 设计哲学 + 5 维评审 + MP4 导出 · Agent-agnos…
- [router-for-me/Cli-Proxy-API-Management-Center](https://github.com/router-for-me/Cli-Proxy-API-Management-Center) — This is a WebUI interface based on CLI-Proxy-API, designed to simplify configuration modifications and runtime status monitoring.
- [jlcodes99/cockpit-tools](https://github.com/jlcodes99/cockpit-tools) — 🚀 通用 AI IDE 账号管理工具：支持 Antigravity / Codex / GitHub Copilot / Windsurf / Kiro / Cursor / Gemini-cli / CodeBuddy，多账号切换、配额监控、自动唤醒与多开实例管理。 🚀 Universal AI…
- [Regert888/gpt-auto-register](https://github.com/Regert888/gpt-auto-register) — 暂无 GitHub 描述。
- [DanOps-1/Gpt-Agreement-Payment](https://github.com/DanOps-1/Gpt-Agreement-Payment) — ChatGPT Plus/Team/Pro 订阅协议端到端重放工具集 · hCaptcha 视觉求解器 · 反欺诈机制实证研究 / End-to-end protocol replay toolkit for ChatGPT Plus/Team/Pro subscription with from…
- [jlcodes99/vscode-antigravity-cockpit](https://github.com/jlcodes99/vscode-antigravity-cockpit) — VS Code extension for monitoring Google Antigravity AI quotas. Features Webview dashboard, QuickPick mode, and quota grouping.
- [mattpocock/skills](https://github.com/mattpocock/skills) — Skills for Real Engineers. Straight from my .agents directory.
- [luongnv89/claude-howto](https://github.com/luongnv89/claude-howto) — A visual, example-driven guide to Claude Code — from basic concepts to advanced agents, with copy-paste templates that bring immediate value.
- [EvoLinkAI/awesome-gpt-image-2-API-and-Prompts](https://github.com/EvoLinkAI/awesome-gpt-image-2-API-and-Prompts) — GPT-Image-2 API and Prompts
- [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) — Official Compound Engineering plugin for Claude Code, Codex, Cursor, and more
- [TokenRhythm/opensquilla](https://github.com/TokenRhythm/opensquilla) — OpenSquilla — Token-Efficient AI Agent with same budget, higher intelligence density
- [SuperClaude-Org/SuperClaude_Framework](https://github.com/SuperClaude-Org/SuperClaude_Framework) — A configuration framework that enhances Claude Code with specialized commands, cognitive personas, and development methodologies.
- [wshobson/agents](https://github.com/wshobson/agents) — Multi-harness agentic plugin marketplace for Claude Code, Codex, Cursor, OpenCode, GitHub Copilot, and Google Antigravity
- [Yeachan-Heo/oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex) — OmX - Oh My codeX: Your codex is not alone. Add hooks, agent teams, HUDs, and so much more.
- [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) — Breakthrough Method for Agile Ai Driven Development
- [Dailin521/codex-provider-sync](https://github.com/Dailin521/codex-provider-sync) — Synchronize Codex session provider metadata across rollout files and SQLite state.
- [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) — 🪨 why use many token when few token do trick — Claude Code skill that cuts 65% of tokens by talking like caveman
- [opendatalab/MinerU](https://github.com/opendatalab/MinerU) — Transforms complex documents like PDFs and Office docs into LLM-ready markdown/JSON for your Agentic workflows.
- [Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) — Graphs that teach > graphs that impress. Turn any code into an interactive knowledge graph you can explore, search, and ask questions about. Works wi…
- [QuantumNous/new-api](https://github.com/QuantumNous/new-api) — A unified AI model hub for aggregation & distribution. It supports cross-converting various LLMs into OpenAI-compatible, Claude-compatible, or Gemini…
- [zarazhangrui/follow-builders](https://github.com/zarazhangrui/follow-builders) — AI builders digest — monitors top AI builders on X and YouTube podcasts, remixes their content into digestible summaries. Follow builders, not influe…
- [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) — Give your AI agent eyes to see the entire internet. Read & search Twitter, Reddit, YouTube, GitHub, Bilibili, XiaoHongShu — one CLI, zero API fees.
- [jnMetaCode/agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh) — 🎭 267 个即插即用的 AI 专家角色 — 支持 Hermes Agent/Claude Code/Cursor/Copilot 等 18 种工具，覆盖工程/设计/营销/金融等 20 个部门。含 52 个中国市场原创智能体（小红书/抖音/微信/飞书/钉钉等）。搭配编排器 agency-orche…
- [router-for-me/CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI) — Wrap Antigravity, ChatGPT Codex, Claude Code, Grok Build as an OpenAI/Gemini/Claude/Codex compatible API service, allowing you to enjoy the free Gemi…
- [KKKKhazix/khazix-skills](https://github.com/KKKKhazix/khazix-skills) — 数字生命卡兹克开源的 AI Skills 合集 \| Agent Skills: leader（帮你定义目标）, neat-freak 洁癖, hv-analysis, khazix-writer & more — Claude Code, Codex & 40+ agents
- [abhigyanpatwari/GitNexus](https://github.com/abhigyanpatwari/GitNexus) — GitNexus: The Zero-Server Code Intelligence Engine - GitNexus is a client-side knowledge graph creator that runs entirely in your browser. Drop in a…
- [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) — The agent that grows with you
- [ConardLi/garden-skills](https://github.com/ConardLi/garden-skills) — ConardLi's open-source Skills collection, featuring web design, knowledge retrieval, image generation, and more.
- [shareAI-lab/learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) — Bash is all you need - A nano claude code–like 「agent harness」, built from 0 to 1
- [affaan-m/ECC](https://github.com/affaan-m/ECC) — The agent harness performance optimization system. Skills, instincts, memory, security, and research-first development for Claude Code, Codex, Openco…
- [sudhakar3697/awesome-electron-alternatives](https://github.com/sudhakar3697/awesome-electron-alternatives) — A curated list of awesome Electron alternatives.
- [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code) — Drop in a screenshot and convert it to clean code (HTML/Tailwind/React/Vue)
- [ai/nanoid](https://github.com/ai/nanoid) — A tiny (118 bytes), secure, URL-friendly, unique string ID generator for JavaScript
- [PlayCover/keymaps](https://github.com/PlayCover/keymaps) — A collection of community made keymaps for PlayCover.
- [swc-project/swc](https://github.com/swc-project/swc) — Rust-based platform for the Web
- [BetaSu/fe-hunter](https://github.com/BetaSu/fe-hunter) — 每天一道题，3个月后，你就是面试小能手，答题还能赚钱哦
- [ineo6/hosts](https://github.com/ineo6/hosts) — GitHub最新hosts。解决GitHub图片无法显示，加速GitHub网页浏览。
- [jaywcjlove/awesome-mac](https://github.com/jaywcjlove/awesome-mac) —  This project is dedicated to collecting high-quality macOS software and organizing them systematically by different categories for easy search and…
- [qianguyihao/Web](https://github.com/qianguyihao/Web) — 千古前端图文教程，超详细的前端入门到进阶知识库。从零开始学前端，做一名精致优雅的前端工程师。
- [BetaSu/big-react](https://github.com/BetaSu/big-react) — 跟着我，从0实现React18
- [solidjs/solid](https://github.com/solidjs/solid) — A declarative, efficient, and flexible JavaScript library for building user interfaces.
- [sveltejs/svelte](https://github.com/sveltejs/svelte) — web development for the rest of us
- [pwstrick/daily](https://github.com/pwstrick/daily) — 一份搜集的前端面试题目清单、面试相关以及各类学习的资料（不局限于前端）
- [electron-react-boilerplate/electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) — A Foundation for Scalable Cross-Platform Apps
- [BetaSu/just-react](https://github.com/BetaSu/just-react) — 「React技术揭秘」 一本自顶向下的React源码分析书
- [a597873885/webfunny_monitor](https://github.com/a597873885/webfunny_monitor) — 【免费社区版】【企业版】Webfunny是一款集全链路监控和埋点系统于一体的大数据分析系统，我们致力于解决线上的疑难杂症和精细化分析业务数据；监控系统面向技术、埋点系统面向业务，两者配合使用，相得益彰。
- [chinanf-boy/didact-explain](https://github.com/chinanf-boy/didact-explain) — 🇨🇳翻译: 「 Didact 」 DIY React ❤ 更新 ✔
- [nilbuild/developer-roadmap](https://github.com/nilbuild/developer-roadmap) — Interactive roadmaps, guides and other educational content to help developers grow in their careers.
- [codecrafters-io/build-your-own-x](https://github.com/codecrafters-io/build-your-own-x) — Master programming by recreating your favorite technologies from scratch.
- [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms) — 📝 Algorithms and data structures implemented in JavaScript with explanations and links to further readings
- [awesome-vpn/awesome-vpn](https://github.com/awesome-vpn/awesome-vpn) — Free proxy node aggregator. Daily updated vmess/vless/trojan/ss. 免费 代理节点 翻墙 梯子 科学上网 机场订阅 网络加速 VPN 免翻墙每日更新 一键导入
- [HerbertKarajan/Fe-Interview-questions](https://github.com/HerbertKarajan/Fe-Interview-questions) — 目前最全的前端开发面试题及答案
- [BingKui/javascript-zh](https://github.com/BingKui/javascript-zh) — Airbnb 出品，目前非常流行的 JavaScript 代码规范（中文版）。其内对各种 js 范式的写法进行了详细的规定与说明，按照此规范写出的代码将会更加合理。
- [ljianshu/Blog](https://github.com/ljianshu/Blog) — 关注基础知识，打造优质前端博客，公众号[前端工匠]的作者
- [poetries/FE-Interview-Questions](https://github.com/poetries/FE-Interview-Questions) — 关注公众号「前端进阶之旅」，一起学习。前端面试常考问题整理，按模块知识点分类 Front-end-Developer-Questions by Modules and knowledge
- [youngwind/blog](https://github.com/youngwind/blog) — 梁少峰的个人博客
- [fouber/blog](https://github.com/fouber/blog) — 没事写写文章，喜欢的话请点star，想订阅点watch，千万别fork！
- [ustbhuangyi/vue-analysis](https://github.com/ustbhuangyi/vue-analysis) — :thumbsup: Vue.js 源码分析
- [jawil/blog](https://github.com/jawil/blog) — Too young, too simple. Sometimes, naive & stupid 🐌
- [Advanced-Frontend/Daily-Interview-Question](https://github.com/Advanced-Frontend/Daily-Interview-Question) — 我是依扬（木易杨），公众号「高级前端进阶」作者，每天搞定一道前端大厂面试题，祝大家天天进步，一年后会看到不一样的自己。
- [stephentian/33-js-concepts](https://github.com/stephentian/33-js-concepts) — :scroll: 每个 JavaScript 工程师都应懂的33个概念 @leonardomso
- [lihongxun945/myblog](https://github.com/lihongxun945/myblog) — 言川的博客-前端工程师的笔记
- [lihongxun945/diving-into-webpack](https://github.com/lihongxun945/diving-into-webpack) — webpack 源码解析系列
- [fex-team/interview-questions](https://github.com/fex-team/interview-questions) — FEX 面试问题
- [LeetCode-OpenSource/vscode-leetcode](https://github.com/LeetCode-OpenSource/vscode-leetcode) — Solve LeetCode problems in VS Code
- [xcatliu/typescript-tutorial](https://github.com/xcatliu/typescript-tutorial) — TypeScript 入门教程
- [phobal/ivideo](https://github.com/phobal/ivideo) — 一个可以观看国内主流视频平台所有视频的客户端（Mac、Windows、Linux） A client that can watch video of domestic(China) mainstream video platform
- [chenshenhai/koa2-note](https://github.com/chenshenhai/koa2-note) — 《Koa2进阶学习笔记》已完结🎄🎄🎄
- [ProtoTeam/blog](https://github.com/ProtoTeam/blog) — 蚂蚁数据体验技术团队的文章仓库
- [sudheerj/reactjs-interview-questions](https://github.com/sudheerj/reactjs-interview-questions) — List of top 500 ReactJS Interview Questions & Answers....Coding exercise questions are coming soon!!
- [icepy/Front-End-Develop-Guide](https://github.com/icepy/Front-End-Develop-Guide) — 💰 Awesome The Front End Develop Guide：这份指南汇集了前端开发所使用语言的主流学习资源，并以开发者的视角进行整理编排而成。
- [webpack-china/awesome-webpack-cn](https://github.com/webpack-china/awesome-webpack-cn) — [印记中文](https://docschina.org/) - webpack 优秀中文文章
- [521xueweihan/git-tips](https://github.com/521xueweihan/git-tips) — :trollface:Git的奇技淫巧
- [DMQ/mvvm](https://github.com/DMQ/mvvm) — 剖析vue实现原理，自己动手实现mvvm
- [Louiszhai/tool](https://github.com/Louiszhai/tool) — 开发效率提升：Mac生产力工具链推荐
- [yjhjstz/deep-into-node](https://github.com/yjhjstz/deep-into-node) — In-depth understanding of Node.js: Core Ideas and Source Code Analysis
- [EtherDream/jsproxy](https://github.com/EtherDream/jsproxy) — An online proxy based on ServiceWorker
- [ruanyf/weekly](https://github.com/ruanyf/weekly) — 科技爱好者周刊，每周五发布
- [zhaoolee/ChromeAppHeroes](https://github.com/zhaoolee/ChromeAppHeroes) — 🌈谷粒-Chrome插件英雄榜, 为优秀的Chrome插件写一本中文说明书, 让Chrome插件英雄们造福人类~ ChromePluginHeroes, Write a Chinese manual for the excellent Chrome plugin, let the Chrome p…
- [azl397985856/leetcode](https://github.com/azl397985856/leetcode) — LeetCode Solutions: A Record of My Problem Solving Journey.( leetcode题解，记录自己的leetcode解题之路。)
- [NervJS/taro](https://github.com/NervJS/taro) — 开放式跨端跨框架解决方案，支持使用 React/Vue 等框架来开发微信/京东/百度/支付宝/字节跳动/ QQ 小程序/H5/React Native 等应用。
- [jaywcjlove/github-rank](https://github.com/jaywcjlove/github-rank) — 🕷️Github China/Global User Ranking, Global Warehouse Star Ranking (Github Action is automatically updated daily).
- [jaywcjlove/FED](https://github.com/jaywcjlove/FED) — ✪ 这是一个很酷炫的前端网站搜集器，导航网 http://jaywcjlove.github.io/FED
- [soulmachine/leetcode](https://github.com/soulmachine/leetcode) — LeetCode题解，151道题完整版。
- [wangzheng0822/algo](https://github.com/wangzheng0822/algo) — 数据结构和算法必知必会的50个代码实现
- [hk029/leetbook](https://github.com/hk029/leetbook) — LeetCode题解开源书《LeetBook》
- [javaswing/NeteaseCloudWebApp](https://github.com/javaswing/NeteaseCloudWebApp) — This is a vue for NeteaseCloud projects!
- [mqyqingfeng/Blog](https://github.com/mqyqingfeng/Blog) — 冴羽写博客的地方，预计写四个系列：JavaScript深入系列、JavaScript专题系列、ES6系列、React系列。
- [trazyn/ieaseMusic](https://github.com/trazyn/ieaseMusic) — 网易云音乐第三方
- [jimuyouyou/node-interview-questions](https://github.com/jimuyouyou/node-interview-questions) — Node.js面试题，侧重后端应用与对Node核心的理解
- [algorithm-visualizer/algorithm-visualizer](https://github.com/algorithm-visualizer/algorithm-visualizer) — :fireworks:Interactive Online Platform that Visualizes Algorithms from Code
- [stone0090/alibaba-interview](https://github.com/stone0090/alibaba-interview) — 阿里巴巴面试资源汇总
- [JacksonTian/fks](https://github.com/JacksonTian/fks) — 前端技能汇总 Frontend Knowledge Structure
- [DDFE/DDFE-blog](https://github.com/DDFE/DDFE-blog) — :clap: welcome to DDFE's blog
- [answershuto/learnVue](https://github.com/answershuto/learnVue) — :octocat:Vue.js 源码解析
- [chyingp/nodejs-learning-guide](https://github.com/chyingp/nodejs-learning-guide) — Nodejs学习笔记以及经验总结，公众号"程序猿小卡"
- [ygs-code/vue](https://github.com/ygs-code/vue) — vue源码逐行注释分析+40多m的vue源码程序流程图思维导图(vue source code line by line annotation analysis +40 + m vue source code process flow chart mind map)
- [haizlin/fe-interview](https://github.com/haizlin/fe-interview) — 前端面试每日 3+1，以面试题来驱动学习，提倡每日学习与思考，每天进步一点！每天早上5点纯手工发布面试题（死磕自己，愉悦大家），6000+道前端面试题全面覆盖，HTML/CSS/JavaScript/Vue/React/Nodejs/TypeScript/ECMAScritpt/Webpack/J…
- [nonstriater/Learn-Algorithms](https://github.com/nonstriater/Learn-Algorithms) — 算法学习笔记
- [xiaolai/regular-investing-in-box](https://github.com/xiaolai/regular-investing-in-box) — 定投改变命运 —— 让时间陪你慢慢变富 https://onregularinvesting.com
- [ruanyf/free-books](https://github.com/ruanyf/free-books) — 互联网上的免费书籍
- [lessfish/leetcode](https://github.com/lessfish/leetcode) — :pencil2: LeetCode solutions with JavaScript
- [ConardLi/awesome-coding-js](https://github.com/ConardLi/awesome-coding-js) — Algorithms and data structures implemented in JavaScript, with detailed explanations and tutorials
- [azl397985856/fe-interview](https://github.com/azl397985856/fe-interview) — 宇宙最强的前端面试指南 (https://lucifer.ren/fe-interview)
- [perkfly/reverse-interview-zh](https://github.com/perkfly/reverse-interview-zh) — 技术面试最后反问面试官的话
- [biaochenxuying/awesome-books](https://github.com/biaochenxuying/awesome-books) — 技术类精华书单推荐，包括 前端、后端、数据结构与算法、计算机基础、设计模式、数据库等书籍。
- [puppeteer/puppeteer](https://github.com/puppeteer/puppeteer) — JavaScript API for Chrome and Firefox
- [public-apis/public-apis](https://github.com/public-apis/public-apis) — A collective list of free APIs
- [FrontEndGitHub/FrontEndGitHub](https://github.com/FrontEndGitHub/FrontEndGitHub) — :octocat:GitHub最全的前端资源汇总仓库（包括前端学习、开发资源、数据结构与算法、开发工具、求职面试等）
- [SocialSisterYi/bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect) — 暂无 GitHub 描述。
- [biaochenxuying/preferential-courses](https://github.com/biaochenxuying/preferential-courses) — 以最优惠的方式购买极客时间课程，涵盖了后端、架构、前端、移动、人工智能、大数据、产品、运营、运维、测试等
- [shfshanyue/blog](https://github.com/shfshanyue/blog) — 在这里写一些工作中遇到的前端，后端以及运维的问题
- [ruochuan12/blog](https://github.com/ruochuan12/blog) — 若川的博客—撰写了学习源码整体架构系列几十篇。组织了源码共读活动，每周一起学习200行左右的源码，加我微信 ruochuan02 参与。
- [shfshanyue/Daily-Question](https://github.com/shfshanyue/Daily-Question) — 互联网大厂内推及大厂面经整理，并且每天一道面试题推送。每天五分钟，半年大厂中
- [mechaniac/Map-of-Javascript](https://github.com/mechaniac/Map-of-Javascript) — Javascript on one sheet. (and one for algorithms)
- [h5bp/Front-end-Developer-Interview-Questions](https://github.com/h5bp/Front-end-Developer-Interview-Questions) — A list of helpful front-end related questions you can use to interview potential candidates, test yourself or completely ignore.
- [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) — 网易云音乐 Node.js API service
- [evanw/esbuild](https://github.com/evanw/esbuild) — An extremely fast bundler for the web
- [juicecube/mshared](https://github.com/juicecube/mshared) — 前端状态管理方案，支持微前端通信；适用于（乾坤）
- [jorangreef/sudo-prompt](https://github.com/jorangreef/sudo-prompt) — Run a command using sudo, prompting the user with an OS dialog if necessary.
- [yygmind/blog](https://github.com/yygmind/blog) — 我是木易杨，公众号「高级前端进阶」作者，跟着我每周重点攻克一个前端面试重难点。接下来让我带你走进高级前端的世界，在进阶的路上，共勉！
- [ascoders/weekly](https://github.com/ascoders/weekly) — 前端精读周刊。帮你理解最前沿、实用的技术。
- [FrankFang/best-chinese-front-end-blogs](https://github.com/FrankFang/best-chinese-front-end-blogs) — 收集优质的中文前端博客
- [ruanyf/jstraining](https://github.com/ruanyf/jstraining) — 全栈工程师培训材料
- [kawhiGuo/kawhiGuo.github.io](https://github.com/kawhiGuo/kawhiGuo.github.io) — 个人博客
- [xitu/gold-miner](https://github.com/xitu/gold-miner) — 🥇掘金翻译计划，可能是世界最大最好的英译中技术社区，最懂读者和译者的翻译平台：
- [Brooooooklyn/learning-rxjs](https://github.com/Brooooooklyn/learning-rxjs) — Learning RxJS step by step
- [facebookarchive/flux](https://github.com/facebookarchive/flux) — Application Architecture for Building User Interfaces
- [voronianski/flux-comparison](https://github.com/voronianski/flux-comparison) — :pencil: Practical comparison of different Flux solutions
- [mzlogin/chinese-copywriting-guidelines](https://github.com/mzlogin/chinese-copywriting-guidelines) — Chinese Copywriting Guidelines：中文文案排版指北（简体中文版）
- [adam-golab/react-developer-roadmap](https://github.com/adam-golab/react-developer-roadmap) — Roadmap to becoming a React developer
- [electron-userland/electron-builder](https://github.com/electron-userland/electron-builder) — A complete solution to package and build a ready for distribution Electron app with “auto update” support out of the box
- [decaffeinate/decaffeinate](https://github.com/decaffeinate/decaffeinate) — Goodbye CoffeeScript, hello JavaScript!
- [ryanmcdermott/clean-code-javascript](https://github.com/ryanmcdermott/clean-code-javascript) — Clean Code concepts adapted for JavaScript
- [InterviewMap/CS-Interview-Knowledge-Map](https://github.com/InterviewMap/CS-Interview-Knowledge-Map) — Build the best interview map. The current content includes JS, network, browser related, performance optimization, security, framework, Git, data str…
- [sequelize/sequelize-typescript](https://github.com/sequelize/sequelize-typescript) — Decorators and some other features for sequelize
- [microsoft/TypeScript-Vue-Starter](https://github.com/microsoft/TypeScript-Vue-Starter) — A starter template for TypeScript and Vue with a detailed README describing how to use the two together.
- [oe/mac-env](https://github.com/oe/mac-env) — [WIP] make your brand new Mac ready for work by one script
- [livoras/blog](https://github.com/livoras/blog) — Too young, too simple. Sometimes, naive.
- [Chalarangelo/30-seconds-of-code](https://github.com/Chalarangelo/30-seconds-of-code) — Coding articles to level up your development skills
- [wotermelon/toJump](https://github.com/wotermelon/toJump) — nodejs版本玩微信跳一跳小游戏
- [SortableJS/Sortable](https://github.com/SortableJS/Sortable) — Reorderable drag-and-drop lists for modern browsers and touch devices. No jQuery or framework required.
- [SortableJS/Vue.Draggable](https://github.com/SortableJS/Vue.Draggable) — Vue drag-and-drop component based on Sortable.js
- [sagalbot/vue-sortable](https://github.com/sagalbot/vue-sortable) — A lightweight directive for reorderable drag-and-drop lists using RubaXa/Sortable
- [yeasy/docker_practice](https://github.com/yeasy/docker_practice) — 最新Docker容器技术，从真实案例中学习最佳实践！\| Learn and understand Docker&Container technologies, with real DevOps practice!
- [hilongjw/vue-progressbar](https://github.com/hilongjw/vue-progressbar) — A lightweight progress bar for vue
- [eggjs/egg](https://github.com/eggjs/egg) — 🥚🥚🥚🥚 Born to build better enterprise frameworks and apps with Node.js & Koa. https://307.run/eggcode
- [koajs/jwt](https://github.com/koajs/jwt) — Koa middleware for validating JSON Web Tokens
- [zemirco/json2csv](https://github.com/zemirco/json2csv) — Convert json to csv with column titles
- [dominhhai/koa-log4js](https://github.com/dominhhai/koa-log4js) — log4js-node supports Koa-middleware
- [STRML/node-xlsx-writestream](https://github.com/STRML/node-xlsx-writestream) — Simple XLSX writer for Node.js.
- [functionscope/Node-Excel-Export](https://github.com/functionscope/Node-Excel-Export) — A simple node.js module for exporting data set to Excel xlsx file.
- [mgcrea/node-xlsx](https://github.com/mgcrea/node-xlsx) — NodeJS excel file parser & builder
- [ustbhuangyi/better-scroll](https://github.com/ustbhuangyi/better-scroll) — :scroll: inspired by iscroll, and it supports more features and has a better scroll perfermance
- [sequelize/sequelize](https://github.com/sequelize/sequelize) — Feature-rich ORM for modern Node.js and TypeScript, it supports PostgreSQL (with JSON and JSONB support), MySQL, MariaDB, SQLite, MS SQL Server, Snow…
- [request/request](https://github.com/request/request) — 🏊🏾 Simplified HTTP request client.
- [i5ting/vsc](https://github.com/i5ting/vsc) — Visual Studio Code Guide[Simple Chinese][简体中文]
- [ElemeFE/node-interview](https://github.com/ElemeFE/node-interview) — How to pass the Node.js interview of ElemeFE.
- [koajs/koa](https://github.com/koajs/koa) — Expressive middleware for node.js using ES2017 async functions
- [xwartz/wechat-app-demo](https://github.com/xwartz/wechat-app-demo) — 📱微信小程序 demo
- [lessfish/underscore-analysis](https://github.com/lessfish/underscore-analysis) — underscore-1.8.3.js 源码解读 & 系列文章（完）

<!-- STAR_VAULT:CATALOG:END -->
