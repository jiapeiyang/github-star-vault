# GitHub Star Vault

回顾历史收藏，按用途找回项目，并理解仓库的使用方式与示例。

## 当前版本

v1.3 在 v1.2 的收藏资料库基础上，加入相关性搜索、用途专题、关联说明和来源复核。通过现有 GitHub Pages 流水线发布；线上版本以 [Actions](https://github.com/jiapeiyang/github-star-vault/actions/workflows/site.yml) 的成功部署记录为准。

- 自动同步公开 Stars，以 repo_id 处理更名、退出公开列表和重新 Star。
- 项目库支持多词检索、人工同义词、相关性排序、组合筛选与命中章节定位；名称和用途优先于正文偶然提及。
- 收藏回顾按北京时间的年/月浏览已收录记录；详情返回能恢复浏览上下文。
- 仓库解读包含用途、使用路径、示例、限制与资料来源，提供目录和代码复制。
- 学习阶段、学习笔记与完成统计已从当前源内容、页面、导出和目录结构中移除。
- 已整理全部 287 个当前收藏：284 篇用途、使用或资料导航解读，3 篇资料受限的现状说明；10 个仓库新增注明版本的本地验证示例，原示例仍标明未执行。
- 视频创作、前端设计、Agent 工作流共 3 个专题，各 8 个项目；24 份解读维护关联用途与差异说明。
- 仓库链接可独立打开并保留查询及章节，详情有独立标题。来源检查区分 README 变化与资料受限，不自动改写解读。

## 数据职责

- `data/repositories.json`：GitHub 事实，仅同步脚本写入。
- `content/repos/<repo_id>.md`：人工维护分类、摘要、仓库解读及来源；不包含用户学习阶段。
- `config/topics.json`：人工维护专题顺序、项目与适用理由。
- `data/guide-source-check.json`：手动检查命令生成的 README 版本观察，独立于 GitHub Stars 事实与人工解读。
- `app/public/data/*.json`：构建产物，不手改、不提交。当前 catalog 使用 schemaVersion 2。

网站不新增账号、数据库、在线编辑或后台自动分类服务。资料维护表单只生成文件，导出成功不代表已提交或发布。

## 开发与校验

```shell
python3 scripts/verify_data.py
npm --prefix app run dev
```

```shell
python3 -m unittest discover -s tests
npm --prefix app test
npm --prefix app run test:sites
GITHUB_PAGES=true npm --prefix app run build
```

## 文档

- [v1.3 计划与验收](DEVELOPMENT_PLAN_V1.3.md)
- [v1.3 交付与验证](docs/10-v1.3-delivery.md)
- [10 个公开示例的复验说明](docs/examples/v1.3/README.md)
- [v1.2 计划与阶段状态](DEVELOPMENT_PLAN_V1.2.md)
- [仓库资料维护指南](docs/07-curation-guide.md)
- [v1.2 交付与验证](docs/09-v1.2-delivery.md)
- [冻结内容范围](docs/content-batches/v1.2-scope.json)
- [全量内容验收与受限条目](docs/content-batches/v1.2-acceptance.md)
- [项目评估与旧版验证证据](docs/08-project-review-and-iteration-plan.md)
- [自动同步与运行观察](docs/06-operations-and-observation.md)

公开站点：[GitHub Pages](https://jiapeiyang.github.io/github-star-vault/)。具体发布版本以成功的 Actions 部署记录为准。

<!-- STAR_VAULT:CATALOG:START -->
## 自动生成的项目索引

> 最近成功检查：`2026-09-07T12:27:24Z` · 当前公开 Stars：**288** · 已分类：**287**


### AI 与 Agent（31）

- [yzfly/awesome-skills-zh](https://github.com/yzfly/awesome-skills-zh) — 中文 Agent Skills 与工具资源目录。
- [libukai/awesome-agent-skills](https://github.com/libukai/awesome-agent-skills) — Agent Skills 入门与资源推荐合集。
- [virgiliojr94/book-to-skill](https://github.com/virgiliojr94/book-to-skill) — 把技术书籍 PDF 转为可供智能体使用的 Skill。
- [datawhalechina/Agent-Learning-Hub](https://github.com/datawhalechina/Agent-Learning-Hub) — 汇集 Agent 学习路线和资料。
- [datawhalechina/hello-agents](https://github.com/datawhalechina/hello-agents) — 从零构建智能体的原理与实践教程。
- [kangarooking/cangjie-skill](https://github.com/kangarooking/cangjie-skill) — 将图书、长视频和播客内容转为 Skills。
- [lsdefine/GenericAgent](https://github.com/lsdefine/GenericAgent) — 围绕电脑操作和任务自动化构建智能体与技能树。
- [OpenMOSS/MOSS-VL](https://github.com/OpenMOSS/MOSS-VL) — 面向连续视频流和长视频理解的开放权重视觉语言模型系列，含实时、指令与基础版本。
- [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) — 聚合近 30 天跨平台公开讨论、互动信号与链接，生成可追溯主题简报的技能。
- [anthropics/skills](https://github.com/anthropics/skills) — Anthropic 的 Agent Skills 示例、模板和文档处理能力参考。
- [MDX-Tom/gpt-instruct](https://github.com/MDX-Tom/gpt-instruct) — 围绕模型指令版本、隔离评测、工件证据和回滚组织的 Codex 提示词实验仓库。
- [bojieli/ai-agent-book](https://github.com/bojieli/ai-agent-book) — 围绕模型、上下文与工具讲解 Agent 原理，并提供分章节实验的开源书籍。
- [SMNETSTUDIO/WeChat-AI](https://github.com/SMNETSTUDIO/WeChat-AI) — 通过腾讯 iLink 连接微信、用 Redis 保存会话与角色配置的自托管对话服务。
- [james-6-23/codex2api](https://github.com/james-6-23/codex2api) — 提供兼容模型接口、账号状态调度和使用观测的 Codex 接入网关。
- [Wei-Shaw/sub2api](https://github.com/Wei-Shaw/sub2api) — 集中管理上游模型账号、API Key、用量与路由的 AI 网关平台。
- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) — 用于展示 MCP SDK 与工具、资源和提示能力的参考服务器实现集合。
- [LearnPrompt/ai-news-radar](https://github.com/LearnPrompt/ai-news-radar) — 聚合近 24 小时 AI 信源、合并事件并提供精选与多种点评风格的资讯雷达。
- [earendil-works/pi](https://github.com/earendil-works/pi) — 由终端编码代理、工具调用运行时和多提供商模型 API 组成的可扩展 Agent 工程。
- [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) — 按工程、设计、营销和产品等职责组织角色提示、流程与交付标准的代理定义集合。
- [fawney19/Aether](https://github.com/fawney19/Aether) — 自托管 AI API 网关，统一接入模型服务并管理租户、配额、路由与运行情况。
- [alchaincyf/nuwa-skill](https://github.com/alchaincyf/nuwa-skill) — 从公开资料提炼人物或主题的思维框架，生成可复用的视角技能。
- [router-for-me/Cli-Proxy-API-Management-Center](https://github.com/router-for-me/Cli-Proxy-API-Management-Center) — 通过管理 API 操作 CLIProxyAPI 的配置、凭据、配额和日志的单文件 Web 界面。
- [TokenRhythm/opensquilla](https://github.com/TokenRhythm/opensquilla) — 共享 CLI、Web 与聊天入口的代理运行时，并以本地路由器选择模型。
- [QuantumNous/new-api](https://github.com/QuantumNous/new-api) — 集中管理模型渠道、调用令牌、权限与费用统计的自托管 API 网关。
- [zarazhangrui/follow-builders](https://github.com/zarazhangrui/follow-builders) — 从集中更新的公开资料源获取 AI 从业者动态，并按偏好整理摘要。
- [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) — 为代理选择、检查和配置网页、视频、代码及社区内容读取工具。
- [jnMetaCode/agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh) — 按部门组织中文代理角色与工作流程，并补充中国市场的专项角色。
- [router-for-me/CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI) — 将多个模型与 CLI 认证来源接到兼容 API 客户端的代理服务。
- [KKKKhazix/khazix-skills](https://github.com/KKKKhazix/khazix-skills) — 集合目标定义、资讯查询、磁盘分析、研究与写作等日常代理技能。
- [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) — 支持终端和消息渠道的代理运行时，包含工具、会话检索、技能与定时任务。
- [shareAI-lab/learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) — 通过独立 Python 章节演示工具循环、权限、上下文和多任务代理运行机制。

### Web、前端与跨端（75）

- [boyang-hu/website-rebuild-skill](https://github.com/boyang-hu/website-rebuild-skill) — 以源站快照、代码溯源和多层比对为依据，把网页重建成可运行工程的 Agent Skill。
- [a2ui-project/a2ui](https://github.com/a2ui-project/a2ui) — 用声明式 JSON 描述可更新界面，再由客户端可信组件渲染的 Agent UI 标准与实现。
- [JCodesMore/ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template) — 以模板仓库和 clone-website 技能把参考网址重建为 Next.js 项目的起点。
- [serafimcloud/21st](https://github.com/serafimcloud/21st) — 可浏览演示、发布与安装 React UI 源码组件的社区 registry 平台。
- [nolly-studio/cult-ui](https://github.com/nolly-studio/cult-ui) — 提供可复制的 React 界面组件，并链接 AI 应用模式和模板的 UI 资源项目。
- [sudhakar3697/awesome-electron-alternatives](https://github.com/sudhakar3697/awesome-electron-alternatives) — 按语言和技术路线收集 Electron 之外的桌面应用开发选项。
- [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code) — 用截图、设计稿或录屏生成前端代码，并在预览中继续迭代。
- [ai/nanoid](https://github.com/ai/nanoid) — 生成紧凑的 URL 友好字符串 ID。
- [swc-project/swc](https://github.com/swc-project/swc) — 以 Rust 实现 JavaScript 与 TypeScript 解析和转换的编译工具链。
- [BetaSu/fe-hunter](https://github.com/BetaSu/fe-hunter) — 以 GitHub Issues 组织前端问题、社区回答和已整理题目的资料库。
- [qianguyihao/Web](https://github.com/qianguyihao/Web) — 按主题整理 HTML、CSS、JavaScript、框架与工程化的中文前端知识库。
- [BetaSu/big-react](https://github.com/BetaSu/big-react) — 按 Git 标签逐步实现 React 18 核心机制的教学工程。
- [solidjs/solid](https://github.com/solidjs/solid) — 使用细粒度响应式与编译模板直接更新 DOM 的声明式 UI 库。
- [sveltejs/svelte](https://github.com/sveltejs/svelte) — 把声明式组件编译成针对 DOM 更新的 JavaScript 的前端框架。
- [pwstrick/daily](https://github.com/pwstrick/daily) — 按技术领域整理面试问题，并链接到逐题讨论、文章与算法资料。
- [electron-react-boilerplate/electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) — 基于 Electron 与 React 的跨平台应用脚手架。
- [BetaSu/just-react](https://github.com/BetaSu/just-react) — 以理念、架构和源码分层解释 React 更新流程的中文教程。
- [a597873885/webfunny_monitor](https://github.com/a597873885/webfunny_monitor) — 提供前端错误、性能、用户行为与后端链路分析的监控产品入口。
- [chinanf-boy/didact-explain](https://github.com/chinanf-boy/didact-explain) — 以中文翻译和代码演进解释如何制作精简 React 式渲染器。
- [react-love/react-latest-framework](https://github.com/react-love/react-latest-framework) — 基于 React 16.8.6 与 Webpack 4 的历史客户端应用脚手架。
- [HerbertKarajan/Fe-Interview-questions](https://github.com/HerbertKarajan/Fe-Interview-questions) — 按小篇章和主题资源整理前端面试、框架与基础知识的历史资料库。
- [BingKui/javascript-zh](https://github.com/BingKui/javascript-zh) — Airbnb JavaScript 风格指南的中文版本，按语法主题解释规则与取舍。
- [ljianshu/Blog](https://github.com/ljianshu/Blog) — 按浏览器、JavaScript、框架和构建原理组织的中文技术博客索引。
- [poetries/FE-Interview-Questions](https://github.com/poetries/FE-Interview-Questions) — 按前端基础、框架、网络和工程主题归档面试问答与手写题。
- [youngwind/blog](https://github.com/youngwind/blog) — 以年度目录回顾 Vue、Webpack、浏览器和 Node 原理探索的个人博客。
- [fouber/blog](https://github.com/fouber/blog) — 围绕静态资源、构建、部署和性能讨论前端工程化的文章集合。
- [ustbhuangyi/vue-analysis](https://github.com/ustbhuangyi/vue-analysis) — 按数据驱动、组件、响应式、编译和生态解释 Vue 2 源码的电子书。
- [jawil/blog](https://github.com/jawil/blog) — 按时间索引 JavaScript、Node、CSS 与浏览器问题探究的个人博客。
- [Advanced-Frontend/Daily-Interview-Question](https://github.com/Advanced-Frontend/Daily-Interview-Question) — 用连续编号问题和讨论解析整理前端算法、异步、布局与语言机制。
- [stephentian/33-js-concepts](https://github.com/stephentian/33-js-concepts) — 围绕 33 个 JavaScript 概念组织中文文章与视频的导航清单。
- [lihongxun945/myblog](https://github.com/lihongxun945/myblog) — 以 Issues 记录 Vue、React、构建工具与 JavaScript 原理的技术博客。
- [lihongxun945/diving-into-webpack](https://github.com/lihongxun945/diving-into-webpack) — 通过 Loader、产物与编译流程解释 Webpack 工作原理的 2018 年系列。
- [fex-team/interview-questions](https://github.com/fex-team/interview-questions) — FEX 团队公开的面试方法、项目追问与前端能力讨论资料。
- [xcatliu/typescript-tutorial](https://github.com/xcatliu/typescript-tutorial) — 面向初学者的 TypeScript 语言教程。
- [ProtoTeam/blog](https://github.com/ProtoTeam/blog) — 汇集前端工程、TypeScript、通信和数据可视化文章的团队博客。
- [sudheerj/reactjs-interview-questions](https://github.com/sudheerj/reactjs-interview-questions) — 以英文问答整理 React 概念、组件、状态与相关生态的资料库。
- [icepy/Front-End-Develop-Guide](https://github.com/icepy/Front-End-Develop-Guide) — 按语言基础和衍生方向收集前端开发文档、书籍与社区资源。
- [webpack-china/awesome-webpack-cn](https://github.com/webpack-china/awesome-webpack-cn) — 按 Webpack 版本与主题整理中文文章、教程和相关工具。
- [DMQ/mvvm](https://github.com/DMQ/mvvm) — 通过简化实现演示 Vue 风格的 MVVM 数据绑定机制。
- [NervJS/taro](https://github.com/NervJS/taro) — 使用统一前端开发方式构建小程序和多端应用的框架。
- [jaywcjlove/FED](https://github.com/jaywcjlove/FED) — 收集前端相关网站与学习入口。
- [javaswing/NeteaseCloudWebApp](https://github.com/javaswing/NeteaseCloudWebApp) — 以音乐 Web 应用演示 Vue 与配套工具的使用。
- [mqyqingfeng/Blog](https://github.com/mqyqingfeng/Blog) — 围绕 JavaScript、ES6 和 React 的系列技术文章。
- [JacksonTian/fks](https://github.com/JacksonTian/fks) — 以知识结构汇总前端开发所需技能。
- [DDFE/DDFE-blog](https://github.com/DDFE/DDFE-blog) — 分享 Vue 原理、组件库和前端工程实践的团队文章。
- [answershuto/learnVue](https://github.com/answershuto/learnVue) — 整理 Vue 源码和核心机制的学习笔记。
- [ygs-code/vue](https://github.com/ygs-code/vue) — 结合逐行注释和流程图分析 Vue 源码。
- [haizlin/fe-interview](https://github.com/haizlin/fe-interview) — 按日组织前端面试问题与知识练习。
- [azl397985856/fe-interview](https://github.com/azl397985856/fe-interview) — 整理前端岗位面试知识与复习指南。
- [FrontEndGitHub/FrontEndGitHub](https://github.com/FrontEndGitHub/FrontEndGitHub) — 汇总前端学习、开发工具和求职相关资源。
- [ruochuan12/blog](https://github.com/ruochuan12/blog) — 围绕常用前端库和框架开展源码阅读的技术文章。
- [shfshanyue/Daily-Question](https://github.com/shfshanyue/Daily-Question) — 整理面试经验及前端、网络和工程相关问答。
- [mechaniac/Map-of-Javascript](https://github.com/mechaniac/Map-of-Javascript) — 以单页地图形式呈现 JavaScript 与算法知识。
- [h5bp/Front-end-Developer-Interview-Questions](https://github.com/h5bp/Front-end-Developer-Interview-Questions) — 供面试与自测使用的前端开发问题清单。
- [vueuse/vueuse](https://github.com/vueuse/vueuse) — 将浏览器能力与 Vue 响应式状态组合起来的 Composition API 工具库。
- [evanw/esbuild](https://github.com/evanw/esbuild) — 用于 Web 项目的代码打包、转换与压缩工具。
- [juicecube/mshared](https://github.com/juicecube/mshared) — 支持微前端间通信的前端状态管理方案。
- [yygmind/blog](https://github.com/yygmind/blog) — 通过系列文章讲解前端进阶与面试重点。
- [ascoders/weekly](https://github.com/ascoders/weekly) — 围绕前端技术与工程实践进行精读的周刊。
- [FrankFang/best-chinese-front-end-blogs](https://github.com/FrankFang/best-chinese-front-end-blogs) — 收集中文前端技术博客。
- [kawhiGuo/kawhiGuo.github.io](https://github.com/kawhiGuo/kawhiGuo.github.io) — 记录前端知识、工具练习与技术阅读的个人学习博客。
- [Brooooooklyn/learning-rxjs](https://github.com/Brooooooklyn/learning-rxjs) — 通过逐步示例学习 RxJS 与响应式编程。
- [facebookarchive/flux](https://github.com/facebookarchive/flux) — 用于组织用户界面数据流的 Flux 架构实现。
- [voronianski/flux-comparison](https://github.com/voronianski/flux-comparison) — 通过实践示例比较不同 Flux 状态管理方案。
- [adam-golab/react-developer-roadmap](https://github.com/adam-golab/react-developer-roadmap) — 整理成为 React 开发者所需学习的技术路线。
- [electron-userland/electron-builder](https://github.com/electron-userland/electron-builder) — 打包和分发 Electron 桌面应用并支持自动更新。
- [microsoft/TypeScript-Vue-Starter](https://github.com/microsoft/TypeScript-Vue-Starter) — 演示 Vue 与 TypeScript 结合使用的项目模板。
- [livoras/blog](https://github.com/livoras/blog) — 以仓库文章和讨论记录前端技术与工程学习内容。
- [SortableJS/Sortable](https://github.com/SortableJS/Sortable) — 为网页和触屏界面提供拖拽排序能力。
- [SortableJS/Vue.Draggable](https://github.com/SortableJS/Vue.Draggable) — 基于 Sortable.js 的 Vue 拖拽组件。
- [sagalbot/vue-sortable](https://github.com/sagalbot/vue-sortable) — 通过 Vue 指令为列表接入 Sortable 拖拽排序。
- [hilongjw/vue-progressbar](https://github.com/hilongjw/vue-progressbar) — 为 Vue 应用提供轻量进度条组件。
- [ustbhuangyi/better-scroll](https://github.com/ustbhuangyi/better-scroll) — 为移动网页提供滚动与相关交互能力。
- [xwartz/wechat-app-demo](https://github.com/xwartz/wechat-app-demo) — 用于学习微信小程序结构与功能的示例项目。
- [lessfish/underscore-analysis](https://github.com/lessfish/underscore-analysis) — 按系列分析 Underscore 工具库源码。

### 后端与数据（20）

- [opendatalab/MinerU](https://github.com/opendatalab/MinerU) — 将 PDF、图片和 Office 文档解析为有阅读顺序的 Markdown 与 JSON。
- [chenshenhai/koa2-note](https://github.com/chenshenhai/koa2-note) — 覆盖 Koa 2 中间件、路由、请求数据、会话与项目组织的中文电子书。
- [yjhjstz/deep-into-node](https://github.com/yjhjstz/deep-into-node) — 深入分析 Node.js 的核心思想与源码实现。
- [jimuyouyou/node-interview-questions](https://github.com/jimuyouyou/node-interview-questions) — 侧重后端应用与 Node.js 核心机制的面试题。
- [chyingp/nodejs-learning-guide](https://github.com/chyingp/nodejs-learning-guide) — 记录 Node.js 使用经验与模块学习示例。
- [public-apis/public-apis](https://github.com/public-apis/public-apis) — 汇集可供应用开发参考的公开 API 服务。
- [SocialSisterYi/bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect) — 历史上的哔哩哔哩接口资料库；当前上游已永久关停并移除文档与源码。
- [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) — 历史网易云音乐 Node.js 接口项目；当前上游明确停止维护，使用文档已不可从 README 获取。
- [sequelize/sequelize-typescript](https://github.com/sequelize/sequelize-typescript) — 为 Sequelize 增加 TypeScript 装饰器与类型化模型能力。
- [eggjs/egg](https://github.com/eggjs/egg) — 用于构建企业级 Node.js 服务端应用的框架。
- [koajs/jwt](https://github.com/koajs/jwt) — 在 Koa 请求处理中验证 JSON Web Token 的中间件。
- [zemirco/json2csv](https://github.com/zemirco/json2csv) — 把 JSON 数据转换为带列标题的 CSV。
- [dominhhai/koa-log4js](https://github.com/dominhhai/koa-log4js) — 将 log4js 日志能力接入 Koa 请求流程。
- [STRML/node-xlsx-writestream](https://github.com/STRML/node-xlsx-writestream) — 在 Node.js 中以流式方式写入 XLSX 文件。
- [functionscope/Node-Excel-Export](https://github.com/functionscope/Node-Excel-Export) — 把数据集导出为 Excel 文件的 Node.js 模块。
- [mgcrea/node-xlsx](https://github.com/mgcrea/node-xlsx) — 在 Node.js 中解析和生成 Excel 文件。
- [sequelize/sequelize](https://github.com/sequelize/sequelize) — 通过模型与查询接口访问多种 SQL 数据库。
- [request/request](https://github.com/request/request) — 用于发送 HTTP 请求的 Node.js 客户端库。
- [ElemeFE/node-interview](https://github.com/ElemeFE/node-interview) — 整理 Node.js 岗位面试相关问题与知识。
- [koajs/koa](https://github.com/koajs/koa) — 以中间件组合方式构建 Node.js Web 服务的框架。

### 基础设施、网络与安全（11）

- [hwdsl2/wireguard-install](https://github.com/hwdsl2/wireguard-install) — 在 Linux 服务器自动部署 WireGuard 并生成客户端配置的安装与管理脚本。
- [zhaoxuya520/reverse-skill](https://github.com/zhaoxuya520/reverse-skill) — 根据 APK、二进制、JavaScript 等对象选择分析方法与工具的安全研究技能路由包。
- [tailscale/tailscale](https://github.com/tailscale/tailscale) — 以 WireGuard 连接设备并结合身份、DNS 与访问规则管理私有网络的软件。
- [yonggekkk/sing-box-yg](https://github.com/yonggekkk/sing-box-yg) — 面向 VPS 与特定托管平台管理 sing-box 多协议配置及本地订阅的脚本合集。
- [cloudflare/cloudflared](https://github.com/cloudflare/cloudflared) — 连接本地或私有源站与 Cloudflare 网络的 Tunnel 命令行客户端。
- [qingchencloud/cftunnel](https://github.com/qingchencloud/cftunnel) — 统一管理 Cloudflare Web 隧道和基于 frp 的自建 TCP/UDP 中继。
- [DanOps-1/Gpt-Agreement-Payment](https://github.com/DanOps-1/Gpt-Agreement-Payment) — 研究订阅支付、授权回调和认证状态衔接的协议重放项目。
- [ineo6/hosts](https://github.com/ineo6/hosts) — 提供 GitHub 域名映射与本地探测服务，辅助排查特定网络下的访问问题。
- [awesome-vpn/awesome-vpn](https://github.com/awesome-vpn/awesome-vpn) — 整理多种客户端格式的公开代理订阅与候选节点列表。
- [EtherDream/jsproxy](https://github.com/EtherDream/jsproxy) — 基于 ServiceWorker 实现的浏览器在线代理。
- [yeasy/docker_practice](https://github.com/yeasy/docker_practice) — Docker 与容器技术的实践学习资料。

### 开发者工具与自动化（77）

- [localsend/localsend](https://github.com/localsend/localsend) — 通过局域网在电脑与手机间传送文件和文字，无需聊天软件账号。
- [humanlayer/skills](https://github.com/humanlayer/skills) — HumanLayer 提供的编码规则、React 类型与智能体工作流 Skills 集合。
- [tiann/hapi](https://github.com/tiann/hapi) — 通过 Web、PWA 等入口远程查看与控制工作机上的编码智能体会话。
- [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) — 用 CLAUDE.md 提供编码智能体行为约定。
- [kunchenguid/firstmate](https://github.com/kunchenguid/firstmate) — 以指令、Skills 和工具目录组织编码智能体团队；上游定义为 agent distro。
- [tw93/Mole](https://github.com/tw93/Mole) — 用于 Mac 清理、卸载、分析和监控。
- [miuuyy/codex-chatgpt-web](https://github.com/miuuyy/codex-chatgpt-web) — 将 ChatGPT Web 接入 Codex 的桥接工具。
- [get-bb/bb](https://github.com/get-bb/bb) — 提供桌面、Web、CLI 和 HTTP API 入口的智能体 IDE。
- [tmux/tmux](https://github.com/tmux/tmux) — 在一个终端中管理多个持久会话、窗口与分屏，支持断开后重新连接。
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) — 通过需求、现有代码和平台能力的选择顺序，约束编码代理减少不必要实现。
- [tanweai/pua](https://github.com/tanweai/pua) — 通过排障清单、主动调查和多种提示策略，约束编码代理遇错后继续寻找证据。
- [herdrdev/herdr](https://github.com/herdrdev/herdr) — 在后台持有终端会话并显示编码代理状态的终端工作空间，支持分屏、CLI 与远程接入。
- [stablyai/orca](https://github.com/stablyai/orca) — 把多种编码代理、隔离 worktree、终端和浏览器集中到同一桌面工作区。
- [Hmbown/Codewhale](https://github.com/Hmbown/Codewhale) — 基于 Rust 的终端编码代理，可连接不同模型并执行读取、修改与验证任务。
- [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) — 按技术栈分类的 Cursor 项目规则合集，可选择并调整为仓库自己的编码约定。
- [leookun/cursor-byok](https://github.com/leookun/cursor-byok) — 在本机连接 Cursor 与自有模型 API 的网关，提供模型配置、转发和连接测试。
- [deepcoldy/botmux](https://github.com/deepcoldy/botmux) — 把飞书消息接到本机编码 CLI，并以流式卡片和 Web 终端回传会话的桥接工具。
- [lbjlaq/Antigravity-Manager](https://github.com/lbjlaq/Antigravity-Manager) — 结合账号状态、模型映射和 OpenAI/Anthropic 协议转换的本地 AI 管理与中转应用。
- [citrolabs/ego-lite](https://github.com/citrolabs/ego-lite) — 让用户与代理在独立 Spaces 中并行操作，并复用浏览器登录态的 macOS 浏览器。
- [Ebullioscopic/Atoll](https://github.com/Ebullioscopic/Atoll) — 把 MacBook 刘海区域变成媒体、系统状态、计时器和快捷工具入口的应用。
- [thaw-app/Thaw](https://github.com/thaw-app/Thaw) — 在 macOS 中隐藏、查找和按场景切换菜单栏项目的开源管理工具。
- [DingTalk-Real-AI/dingtalk-workspace-cli](https://github.com/DingTalk-Real-AI/dingtalk-workspace-cli) — 用结构化 CLI 操作钉钉文档、日历、多维表和通讯录，并提供代理技能与请求预览。
- [block/buzz](https://github.com/block/buzz) — 以自托管 Nostr relay 和签名事件组织人与代理共同协作的工作空间。
- [binaricat/Netcatty](https://github.com/binaricat/Netcatty) — 整合 SSH 分屏、双栏 SFTP、主机管理和 AI 运维助手的跨平台桌面客户端。
- [git-ai-project/git-ai](https://github.com/git-ai-project/git-ai) — 将代码行关联到生成它的代理、模型和提示上下文的 Git 归因扩展。
- [steipete/CodexBar](https://github.com/steipete/CodexBar) — 在 macOS 菜单栏集中显示编码服务配额、重置时间、余额与状态的工具。
- [itgoyo/TelegramGroup](https://github.com/itgoyo/TelegramGroup) — 按话题汇总 Telegram 频道、群组、机器人与外部导航入口的资源清单。
- [foryourhealth111-pixel/Vibe-Skills](https://github.com/foryourhealth111-pixel/Vibe-Skills) — 先拆解任务与验收目标，再从本地技能库挑选相关方法并记录执行结果的编排方案。
- [fengshao1227/ccg-workflow](https://github.com/fengshao1227/ccg-workflow) — 以 Claude Code 为主控，通过外部 CLI 桥接多模型分析、实现与审查的工作流引擎。
- [QLHazyCoder/FlowPilot](https://github.com/QLHazyCoder/FlowPilot) — 将账号注册、验证、OAuth 和交付状态组织到 Chrome 侧边栏的流程自动化扩展。
- [FoundZiGu/GuJumpgate](https://github.com/FoundZiGu/GuJumpgate) — 已经停止维护的账号与支付流程浏览器扩展，现仅保留历史实现和开发记录。
- [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) — 按概念、实现和工作流整理 Claude Code agents、skills、hooks 与配置的参考资料库。
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) — Claude Code 官方插件目录，包含 Anthropic 维护的插件和经收录的第三方插件。
- [obra/superpowers](https://github.com/obra/superpowers) — 以可组合技能组织需求澄清、计划、实现、测试和审查的软件开发方法体系。
- [Waishnav/devspace](https://github.com/Waishnav/devspace) — 通过自托管 MCP 与受控隧道，让聊天客户端访问选定本地项目文件和命令的工具。
- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — 覆盖需求、计划、实现、验证、审查与性能的工程技能和参考清单合集。
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) — 包含 React 性能、网页界面、文案和 Vercel 项目优化等专项规则的 Agent Skills 合集。
- [alvinunreal/oh-my-opencode-slim](https://github.com/alvinunreal/oh-my-opencode-slim) — 在 OpenCode 中按职责调度多个模型代理，并统一后台任务与预设配置的插件。
- [code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) — 提供多角色编排、任务持续推进和工具集成，并向多种代理宿主演进的插件体系。
- [nimbalyst/nimbalyst](https://github.com/nimbalyst/nimbalyst) — 让用户与编码代理共同编辑文档、图表、原型和代码，并管理会话与 worktree 的桌面工作区。
- [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) — 在 Claude Code 原生状态栏显示上下文、工具、代理与任务活动的插件。
- [mindfold-ai/Trellis](https://github.com/mindfold-ai/Trellis) — 将工程规范、任务 PRD、执行上下文和会话记录保存在仓库中的多宿主开发框架。
- [vercel-labs/skills](https://github.com/vercel-labs/skills) — 为多种编码代理发现、选择、安装与临时使用 Agent Skills 的命令行工具。
- [epiral/bb-browser](https://github.com/epiral/bb-browser) — 通过真实浏览器登录会话，将网站操作与查询提供为 CLI 或 MCP 接口。
- [garrytan/gstack](https://github.com/garrytan/gstack) — 以角色化技能串联产品讨论、方案评审、代码审查、浏览器验证与发布流程。
- [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) — 以讨论、规划、执行、验证和交付阶段管理编码代理的上下文与实现工作。
- [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done) — GSD 的历史仓库入口，当前开发已迁至 open-gsd/gsd-core。
- [multica-ai/multica](https://github.com/multica-ai/multica) — 把编码代理、问题单、运行日志和人工评审集中在同一工作空间。
- [sxyazi/yazi](https://github.com/sxyazi/yazi) — 在终端中浏览和管理文件的工具。
- [jlcodes99/cockpit-tools](https://github.com/jlcodes99/cockpit-tools) — 跨平台管理多个 AI IDE 账号、配额和独立应用实例的桌面工具。
- [Regert888/gpt-auto-register](https://github.com/Regert888/gpt-auto-register) — 研究账号注册协议状态机与邮箱验证码接入的 Python 项目，附本地管理界面。
- [jlcodes99/vscode-antigravity-cockpit](https://github.com/jlcodes99/vscode-antigravity-cockpit) — 在 VS Code 风格编辑器内展示 Antigravity 配额、重置时间与阈值提醒。
- [mattpocock/skills](https://github.com/mattpocock/skills) — 一组可组合的工程技能，覆盖需求追问、领域术语、任务规划与评审。
- [luongnv89/claude-howto](https://github.com/luongnv89/claude-howto) — 按功能模块整理 Claude Code 的命令、技能、Hooks、MCP 与代理配置教程。
- [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) — 围绕构思、计划、实现、审查和知识归纳组织工程工作的代理插件。
- [SuperClaude-Org/SuperClaude_Framework](https://github.com/SuperClaude-Org/SuperClaude_Framework) — 为 Claude Code 安装结构化命令、角色模式与可选 MCP 集成的配置框架。
- [wshobson/agents](https://github.com/wshobson/agents) — 按领域拆分插件、代理、技能和命令的可组合市场。
- [Yeachan-Heo/oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex) — 为 Codex CLI 增加提示、规划、团队协作和验证工作流的运行层。
- [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) — 用按任务规模调整的技能流程，连接需求澄清、方案设计与验证交付。
- [Dailin521/codex-provider-sync](https://github.com/Dailin521/codex-provider-sync) — 对齐 Codex 会话与 SQLite 的 Provider 元数据，恢复切换供应商后的历史可见性。
- [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) — 用技能压缩代理说明文字，并可选以本地代理压缩发送给模型的输入。
- [Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) — 结合语法解析与代理归纳，将代码结构和业务关系变成交互知识图。
- [abhigyanpatwari/GitNexus](https://github.com/abhigyanpatwari/GitNexus) — 将代码索引为调用与依赖图，并通过 MCP 向代理提供结构化上下文。
- [affaan-m/ECC](https://github.com/affaan-m/ECC) — 为多种编码宿主提供规划、测试、审查、Hooks 与会话管理能力的工程工具集。
- [PlayCover/keymaps](https://github.com/PlayCover/keymaps) — 按应用收集 PlayCover 的社区键鼠映射配置文件。
- [jaywcjlove/awesome-mac](https://github.com/jaywcjlove/awesome-mac) — 按用途分类整理 macOS 软件和工具资源。
- [LeetCode-OpenSource/vscode-leetcode](https://github.com/LeetCode-OpenSource/vscode-leetcode) — 在 VS Code 中浏览、编辑、测试和提交 LeetCode 题目的扩展。
- [521xueweihan/git-tips](https://github.com/521xueweihan/git-tips) — 以中文任务标题索引常用 Git 命令与历史管理技巧。
- [Louiszhai/tool](https://github.com/Louiszhai/tool) — 整理用于提升开发效率的 Mac 工具链。
- [zhaoolee/ChromeAppHeroes](https://github.com/zhaoolee/ChromeAppHeroes) — 为常用 Chrome 扩展整理中文说明与使用场景。
- [jaywcjlove/github-rank](https://github.com/jaywcjlove/github-rank) — 通过 GitHub 数据生成用户和仓库排行。
- [puppeteer/puppeteer](https://github.com/puppeteer/puppeteer) — 通过程序控制 Chrome 和 Firefox 执行浏览器任务。
- [jorangreef/sudo-prompt](https://github.com/jorangreef/sudo-prompt) — 调用需要提升权限的命令，并在必要时显示系统授权对话框。
- [decaffeinate/decaffeinate](https://github.com/decaffeinate/decaffeinate) — 将 CoffeeScript 源码转换为 JavaScript。
- [oe/mac-env](https://github.com/oe/mac-env) — 早期 Mac 开发环境脚本，当前安装入口与 README 不一致，保留为历史参考。
- [wotermelon/toJump](https://github.com/wotermelon/toJump) — 用 Node.js 演示微信跳一跳小游戏的自动化操作。
- [i5ting/vsc](https://github.com/i5ting/vsc) — 介绍 Visual Studio Code 的中文使用指南。

### 设计、图像与内容创作（40）

- [eternityspring/shuohao-skills](https://github.com/eternityspring/shuohao-skills) — 短剧创作流程的 Skills 集合，覆盖角色、剧本与分镜。
- [deusyu/translate-book](https://github.com/deusyu/translate-book) — 针对整本 PDF、DOCX、EPUB 的翻译 Skill。
- [HalfAI1102/anthropic-art](https://github.com/HalfAI1102/anthropic-art) — 按 Anthropic 风格和配色规则生成编辑插画。
- [threerocks/hand-drawn-styles](https://github.com/threerocks/hand-drawn-styles) — 将内容转为多种手绘风格的图像生成提示词。
- [yanliudesign/mono-color-skill](https://github.com/yanliudesign/mono-color-skill) — 按单色印刷与半调风格生成编辑图像。
- [emilkowalski/skills](https://github.com/emilkowalski/skills) — 为界面设计与动效实现提供智能体技能集合。
- [MengTo/Skills](https://github.com/MengTo/Skills) — 面向网页、游戏和设计参考转化的 Agent Skills 合集，以流程文件复用创作方法。
- [0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut) — 把对话式代理、可编辑多轨时间线和 MCP 接在一起的本地视频编辑器。
- [Sac-Y/MiniMax-H3-Cloud](https://github.com/Sac-Y/MiniMax-H3-Cloud) — 在 Codex 中编排云端 GPU、ComfyUI 和 MiniMax H3 工作流，生成并下载视频。
- [chatfire-AI/huobao-drama](https://github.com/chatfire-AI/huobao-drama) — 以剧本、角色、场景和分镜为中心，组织 AI 短剧生成与整集导出的全栈应用。
- [ExplosiveCoderflome/AI-Novel-Writing-Assistant](https://github.com/ExplosiveCoderflome/AI-Novel-Writing-Assistant) — 围绕整本小说规划、章节生成、审核修复和状态回灌组织的可视化创作工作台。
- [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) — 从主题或自定义脚本组织素材、配音、字幕与剪辑，批量生成短视频的工具。
- [dembrandt/dembrandt](https://github.com/dembrandt/dembrandt) — 通过浏览器读取网页计算样式，提取设计 token、组件与设计漂移比较资料。
- [freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2) — 将 GPT Image 2 案例整理成风格图库、结构化提示模板与可安装技能的资源库。
- [yizhiyanhua-ai/fireworks-tech-graph](https://github.com/yizhiyanhua-ai/fireworks-tech-graph) — 把系统描述整理成有几何校验的 SVG、PNG、离线交互图与语义动画的技能。
- [geeklee/srt-whiteboard-animation](https://github.com/geeklee/srt-whiteboard-animation) — 按字幕叙事顺序组织分镜、区域标注和笔迹绘制，生成白板手绘视频的技能。
- [YouMind-OpenLab/awesome-gpt-image-2](https://github.com/YouMind-OpenLab/awesome-gpt-image-2) — 按用途展示社区 GPT Image 2 提示词、结果图片与原始来源的多语言图库。
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — 提供设计初始化、评审、精修和浏览器迭代流程的前端设计技能与检测工具。
- [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — 从公开网站整理设计模式、token 与规则的 DESIGN.md 参考文档合集。
- [tt-a1i/archify](https://github.com/tt-a1i/archify) — 将代码或系统描述转成类型化图模型，再确定性渲染交互式 HTML/SVG 系统图。
- [chuspeeism/dashi-ppt-skill](https://github.com/chuspeeism/dashi-ppt-skill) — 从文档生成带页面控制台的 HTML 演示，并导出可编辑 PPTX、PDF 与离线包的技能。
- [helloianneo/ian-xiaohei-illustrations](https://github.com/helloianneo/ian-xiaohei-illustrations) — 从中文文章提炼认知重点，以小黑人物和物理隐喻生成白底手绘正文配图的技能。
- [dama-cyber/Casting-Workflow](https://github.com/dama-cyber/Casting-Workflow) — 通过分类语料、提示词与分阶段脚本组织小说构思和文本处理的创作流程。
- [xiamuceer-j/MuMuAINovel](https://github.com/xiamuceer-j/MuMuAINovel) — 管理小说项目、大纲、角色、世界观与章节编辑的 AI 创作 Web 应用。
- [voocel/ainovel-cli](https://github.com/voocel/ainovel-cli) — 用确定性引擎调度规划、写作和编辑代理，并以文件检查点推进长篇小说的 CLI。
- [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) — 把文档与参考材料生成 PowerPoint 原生可编辑对象，并支持模板复用的演示文稿工作流。
- [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — 依据产品类型检索风格、配色、字体与交互规则，并组织 UI 实现的设计技能。
- [op7418/guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) — 以电子杂志或瑞士网格风格生成单文件 HTML 演示，并提供演讲者模式与配图流程的技能。
- [op7418/Humanizer-zh](https://github.com/op7418/Humanizer-zh) — 把常见 AI 文风检查规则翻译并适配为中文写作润色技能。
- [blader/humanizer](https://github.com/blader/humanizer) — 用可移植的 Markdown 规则改写机械文风，同时约束事实与作者语气保持一致。
- [zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides) — 通过先选视觉方向的技能流程，创建单文件 HTML 演示或转换现有 PPT。
- [subframe7536/maple-font](https://github.com/subframe7536/maple-font) — 面向代码编辑与终端的等宽字体，提供连字、Nerd Font 图标和中日韩字形版本。
- [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) — 以排版、布局、动效和密度规则指导代理制作前端，并提供参考图与改版技能。
- [nexu-io/open-design](https://github.com/nexu-io/open-design) — 将本地编码代理、设计系统、生成文件和实时预览整合为桌面设计工作台。
- [alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design) — 以先选方向、再迭代的流程生成 HTML 原型、幻灯片、动画和可视化交付物。
- [EvoLinkAI/awesome-gpt-image-2-API-and-Prompts](https://github.com/EvoLinkAI/awesome-gpt-image-2-API-and-Prompts) — 按电商、海报、人物和 UI 等用途整理带出处与示例图的生图提示词。
- [ConardLi/garden-skills](https://github.com/ConardLi/garden-skills) — 将网页设计、可录制演示、生图、文章编排和资料检索拆成独立技能。
- [phobal/ivideo](https://github.com/phobal/ivideo) — 基于 Electron、React 和 Redux 的历史多站点视频播放器原型。
- [trazyn/ieaseMusic](https://github.com/trazyn/ieaseMusic) — 网易云音乐的第三方桌面客户端项目。
- [mzlogin/chinese-copywriting-guidelines](https://github.com/mzlogin/chinese-copywriting-guidelines) — 整理中文文案中的标点、空格与排版规范。

### 计算机基础与工程实践（25）

- [xxlllq/system_architect](https://github.com/xxlllq/system_architect) — 按年份汇总系统架构设计师考试资料、真题解析、论文参考与报名入口的资源仓库。
- [krahets/hello-algo](https://github.com/krahets/hello-algo) — 结合动画图解与多语言源码解释数据结构和算法。
- [nilbuild/developer-roadmap](https://github.com/nilbuild/developer-roadmap) — 提供 roadmap.sh 技术路线与主题资源入口的社区路线图仓库。
- [codecrafters-io/build-your-own-x](https://github.com/codecrafters-io/build-your-own-x) — 按技术类型与语言收集从零实现软件系统的教程入口。
- [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms) — 带独立说明与测试的 JavaScript 数据结构和算法示例集合。
- [ruanyf/weekly](https://github.com/ruanyf/weekly) — 持续汇集科技文章、工具和观点的周刊。
- [azl397985856/leetcode](https://github.com/azl397985856/leetcode) — 按题目记录算法思路和 LeetCode 解题过程。
- [soulmachine/leetcode](https://github.com/soulmachine/leetcode) — 以文档形式整理 LeetCode 题目解答。
- [wangzheng0822/algo](https://github.com/wangzheng0822/algo) — 通过代码示例学习常见数据结构与算法。
- [hk029/leetbook](https://github.com/hk029/leetbook) — 以开源书形式整理 LeetCode 解题方法。
- [algorithm-visualizer/algorithm-visualizer](https://github.com/algorithm-visualizer/algorithm-visualizer) — 通过交互动画展示代码中的算法执行过程。
- [stone0090/alibaba-interview](https://github.com/stone0090/alibaba-interview) — 汇集阿里巴巴相关技术面试学习资源。
- [nonstriater/Learn-Algorithms](https://github.com/nonstriater/Learn-Algorithms) — 整理算法和数据结构学习笔记。
- [ruanyf/free-books](https://github.com/ruanyf/free-books) — 收集互联网上可访问的免费书籍资源。
- [lessfish/leetcode](https://github.com/lessfish/leetcode) — 使用 JavaScript 编写的 LeetCode 题解集合。
- [ConardLi/awesome-coding-js](https://github.com/ConardLi/awesome-coding-js) — 以 JavaScript 示例和讲解学习算法与数据结构。
- [perkfly/reverse-interview-zh](https://github.com/perkfly/reverse-interview-zh) — 整理求职时向面试官了解团队和岗位的问题。
- [biaochenxuying/awesome-books](https://github.com/biaochenxuying/awesome-books) — 按技术领域推荐前后端、算法与计算机基础书籍。
- [biaochenxuying/preferential-courses](https://github.com/biaochenxuying/preferential-courses) — 汇集技术课程介绍和优惠购买信息。
- [shfshanyue/blog](https://github.com/shfshanyue/blog) — 记录前端、后端及运维工作中的问题与解决思路。
- [ruanyf/jstraining](https://github.com/ruanyf/jstraining) — 面向全栈工程师的培训资料与实践内容。
- [xitu/gold-miner](https://github.com/xitu/gold-miner) — 将多领域英文技术文章译为中文的社区项目。
- [ryanmcdermott/clean-code-javascript](https://github.com/ryanmcdermott/clean-code-javascript) — 用 JavaScript 示例解释整洁代码原则。
- [InterviewMap/CS-Interview-Knowledge-Map](https://github.com/InterviewMap/CS-Interview-Knowledge-Map) — 汇集语言、浏览器、网络和算法等面试知识。
- [Chalarangelo/30-seconds-of-code](https://github.com/Chalarangelo/30-seconds-of-code) — 通过短篇文章和代码片段讲解开发知识。

### 商业与行业应用（8）

- [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset) — 包含动作分类、器械、目标肌群、多语言步骤及配套媒体的健身动作数据集。
- [rosemarycox5334-debug/PA_Agent](https://github.com/rosemarycox5334-debug/PA_Agent) — 读取结构化 K 线并分阶段生成价格行为诊断与决策参考的桌面分析工具。
- [wbh604/UZI-Skill](https://github.com/wbh604/UZI-Skill) — 把公开行情和财务资料组织成多维个股分析、估值及角色视角报告的技能。
- [koala73/worldmonitor](https://github.com/koala73/worldmonitor) — 将新闻、地图、基础设施与市场信号集中展示的全球态势仪表盘。
- [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) — 聚合自选股行情、新闻和模型分析，生成可回看报告并支持定时推送的应用。
- [xbtlin/ai-berkshire](https://github.com/xbtlin/ai-berkshire) — 将价值投资的商业、财务、风险与长期判断组织成多种研究技能和公开报告的框架。
- [nocobase/nocobase](https://github.com/nocobase/nocobase) — 以数据模型、权限、工作流和插件为基础，通过可视化与代理共同搭建业务系统的平台。
- [xiaolai/regular-investing-in-box](https://github.com/xiaolai/regular-investing-in-box) — 介绍定投理念与长期投资方法的公开读物。

### 待分类（1）

- [Rion-Wu-tech/wechat-intelligence-hub](https://github.com/Rion-Wu-tech/wechat-intelligence-hub) — Local-first WeChat intelligence system with a read-only CLI, Codex skills, searchable chat history, daily briefings, follow-ups and opportunity track…

<!-- STAR_VAULT:CATALOG:END -->
