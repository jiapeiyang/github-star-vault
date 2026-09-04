# 首批 30 个项目分类草案

> 日期：2026-09-05；状态：待用户逐项确认。
> 草案完成 **30**；用户确认 **0**；正式导入 **0**。
> 现有 6 份人工内容保持原样，另列校准清单。本文件不会被网站目录构建读取。

## 依据与选择方式

从本地 active 284 个项目中排除已有 6 份策展内容，选最近收藏 15 个；从 2024 年之前的历史收藏中选择 Web/工程项目 10 个；再选择网络、内容创作、健身数据和容器领域 5 个，全部按 repo_id 去重。

30 个仓库的公开 API 描述与 Topics 均已于本轮重新读取，事实存于 [上游核查证据](../evidence/2026-09-05-curation-batch-01.json)。描述过于简略的 firstmate、bb、Svelte 额外阅读了官方 README。功能说明为上游介绍，不代表安装测试或对效果的独立背书。

分类依据项目主要用途；实现语言不充当主分类。以下“客观用途”是描述草案，尚不是你的收藏理由。所有条目的学习阶段、个人价值和实践结论均待你确认，不默认设为已学习。

## 最近收藏 15 个

| 编号 / repo_id | 仓库与上游依据 | 候选分类 / 类型 | 候选标签 | 客观用途 | 待确认问题 |
|---|---|---|---|---|---|
| 01 / `1325096132` | [eternityspring/shuohao-skills](https://github.com/eternityspring/shuohao-skills) | `design-content` / `collection` | 短剧、分镜、Agent Skills | 短剧创作流程的 Skills 集合，覆盖角色、剧本与分镜。 | 主要用途是内容创作，还是研究 Agent 工作流？ |
| 02 / `1142983825` | [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) | `devtools-automation` / `template` | Claude Code、编码规范 | 用 CLAUDE.md 提供编码智能体行为约定。 | 作为编码配置参考，还是准备实际采用？ |
| 03 / `1119232564` | [yzfly/awesome-skills-zh](https://github.com/yzfly/awesome-skills-zh) | `ai-agent` / `collection` | Agent Skills、中文资源 | 中文 Agent Skills 与工具资源目录。 | 与其他合集重叠时，哪个作为主要入口？ |
| 04 / `1120540348` | [libukai/awesome-agent-skills](https://github.com/libukai/awesome-agent-skills) | `ai-agent` / `collection` | Agent Skills、指南 | Agent Skills 入门与资源推荐合集。 | 主要需要入门指南还是持续查询资源？ |
| 05 / `1226123343` | [virgiliojr94/book-to-skill](https://github.com/virgiliojr94/book-to-skill) | `ai-agent` / `app` | 知识管理、PDF、Agent Skills | 把技术书籍 PDF 转为可供智能体使用的 Skill。 | 计划用哪本书验证效果？ |
| 06 / `1182353280` | [deusyu/translate-book](https://github.com/deusyu/translate-book) | `design-content` / `app` | 图书翻译、文档处理 | 针对整本 PDF、DOCX、EPUB 的翻译 Skill。 | 主要是翻译需求，还是研究多智能体编排？ |
| 07 / `1241257629` | [datawhalechina/Agent-Learning-Hub](https://github.com/datawhalechina/Agent-Learning-Hub) | `ai-agent` / `collection` | 学习路线、Agent | 汇集 Agent 学习路线和资料。 | 是否作为个人 Agent 学习路线入口？ |
| 08 / `1052050442` | [datawhalechina/hello-agents](https://github.com/datawhalechina/hello-agents) | `ai-agent` / `learning` | Agent、RAG、实践教程 | 从零构建智能体的原理与实践教程。 | 哪些章节准备学习，哪些已经读过？ |
| 09 / `1212163658` | [kangarooking/cangjie-skill](https://github.com/kangarooking/cangjie-skill) | `ai-agent` / `app` | 知识蒸馏、Agent Skills | 将图书、长视频和播客内容转为 Skills。 | 与 book-to-skill 分别保留什么用途？ |
| 10 / `1266884317` | [kunchenguid/firstmate](https://github.com/kunchenguid/firstmate/blob/main/README.md) | `devtools-automation` / `template` | 多智能体、任务编排、工作区 | 以指令、Skills 和工具目录组织编码智能体团队；上游定义为 agent distro。 | 现有协作流程中是否有可替代的具体环节？ |
| 11 / `1135791677` | [lsdefine/GenericAgent](https://github.com/lsdefine/GenericAgent) | `ai-agent` / `app` | 桌面自动化、Agent、技能树 | 围绕电脑操作和任务自动化构建智能体与技能树。 | 先验证何种任务？效率宣传尚未独立验证。 |
| 12 / `1062356571` | [tw93/Mole](https://github.com/tw93/Mole) | `devtools-automation` / `app` | macOS、系统维护、命令行 | 用于 Mac 清理、卸载、分析和监控。 | 实际使用过哪些命令，哪些仅作参考？ |
| 13 / `1305545535` | [HalfAI1102/anthropic-art](https://github.com/HalfAI1102/anthropic-art) | `design-content` / `app` | 插画、视觉规范、Agent Skills | 按 Anthropic 风格和配色规则生成编辑插画。 | 是否准备作为实际内容创作工具？ |
| 14 / `1312807575` | [miuuyy/codex-chatgpt-web](https://github.com/miuuyy/codex-chatgpt-web) | `devtools-automation` / `app` | Codex、ChatGPT、模型接入 | 将 ChatGPT Web 接入 Codex 的桥接工具。 | 是否仅研究接入机制？不把上游额度宣传作为已验证结果。 |
| 15 / `1166119443` | [get-bb/bb](https://github.com/get-bb/bb/blob/main/README.md) | `devtools-automation` / `app` | IDE、Agent、任务工作区 | 提供桌面、Web、CLI 和 HTTP API 入口的智能体 IDE。 | 是否与现有开发工具重复？ |

## 历史 Web 与工程项目 10 个

| 编号 / repo_id | 仓库与上游依据 | 候选分类 / 类型 | 候选标签 | 客观用途 | 待确认问题 |
|---|---|---|---|---|---|
| 16 / `99401299` | [ai/nanoid](https://github.com/ai/nanoid) | `web-client` / `library` | 唯一标识、工具库 | 生成紧凑的 URL 友好字符串 ID。 | 需要实际使用指南还是实现原理？ |
| 17 / `115110181` | [swc-project/swc](https://github.com/swc-project/swc) | `web-client` / `library` | 编译器、构建工具 | 面向 Web 工程的编译与解析工具链。 | 关注构建接入还是编译器实现？ |
| 18 / `77912349` | [qianguyihao/Web](https://github.com/qianguyihao/Web) | `web-client` / `learning` | 前端入门、图文教程 | 前端入门到进阶的图文知识库。 | 作为查阅资料还是系统学习？ |
| 19 / `232981344` | [BetaSu/big-react](https://github.com/BetaSu/big-react) | `web-client` / `learning` | React、实现原理 | 通过从零实现 React 学习框架机制。 | 学习进展需要你确认。 |
| 20 / `130884470` | [solidjs/solid](https://github.com/solidjs/solid) | `web-client` / `library` | 响应式、UI、细粒度更新 | 用于构建声明式用户界面的响应式库。 | 准备比较框架设计还是用于项目？ |
| 21 / `74293321` | [sveltejs/svelte](https://github.com/sveltejs/svelte/blob/main/README.md) | `web-client` / `library` | 编译器、组件、UI | 把声明式组件编译为更新 DOM 的 JavaScript。 | 以实践或框架原理为主？ |
| 22 / `196664765` | [pwstrick/daily](https://github.com/pwstrick/daily) | `web-client` / `collection` | 面试、学习资料 | 以前端为主的面试题与学习资料集合。 | 是否仍有面试复习需求？ |
| 23 / `35810174` | [electron-react-boilerplate/electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) | `web-client` / `template` | Electron、React、桌面应用 | 基于 Electron 与 React 的跨平台应用脚手架。 | 是否需要用于真实桌面项目？ |
| 24 / `268195786` | [BetaSu/just-react](https://github.com/BetaSu/just-react) | `web-client` / `learning` | React、Fiber、Hooks | 以自顶向下方式讲解 React 源码。 | 已阅读哪些主题？ |
| 25 / `132750724` | [codecrafters-io/build-your-own-x](https://github.com/codecrafters-io/build-your-own-x) | `cs-engineering` / `collection` | 动手实现、工程原理、教程 | 通过自行实现技术组件学习原理的教程索引。 | 先选哪一类技术作为实践目标？ |

## 其他领域 5 个

| 编号 / repo_id | 仓库与上游依据 | 候选分类 / 类型 | 候选标签 | 客观用途 | 待确认问题 |
|---|---|---|---|---|---|
| 26 / `494305627` | [hwdsl2/wireguard-install](https://github.com/hwdsl2/wireguard-install) | `infra-security` / `app` | WireGuard、VPN、安装部署 | 部署 WireGuard 服务并管理客户端的脚本。 | 需要部署还是仅作参考？ |
| 27 / `237523442` | [tailscale/tailscale](https://github.com/tailscale/tailscale) | `infra-security` / `app` | WireGuard、VPN、组网 | 基于 WireGuard 的组网工具。 | 是否有明确的设备互联场景？ |
| 28 / `770153867` | [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | `design-content` / `app` | 短视频、自动化、内容创作 | 根据主题生成短视频的 AI 工作流工具。 | 是否有具体内容生产任务？ |
| 29 / `1184892122` | [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset) | `business-domain` / `collection` | 健身、动作库、数据集 | 提供健身动作、器械与肌群信息的结构化数据集。 | 用于健身产品开发还是个人学习？ |
| 30 / `23689830` | [yeasy/docker_practice](https://github.com/yeasy/docker_practice) | `infra-security` / `learning` | Docker、容器、DevOps | Docker 与容器技术的实践学习资料。 | 需要系统阅读还是按问题查阅？ |

## 如何确认

可以按编号回复，例如“01 的分类和类型接受，阶段设为 reference；我的收藏理由是……”。如果一次确认多条，可给一个明确的共同阶段，但个人学习结论必须以真实阅读或实践为依据。未确认的项目保持在 imported。

分类代码沿用 config/categories.json：ai-agent 为 AI 与 Agent，web-client 为 Web/前端/跨端，devtools-automation 为开发者工具与自动化，design-content 为设计/图像/内容创作，infra-security 为基础设施/网络/安全，cs-engineering 为计算机基础与工程实践，business-domain 为商业与行业应用。

类型代码：app 工具；library 库/框架；template 模板/脚手架；learning 教程/书籍/课程；collection 合集/数据集。

## 现有 6 份策展记录校准

这些内容已存在于 v1。当前未找到逐条确认依据，因此不把现有阶段等同于你已经认可的学习状态，也不擅自改写。

| 文件 | 当前阶段 | 当前价值说明 | 需要确认 |
|---|---|---|---|
| [1061953414](../content/repos/1061953414.md) | `queued` | 用于对照 Agent Skills 的目录结构、能力边界与写作规范。 | 阶段和价值说明是否符合你的真实意图？ |
| [1116260703](../content/repos/1116260703.md) | `reference` | 作为 Claude Code 规格驱动流程的上游归档样例，仅在对比同类方案时查阅。 | 阶段和价值说明是否符合你的真实意图？ |
| [1193909050](../content/repos/1193909050.md) | `learning` | 观察多 Agent 终端工作区如何组织上下文、任务和协作。 | 是否正在学习？现有判断与你的实际目标是否一致？ |
| [227978903](../content/repos/227978903.md) | `learned` | 组合式 API 设计紧凑，适合观察可复用 Hook 的命名和边界。 | 是否确实学习完成？现有结论是否来自你的实际学习？ |
| [561730219](../content/repos/561730219.md) | `reference` | 需要回顾算法概念时，从图解和可运行代码快速进入。 | 阶段和价值说明是否符合你的真实意图？ |
| [62892221](../content/repos/62892221.md) | `reference` | 用于回看早期 React 客户端框架的组织方式，并验证上游归档项目仍能被检索。 | 阶段和价值说明是否符合你的真实意图？ |

## 确认后执行

1. 只为已确认条目创建或更新 content/repos/<repo_id>.md，保留未确认条目。
2. 运行事实与内容校验、重新生成目录和 README，检查分类、阶段、关联与完整笔记。
3. 单独审阅内容 diff 后提交；网站构建成功后更新本文件的确认和导入数量。
4. 不将本草案复制为 30 份带有猜测学习结论的正式内容。
