# GitHub Star Vault

> 讨论基线：2026-09-04
> 目标：把 GitHub Stars 从容易吃灰的收藏列表，变成可持续同步、可整理、可检索、能推动学习的个人开源项目知识库。

## 当前结论

项目已经建成公开 GitHub 仓库，采用 **Git 中的结构化数据作为唯一事实源 + GitHub Actions 准实时同步 + React/Vite 静态网站 + GitHub Pages 发布** 的方案。正式站沿用已验证的方案 E 原型。

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

- [v1.1 开发计划：整理与阅读闭环](DEVELOPMENT_PLAN_V1.1.md)：下一版的完整笔记阅读、队列分页、策展文件编辑与下载、首批分类草案及验收顺序。
- [策展操作指南](docs/07-curation-guide.md)：新建与修改笔记、下载文件、校验和提交发布。
- [剩余 248 个分类结果](docs/curation-batch-02.md)：全量补齐八个领域的分类、类型、标签和用途说明。
- [首批 30 个分类结果](docs/curation-batch-01.md)：已归纳并正式导入的分类、标签、用途说明及上游依据。
- [v1.1 验收记录](app/design-qa-v1.1.md)：新增功能的浏览器、数据保留与视觉验证证据。
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
- [上线运行与两周观察](docs/06-operations-and-observation.md)：线上入口、运行方式、指标口径和 2026-09-19 复盘计划。
- [五个视觉方向](design-directions/README.md)：工业索引台、开源年鉴、瑞士技术目录、开源实验手册和开发者杂志，共十张 GPT 生成的首页与项目库概念图。
- `output/pdf/GitHub-Star-Vault-横纵分析报告.pdf`：研究报告的 PDF 版。

## 当前推荐设计

正式网站位于 `app/`。它以方案 E“开发者杂志”为视觉基线，读取同步脚本生成的完整公开 Stars 目录，并将 GitHub 事实、人工策展与派生状态分开展示。

线上地址：<https://jiapeiyang.github.io/github-star-vault/>

```bash
python3 scripts/verify_data.py
cd app
npm ci
npm run dev
```

当前事实快照包含 284 条公开 Stars，其中 284 条均已建立正式策展文件。首次导入的未整理项目进入 `imported`；自动建议在 MVP 中关闭。

## 一句话产品定义

**GitHub Star Vault 是一个以 GitHub Stars 为入口、以个人判断为核心、以学习行动为结果的版本化开源项目知识库。**

## 第一版验证范围

第一版已经完成下面五条主链路，接下来通过两周真实使用验证整理习惯：

1. 一次性导入全部公开 Stars，历史库存进入 `imported`。
2. 后续新增 Star 进入 `inbox`，取消 Star 退出默认视图。
3. 手工内容与 GitHub 元数据分文件保存，同步后不丢失。
4. 网站能搜索个人备注，并按分类、类型、语言、学习阶段筛选。
5. 新收藏 7 天内整理率能够从数据中算出来。

两周观察结束后，再根据真实使用决定是否加入 AI 分类、语义搜索、浏览器扩展或后台管理。

## 当前实施状态

- v1.1 已增加完整 Markdown 笔记、收件箱分页与搜索、策展文件编辑下载，以及未导出修改的离开提醒。
- 已完成公开 Stars 动态分页、全量对账、原子写入和事实校验。
- 已导入当前 284 条公开 Stars，并建立 284 条正式策展内容，当前待分类为 0。
- 已完成 README 索引、前端目录生成和方案 E 真实数据接入。
- 已完成 Python、前端领域函数、静态打包和 GitHub Pages 子路径验证。
- GitHub Actions 已完成 push、手动新增 Star、取消 Star 三类远程运行验收，GitHub Pages 已公开发布。
- 两周观察已启动，跟踪见 [Issue #1](https://github.com/jiapeiyang/github-star-vault/issues/1)。

## 我们没有防什么

- 不追求秒级 Star 同步；6 小时窗口内更新即可。
- 不处理私有仓库的公开展示；MVP 只同步公开 Stars。
- 不为偶发的两个同步任务同时运行增加锁或重试；一次同步失败不会损坏人工内容，下次或手动同步可以补齐。
- 不让 AI 自动改写人工分类和笔记；第一版可以完全不依赖 AI。
- 不做多用户、登录、评论、在线编辑后台、向量数据库和复杂复习算法。

<!-- STAR_VAULT:CATALOG:START -->
## 自动生成的项目索引

> 最近成功检查：`2026-09-05T15:10:58Z` · 当前公开 Stars：**286** · 已人工整理：**284**

### 学习阶段

- 历史待整理：278
- 新收藏：2
- 待学习：1
- 学习中：1
- 已学习：1
- 仅参考：3
- 已归档：0

### AI 与 Agent（31）

- [yzfly/awesome-skills-zh](https://github.com/yzfly/awesome-skills-zh) — 中文 Agent Skills 与工具资源目录。
- [libukai/awesome-agent-skills](https://github.com/libukai/awesome-agent-skills) — Agent Skills 入门与资源推荐合集。
- [virgiliojr94/book-to-skill](https://github.com/virgiliojr94/book-to-skill) — 把技术书籍 PDF 转为可供智能体使用的 Skill。
- [datawhalechina/Agent-Learning-Hub](https://github.com/datawhalechina/Agent-Learning-Hub) — 汇集 Agent 学习路线和资料。
- [datawhalechina/hello-agents](https://github.com/datawhalechina/hello-agents) — 从零构建智能体的原理与实践教程。
- [kangarooking/cangjie-skill](https://github.com/kangarooking/cangjie-skill) — 将图书、长视频和播客内容转为 Skills。
- [lsdefine/GenericAgent](https://github.com/lsdefine/GenericAgent) — 围绕电脑操作和任务自动化构建智能体与技能树。
- [OpenMOSS/MOSS-VL](https://github.com/OpenMOSS/MOSS-VL) — 面向长视频与实时视频理解的开放权重模型及研究资源。
- [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) — 检索多个社区和媒体平台的近期内容并汇总为调研材料。
- [anthropics/skills](https://github.com/anthropics/skills) — 用于对照 Agent Skills 的目录结构、能力边界与写作规范。
- [MDX-Tom/gpt-instruct](https://github.com/MDX-Tom/gpt-instruct) — 用于研究编码模型指令行为的提示词与测试材料。
- [bojieli/ai-agent-book](https://github.com/bojieli/ai-agent-book) — 讲解智能体设计原理、上下文管理与工程实践的书籍和代码。
- [SMNETSTUDIO/WeChat-AI](https://github.com/SMNETSTUDIO/WeChat-AI) — 自托管的微信 AI 角色扮演与对话服务。
- [james-6-23/codex2api](https://github.com/james-6-23/codex2api) — 将 Codex 接入统一 API 并提供管理后台的代理服务。
- [Wei-Shaw/sub2api](https://github.com/Wei-Shaw/sub2api) — 将多个 AI 服务统一接入的开源中转与管理平台。
- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) — 收集 Model Context Protocol 的服务端实现与示例。
- [LearnPrompt/ai-news-radar](https://github.com/LearnPrompt/ai-news-radar) — 采集和展示近期 AI 与技术新闻的雷达工具。
- [earendil-works/pi](https://github.com/earendil-works/pi) — 提供统一模型接口、智能体循环和终端组件的工具包。
- [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) — 收集按专业职责划分的智能体角色与工作流程定义。
- [fawney19/Aether](https://github.com/fawney19/Aether) — 统一接入模型服务并提供租户、配额和监控管理的 AI 网关。
- [alchaincyf/nuwa-skill](https://github.com/alchaincyf/nuwa-skill) — 从公开人物资料提炼思维模型与表达方式的智能体技能。
- [router-for-me/Cli-Proxy-API-Management-Center](https://github.com/router-for-me/Cli-Proxy-API-Management-Center) — 为 CLIProxyAPI 提供配置编辑和运行状态管理界面。
- [TokenRhythm/opensquilla](https://github.com/TokenRhythm/opensquilla) — 围绕智能体任务执行与上下文利用构建的开源助手。
- [QuantumNous/new-api](https://github.com/QuantumNous/new-api) — 统一聚合模型接口并转换常见 API 格式。
- [zarazhangrui/follow-builders](https://github.com/zarazhangrui/follow-builders) — 汇总 AI 构建者的社交动态与播客内容。
- [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) — 为智能体提供跨网站和社交平台的内容读取与搜索能力。
- [jnMetaCode/agency-agents-zh](https://github.com/jnMetaCode/agency-agents-zh) — 收集中文专业角色、技能与多智能体编排定义。
- [router-for-me/CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI) — 将多个模型命令行或客户端服务包装为兼容 API。
- [KKKKhazix/khazix-skills](https://github.com/KKKKhazix/khazix-skills) — 汇集研究、整理与表达等任务的智能体技能。
- [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) — 结合工具调用、记忆与技能积累的通用智能体。
- [shareAI-lab/learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) — 通过逐步构建小型编码助手学习智能体运行机制。

### Web、前端与跨端（75）

- [boyang-hu/website-rebuild-skill](https://github.com/boyang-hu/website-rebuild-skill) — 抓取网站只读镜像并辅助还原页面代码及比对结果。
- [a2ui-project/a2ui](https://github.com/a2ui-project/a2ui) — 用声明式数据描述智能体生成的界面，并由客户端组件渲染。
- [JCodesMore/ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template) — 供编码智能体还原网站界面的项目模板。
- [serafimcloud/21st](https://github.com/serafimcloud/21st) — 汇集基于 shadcn/ui 与 Tailwind 的界面组件、模块和 Hooks。
- [nolly-studio/cult-ui](https://github.com/nolly-studio/cult-ui) — 提供可复制集成的 Tailwind 与 shadcn 兼容界面组件。
- [sudhakar3697/awesome-electron-alternatives](https://github.com/sudhakar3697/awesome-electron-alternatives) — 收集 Electron 替代方案及跨平台桌面开发资源。
- [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code) — 将界面截图转换为 HTML 或前端框架代码。
- [ai/nanoid](https://github.com/ai/nanoid) — 生成紧凑的 URL 友好字符串 ID。
- [swc-project/swc](https://github.com/swc-project/swc) — 面向 Web 工程的编译与解析工具链。
- [BetaSu/fe-hunter](https://github.com/BetaSu/fe-hunter) — 通过每日问题学习与复习前端面试知识。
- [qianguyihao/Web](https://github.com/qianguyihao/Web) — 前端入门到进阶的图文知识库。
- [BetaSu/big-react](https://github.com/BetaSu/big-react) — 通过从零实现 React 学习框架机制。
- [solidjs/solid](https://github.com/solidjs/solid) — 用于构建声明式用户界面的响应式库。
- [sveltejs/svelte](https://github.com/sveltejs/svelte) — 把声明式组件编译为更新 DOM 的 JavaScript。
- [pwstrick/daily](https://github.com/pwstrick/daily) — 以前端为主的面试题与学习资料集合。
- [electron-react-boilerplate/electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) — 基于 Electron 与 React 的跨平台应用脚手架。
- [BetaSu/just-react](https://github.com/BetaSu/just-react) — 以自顶向下方式讲解 React 源码。
- [a597873885/webfunny_monitor](https://github.com/a597873885/webfunny_monitor) — 提供前端异常、性能与业务埋点分析的监控系统。
- [chinanf-boy/didact-explain](https://github.com/chinanf-boy/didact-explain) — 以中文解释 Didact 教学项目中的 React 实现机制。
- [react-love/react-latest-framework](https://github.com/react-love/react-latest-framework) — 用于回看早期 React 客户端框架的组织方式，并验证上游归档项目仍能被检索。
- [HerbertKarajan/Fe-Interview-questions](https://github.com/HerbertKarajan/Fe-Interview-questions) — 整理前端开发面试问题及答案。
- [BingKui/javascript-zh](https://github.com/BingKui/javascript-zh) — Airbnb JavaScript 代码风格指南的中文说明。
- [ljianshu/Blog](https://github.com/ljianshu/Blog) — 围绕前端基础知识和框架使用的技术博客。
- [poetries/FE-Interview-Questions](https://github.com/poetries/FE-Interview-Questions) — 按模块整理前端面试常见问题与知识点。
- [youngwind/blog](https://github.com/youngwind/blog) — 记录前端框架与工程实践的个人技术博客。
- [fouber/blog](https://github.com/fouber/blog) — 围绕前端工程体系、模块化和部署实践的技术文章。
- [ustbhuangyi/vue-analysis](https://github.com/ustbhuangyi/vue-analysis) — 分析 Vue 源码及其核心实现机制。
- [jawil/blog](https://github.com/jawil/blog) — 整理前端语言、样式与 Node.js 等学习笔记。
- [Advanced-Frontend/Daily-Interview-Question](https://github.com/Advanced-Frontend/Daily-Interview-Question) — 通过每日面试问题整理前端进阶知识。
- [stephentian/33-js-concepts](https://github.com/stephentian/33-js-concepts) — 介绍 JavaScript 工程师应掌握的核心概念。
- [lihongxun945/myblog](https://github.com/lihongxun945/myblog) — 记录前端框架、构建工具与工程实践的博客。
- [lihongxun945/diving-into-webpack](https://github.com/lihongxun945/diving-into-webpack) — 按系列讲解 webpack 的源码与构建机制。
- [fex-team/interview-questions](https://github.com/fex-team/interview-questions) — FEX 团队整理的开发面试问题。
- [xcatliu/typescript-tutorial](https://github.com/xcatliu/typescript-tutorial) — 面向初学者的 TypeScript 语言教程。
- [ProtoTeam/blog](https://github.com/ProtoTeam/blog) — 团队前端、数据可视化与客户端工程实践文章。
- [sudheerj/reactjs-interview-questions](https://github.com/sudheerj/reactjs-interview-questions) — 收集 React 面试问题、答案与相关练习。
- [icepy/Front-End-Develop-Guide](https://github.com/icepy/Front-End-Develop-Guide) — 按开发者视角汇集前端语言与工具学习资源。
- [webpack-china/awesome-webpack-cn](https://github.com/webpack-china/awesome-webpack-cn) — 收集 webpack 相关中文文章与学习资料。
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
- [vueuse/vueuse](https://github.com/vueuse/vueuse) — 组合式 API 设计紧凑，适合观察可复用 Hook 的命名和边界。
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

- [opendatalab/MinerU](https://github.com/opendatalab/MinerU) — 把 PDF 与办公文档解析为 Markdown 或结构化 JSON。
- [chenshenhai/koa2-note](https://github.com/chenshenhai/koa2-note) — 通过示例学习 Koa 2 后端开发。
- [yjhjstz/deep-into-node](https://github.com/yjhjstz/deep-into-node) — 深入分析 Node.js 的核心思想与源码实现。
- [jimuyouyou/node-interview-questions](https://github.com/jimuyouyou/node-interview-questions) — 侧重后端应用与 Node.js 核心机制的面试题。
- [chyingp/nodejs-learning-guide](https://github.com/chyingp/nodejs-learning-guide) — 记录 Node.js 使用经验与模块学习示例。
- [public-apis/public-apis](https://github.com/public-apis/public-apis) — 汇集可供应用开发参考的公开 API 服务。
- [SocialSisterYi/bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect) — 原哔哩哔哩 API 文档收集项目，当前仓库已关停并删除相关文档与源码。
- [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) — 为网易云音乐相关功能提供 Node.js API 服务的项目。
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

- [hwdsl2/wireguard-install](https://github.com/hwdsl2/wireguard-install) — 部署 WireGuard 服务并管理客户端的脚本。
- [zhaoxuya520/reverse-skill](https://github.com/zhaoxuya520/reverse-skill) — 面向逆向分析和授权安全研究的智能体技能与工具路由集合。
- [tailscale/tailscale](https://github.com/tailscale/tailscale) — 基于 WireGuard 的组网工具。
- [yonggekkk/sing-box-yg](https://github.com/yonggekkk/sing-box-yg) — 用于部署和配置 sing-box 网络代理的 VPS 脚本集合。
- [cloudflare/cloudflared](https://github.com/cloudflare/cloudflared) — 通过 Cloudflare Tunnel 连接本地服务与外部访问入口。
- [qingchencloud/cftunnel](https://github.com/qingchencloud/cftunnel) — 结合 Cloudflare Tunnel 与 frp 提供内网穿透的命令行工具。
- [DanOps-1/Gpt-Agreement-Payment](https://github.com/DanOps-1/Gpt-Agreement-Payment) — 围绕订阅协议、验证码与反欺诈机制的研究工具集。
- [ineo6/hosts](https://github.com/ineo6/hosts) — 维护用于 GitHub 访问的 hosts 配置资料。
- [awesome-vpn/awesome-vpn](https://github.com/awesome-vpn/awesome-vpn) — 汇集网络代理节点和订阅资源的目录。
- [EtherDream/jsproxy](https://github.com/EtherDream/jsproxy) — 基于 ServiceWorker 实现的浏览器在线代理。
- [yeasy/docker_practice](https://github.com/yeasy/docker_practice) — Docker 与容器技术的实践学习资料。

### 开发者工具与自动化（74）

- [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) — 用 CLAUDE.md 提供编码智能体行为约定。
- [kunchenguid/firstmate](https://github.com/kunchenguid/firstmate) — 以指令、Skills 和工具目录组织编码智能体团队；上游定义为 agent distro。
- [tw93/Mole](https://github.com/tw93/Mole) — 用于 Mac 清理、卸载、分析和监控。
- [miuuyy/codex-chatgpt-web](https://github.com/miuuyy/codex-chatgpt-web) — 将 ChatGPT Web 接入 Codex 的桥接工具。
- [get-bb/bb](https://github.com/get-bb/bb) — 提供桌面、Web、CLI 和 HTTP API 入口的智能体 IDE。
- [tmux/tmux](https://github.com/tmux/tmux) — 在终端中管理多个窗口、面板和可恢复会话。
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) — 通过工程约定引导编码智能体采用更克制的实现方式。
- [tanweai/pua](https://github.com/tanweai/pua) — 通过行为提示和调试方法引导编码智能体持续处理任务。
- [herdrdev/herdr](https://github.com/herdrdev/herdr) — 观察多 Agent 终端工作区如何组织上下文、任务和协作。
- [stablyai/orca](https://github.com/stablyai/orca) — 管理多个并行编码智能体及其工作区的开发环境。
- [Hmbown/Codewhale](https://github.com/Hmbown/Codewhale) — 在终端中运行支持多模型与工具调用的编码智能体。
- [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) — 收集用于定制 Cursor 编码行为的规则文件。
- [leookun/cursor-byok](https://github.com/leookun/cursor-byok) — 提供 Cursor 后端的本地实现与模型接入能力。
- [deepcoldy/botmux](https://github.com/deepcoldy/botmux) — 将飞书或 Lark 会话连接到编码助手的命令行会话。
- [lbjlaq/Antigravity-Manager](https://github.com/lbjlaq/Antigravity-Manager) — 管理和切换 Antigravity 账号的桌面工具。
- [citrolabs/ego-lite](https://github.com/citrolabs/ego-lite) — 让智能体通过浏览器执行操作并复用浏览会话。
- [Ebullioscopic/Atoll](https://github.com/Ebullioscopic/Atoll) — 在 macOS 上提供灵动岛式状态与交互界面。
- [thaw-app/Thaw](https://github.com/thaw-app/Thaw) — 管理和组织 macOS 菜单栏项目。
- [DingTalk-Real-AI/dingtalk-workspace-cli](https://github.com/DingTalk-Real-AI/dingtalk-workspace-cli) — 通过统一命令行调用钉钉工作空间能力。
- [block/buzz](https://github.com/block/buzz) — 让人和智能体共同处理消息、代码与工作流的自托管协作空间。
- [binaricat/Netcatty](https://github.com/binaricat/Netcatty) — 整合 SSH 连接、SFTP 文件传输与终端的工作区。
- [git-ai-project/git-ai](https://github.com/git-ai-project/git-ai) — 以 Git 扩展记录代码中的 AI 生成来源。
- [steipete/CodexBar](https://github.com/steipete/CodexBar) — 在桌面菜单栏查看编码助手服务的用量信息。
- [itgoyo/TelegramGroup](https://github.com/itgoyo/TelegramGroup) — 汇集 Telegram 群组、频道与机器人资源入口。
- [foryourhealth111-pixel/Vibe-Skills](https://github.com/foryourhealth111-pixel/Vibe-Skills) — 为智能体选择技能并编排执行流程的工具集合。
- [fengshao1227/ccg-workflow](https://github.com/fengshao1227/ccg-workflow) — 分析开发任务并编排多个编码模型协作执行。
- [QLHazyCoder/FlowPilot](https://github.com/QLHazyCoder/FlowPilot) — 提供 AI 服务账号流程自动化及回调对接的浏览器扩展。
- [FoundZiGu/GuJumpgate](https://github.com/FoundZiGu/GuJumpgate) — 曾用于账号及相关流程自动化的浏览器扩展，现已停止维护并作为历史代码保留。
- [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) — 整理 Claude Code 从基础使用到工程化协作的实践方法。
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) — Anthropic 维护的 Claude Code 官方插件目录。
- [obra/superpowers](https://github.com/obra/superpowers) — 为智能体开发任务提供技能框架与软件工程流程。
- [Waishnav/devspace](https://github.com/Waishnav/devspace) — 为多个编码助手提供基于 MCP 的轻量运行环境。
- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — 面向编码智能体的工程技能与工作流集合。
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) — Vercel 发布的智能体技能集合。
- [alvinunreal/oh-my-opencode-slim](https://github.com/alvinunreal/oh-my-opencode-slim) — 面向 OpenCode 的精简多智能体配置与编排工具。
- [code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) — 为 OpenCode 等编码环境提供智能体编排和开发工作流。
- [nimbalyst/nimbalyst](https://github.com/nimbalyst/nimbalyst) — 结合智能体任务管理、Markdown、原型与图解编辑的桌面工作区。
- [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) — 在 Claude Code 中显示上下文、工具与任务执行状态。
- [mindfold-ai/Trellis](https://github.com/mindfold-ai/Trellis) — 将规格、任务和工作记录保存在仓库中的智能体工程框架。
- [vercel-labs/skills](https://github.com/vercel-labs/skills) — 发现、安装和使用跨智能体平台技能的命令行工具。
- [epiral/bb-browser](https://github.com/epiral/bb-browser) — 通过命令行和 MCP 让智能体控制已有登录状态的 Chrome。
- [garrytan/gstack](https://github.com/garrytan/gstack) — 收集覆盖产品、设计、开发和验收角色的编码助手工具。
- [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) — 组织智能体上下文和规格驱动开发任务的框架。
- [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done) — 作为 Claude Code 规格驱动流程的上游归档样例，仅在对比同类方案时查阅。
- [multica-ai/multica](https://github.com/multica-ai/multica) — 通过统一工作区分配、跟踪和审阅编码智能体任务。
- [sxyazi/yazi](https://github.com/sxyazi/yazi) — 在终端中浏览和管理文件的工具。
- [jlcodes99/cockpit-tools](https://github.com/jlcodes99/cockpit-tools) — 统一管理多个 AI 编码工具的账号、配额和实例。
- [Regert888/gpt-auto-register](https://github.com/Regert888/gpt-auto-register) — 提供 AI 服务账号注册流程和结果管理的自动化工具。
- [jlcodes99/vscode-antigravity-cockpit](https://github.com/jlcodes99/vscode-antigravity-cockpit) — 在 VS Code 中查看 Antigravity 配额与分组状态。
- [mattpocock/skills](https://github.com/mattpocock/skills) — 按具体工程任务组织的可组合智能体技能集合。
- [luongnv89/claude-howto](https://github.com/luongnv89/claude-howto) — 通过可视化说明和示例学习 Claude Code 的使用与扩展。
- [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) — 为编码助手提供规划、执行与知识积累流程的插件。
- [SuperClaude-Org/SuperClaude_Framework](https://github.com/SuperClaude-Org/SuperClaude_Framework) — 通过命令、角色和开发方法扩展 Claude Code 的配置框架。
- [wshobson/agents](https://github.com/wshobson/agents) — 为多种编码环境提供智能体插件与技能资源。
- [Yeachan-Heo/oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex) — 为 Codex 增加团队协作、状态显示与工作流能力。
- [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) — 组织 AI 辅助软件开发中的需求、设计与交付流程。
- [Dailin521/codex-provider-sync](https://github.com/Dailin521/codex-provider-sync) — 同步 Codex 会话文件与本地状态中的模型提供方信息。
- [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) — 通过简短表达约定控制编码助手的输出风格。
- [Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) — 把代码仓库转换为可浏览和检索的交互知识图谱。
- [abhigyanpatwari/GitNexus](https://github.com/abhigyanpatwari/GitNexus) — 把代码仓库转换为交互知识图谱并支持检索问答。
- [affaan-m/ECC](https://github.com/affaan-m/ECC) — 为多种编码工具组织技能、记忆与工程工作流。
- [PlayCover/keymaps](https://github.com/PlayCover/keymaps) — 收集 PlayCover 社区提供的键位映射配置。
- [jaywcjlove/awesome-mac](https://github.com/jaywcjlove/awesome-mac) — 按用途分类整理 macOS 软件和工具资源。
- [LeetCode-OpenSource/vscode-leetcode](https://github.com/LeetCode-OpenSource/vscode-leetcode) — 在 VS Code 中浏览和练习 LeetCode 题目。
- [521xueweihan/git-tips](https://github.com/521xueweihan/git-tips) — 整理 Git 常见操作和实用命令技巧。
- [Louiszhai/tool](https://github.com/Louiszhai/tool) — 整理用于提升开发效率的 Mac 工具链。
- [zhaoolee/ChromeAppHeroes](https://github.com/zhaoolee/ChromeAppHeroes) — 为常用 Chrome 扩展整理中文说明与使用场景。
- [jaywcjlove/github-rank](https://github.com/jaywcjlove/github-rank) — 通过 GitHub 数据生成用户和仓库排行。
- [puppeteer/puppeteer](https://github.com/puppeteer/puppeteer) — 通过程序控制 Chrome 和 Firefox 执行浏览器任务。
- [jorangreef/sudo-prompt](https://github.com/jorangreef/sudo-prompt) — 调用需要提升权限的命令，并在必要时显示系统授权对话框。
- [decaffeinate/decaffeinate](https://github.com/decaffeinate/decaffeinate) — 将 CoffeeScript 源码转换为 JavaScript。
- [oe/mac-env](https://github.com/oe/mac-env) — 通过脚本准备 Mac 开发环境。
- [wotermelon/toJump](https://github.com/wotermelon/toJump) — 用 Node.js 演示微信跳一跳小游戏的自动化操作。
- [i5ting/vsc](https://github.com/i5ting/vsc) — 介绍 Visual Studio Code 的中文使用指南。

### 设计、图像与内容创作（40）

- [eternityspring/shuohao-skills](https://github.com/eternityspring/shuohao-skills) — 短剧创作流程的 Skills 集合，覆盖角色、剧本与分镜。
- [deusyu/translate-book](https://github.com/deusyu/translate-book) — 针对整本 PDF、DOCX、EPUB 的翻译 Skill。
- [HalfAI1102/anthropic-art](https://github.com/HalfAI1102/anthropic-art) — 按 Anthropic 风格和配色规则生成编辑插画。
- [threerocks/hand-drawn-styles](https://github.com/threerocks/hand-drawn-styles) — 将内容转为多种手绘风格的图像生成提示词。
- [yanliudesign/mono-color-skill](https://github.com/yanliudesign/mono-color-skill) — 按单色印刷与半调风格生成编辑图像。
- [emilkowalski/skills](https://github.com/emilkowalski/skills) — 为界面设计与动效实现提供智能体技能集合。
- [MengTo/Skills](https://github.com/MengTo/Skills) — 面向设计师与开发者的界面、游戏和创作工作流技能合集。
- [0xsline/OpenChatCut](https://github.com/0xsline/OpenChatCut) — 结合对话操作、多轨时间线与智能体能力的视频编辑器。
- [Sac-Y/MiniMax-H3-Cloud](https://github.com/Sac-Y/MiniMax-H3-Cloud) — 在 Codex 中编排云端 GPU 和 MiniMax H3 视频生成流程。
- [chatfire-AI/huobao-drama](https://github.com/chatfire-AI/huobao-drama) — 将剧本、分镜与视频生成串联为短剧创作流程。
- [ExplosiveCoderflome/AI-Novel-Writing-Assistant](https://github.com/ExplosiveCoderflome/AI-Novel-Writing-Assistant) — 围绕世界观、章节规划和智能体流程辅助长篇小说创作。
- [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) — 根据主题生成短视频的 AI 工作流工具。
- [dembrandt/dembrandt](https://github.com/dembrandt/dembrandt) — 从网站提取配色、字体、标志与设计令牌。
- [freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2) — 整理 GPT Image 的提示词案例、创作模板与相关技能。
- [yizhiyanhua-ai/fireworks-tech-graph](https://github.com/yizhiyanhua-ai/fireworks-tech-graph) — 从自然语言生成架构、流程与 UML 技术图解。
- [geeklee/srt-whiteboard-animation](https://github.com/geeklee/srt-whiteboard-animation) — 把 SRT 字幕转换为带手写效果的白板动画。
- [YouMind-OpenLab/awesome-gpt-image-2](https://github.com/YouMind-OpenLab/awesome-gpt-image-2) — 收集带预览的 GPT Image 图像生成提示词案例。
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — 为编码智能体提供前端设计指导、检查与迭代命令。
- [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — 汇集品牌设计系统分析和可供编码助手使用的 DESIGN.md。
- [tt-a1i/archify](https://github.com/tt-a1i/archify) — 生成可交互、可导出的架构、流程与数据流图解。
- [chuspeeism/dashi-ppt-skill](https://github.com/chuspeeism/dashi-ppt-skill) — 生成可在浏览器编辑并导出的多主题演示文稿。
- [helloianneo/ian-xiaohei-illustrations](https://github.com/helloianneo/ian-xiaohei-illustrations) — 生成中文文章使用的手绘风格正文插画。
- [dama-cyber/Casting-Workflow](https://github.com/dama-cyber/Casting-Workflow) — 将创意、人设、大纲、仿写与质量检查串联的小说写作流程。
- [xiamuceer-j/MuMuAINovel](https://github.com/xiamuceer-j/MuMuAINovel) — 辅助小说规划与写作的 AI 创作工具。
- [voocel/ainovel-cli](https://github.com/voocel/ainovel-cli) — 通过多个智能体协作完成小说生成的命令行工具。
- [hugohe3/ppt-master](https://github.com/hugohe3/ppt-master) — 将文档或主题转换为可编辑的 PowerPoint 演示文稿。
- [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — 为多平台界面设计提供设计规则和智能体技能。
- [op7418/guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) — 以智能体技能生成编辑风格的 HTML 幻灯片。
- [op7418/Humanizer-zh](https://github.com/op7418/Humanizer-zh) — 面向中文文本的 AI 写作痕迹检查与润色技能。
- [blader/humanizer](https://github.com/blader/humanizer) — 识别并改写文本中常见 AI 写作模式的技能。
- [zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides) — 利用编码助手生成浏览器中展示的幻灯片。
- [subframe7536/maple-font](https://github.com/subframe7536/maple-font) — 提供带连字、终端图标及定制选项的等宽字体资源。
- [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) — 为编码助手提供前端设计、布局与视觉质量指导。
- [nexu-io/open-design](https://github.com/nexu-io/open-design) — 在本地使用编码智能体生成原型、幻灯片和视觉内容的桌面工具。
- [alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design) — 以 HTML 制作原型、演示、动画与可视化内容的设计技能。
- [EvoLinkAI/awesome-gpt-image-2-API-and-Prompts](https://github.com/EvoLinkAI/awesome-gpt-image-2-API-and-Prompts) — 汇集 GPT Image 相关 API 资料和图像生成提示词。
- [ConardLi/garden-skills](https://github.com/ConardLi/garden-skills) — 收集网页设计、图像创作和知识检索等技能。
- [phobal/ivideo](https://github.com/phobal/ivideo) — 聚合视频平台观看入口的桌面客户端项目。
- [trazyn/ieaseMusic](https://github.com/trazyn/ieaseMusic) — 网易云音乐的第三方桌面客户端项目。
- [mzlogin/chinese-copywriting-guidelines](https://github.com/mzlogin/chinese-copywriting-guidelines) — 整理中文文案中的标点、空格与排版规范。

### 计算机基础与工程实践（25）

- [xxlllq/system_architect](https://github.com/xxlllq/system_architect) — 整理系统架构设计师考试的学习与备考资料。
- [krahets/hello-algo](https://github.com/krahets/hello-algo) — 需要回顾算法概念时，从图解和可运行代码快速进入。
- [nilbuild/developer-roadmap](https://github.com/nilbuild/developer-roadmap) — 汇集多种开发岗位的学习路线和技术知识地图。
- [codecrafters-io/build-your-own-x](https://github.com/codecrafters-io/build-your-own-x) — 通过自行实现技术组件学习原理的教程索引。
- [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms) — 通过 JavaScript 示例和解释学习算法与数据结构。
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

- [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset) — 提供健身动作、器械与肌群信息的结构化数据集。
- [rosemarycox5334-debug/PA_Agent](https://github.com/rosemarycox5334-debug/PA_Agent) — 读取结构化 K 线并用大模型辅助价格行为分析的桌面工具。
- [wbh604/UZI-Skill](https://github.com/wbh604/UZI-Skill) — 以多维分析规则和投资研究方法组织股票研究的技能集合。
- [koala73/worldmonitor](https://github.com/koala73/worldmonitor) — 聚合全球新闻、地缘事件与基础设施信息的监测工作台。
- [ZhuLinsen/daily_stock_analysis](https://github.com/ZhuLinsen/daily_stock_analysis) — 结合多市场行情、新闻和大模型生成股票分析看板。
- [xbtlin/ai-berkshire](https://github.com/xbtlin/ai-berkshire) — 把价值投资方法整理为面向编码助手的研究工作流。
- [nocobase/nocobase](https://github.com/nocobase/nocobase) — 通过无代码界面与插件能力构建业务系统的平台。
- [xiaolai/regular-investing-in-box](https://github.com/xiaolai/regular-investing-in-box) — 介绍定投理念与长期投资方法的公开读物。

### 待分类（2）

- [humanlayer/skills](https://github.com/humanlayer/skills) — 暂无 GitHub 描述。
- [tiann/hapi](https://github.com/tiann/hapi) — App for Codex / Claude Code / Pi / OpenCode / Kimi Code / Grok Build, vibe coding anytime, anywhere

<!-- STAR_VAULT:CATALOG:END -->
