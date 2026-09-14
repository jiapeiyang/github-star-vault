# 2026-09-14 Stars 同步与资料复核

## 本轮结果

- GitHub 用户 `jiapeiyang`；现有同步脚本获取 3 页 Stars，快照时间为 `2026-09-14T11:46:08Z`。
- 当前公开收藏 **296**，历史记录 **297**；相比旧本地快照新增 **9**。远端定时同步已先捕获其中 7 个，本轮 API 同步再补 2 个。
- 使用远端较新的快照作为 previous 输入，保留全部已有 repo_id 和 first_seen_at；`octocat/Hello-World` 的 missing 历史记录仍在。
- 296 个当前收藏均已有分类和解读，待分类与待补介绍均为 **0**；其中 **4** 篇资料受限，解读覆盖不等于实测覆盖。
- 原有 287 篇 README 中，217 个版本未变，70 个有变化。对照这 70 个变化后，**44** 篇修正或补充正文，26 篇保留原介绍。另为 9 个新增仓库建立解读与来源基线。
- 70 篇更新 reviewed_at 与 reviewed_readme_sha；只有正文实质变化的 44 篇更新 content_updated_at。217 篇只核对 README 版本，没有改成新的人工复核日期。
- 收尾重新检查本轮 79 篇；agency-agents-zh 期间再次变更赞助文案，二次对照后更新版本记录。最终来源检查为 **296 unchanged / 0 changed / 0 unavailable / 0 without_baseline**。

## 新增仓库分类

| 仓库 | 主分类 | 资源类型 | 解读状态 |
| --- | --- | --- | --- |
| [liqiang-xxfy/fly-cursor-free](../../content/repos/1006812866.md) | 开发者工具与自动化 | 应用或工具 | 资料受限 |
| [coleam00/excalidraw-diagram-skill](../../content/repos/1169920711.md) | 设计、图像与内容创作 | 应用或工具 | 公开资料解读 |
| [DreambigOu/ELI5](../../content/repos/1183845721.md) | AI 与 Agent | 应用或工具 | 公开资料解读 |
| [oil-oil/draw-ui](../../content/repos/1219690829.md) | Web、前端与跨端 | 应用或工具 | 公开资料解读 |
| [chaitanyagiri/munder-difflin](../../content/repos/1255237198.md) | 开发者工具与自动化 | 应用或工具 | 公开资料解读 |
| [SpaceZephyr/creator-buddy](../../content/repos/1265654867.md) | 设计、图像与内容创作 | 应用或工具 | 公开资料解读 |
| [oil-oil/oil-motion](../../content/repos/1326654671.md) | Web、前端与跨端 | 应用或工具 | 公开资料解读 |
| [Rion-Wu-tech/wechat-intelligence-hub](../../content/repos/1357272370.md) | 开发者工具与自动化 | 应用或工具 | 公开资料解读 |
| [yang0/handraw-style](../../content/repos/1358588929.md) | 设计、图像与内容创作 | 应用或工具 | 公开资料解读 |

每篇均含用途、场景、开始步骤、示例、边界与来源；新增示例均未执行。FlyCursor 上游明确代码未完全开源，本次仅提供客观资料导航。

## 原有资料逐项复核

“保留正文”指用途与操作介绍无需变更；来源版本、复核日期与范围说明仍有更新。

| 仓库 | 处理 | 复核依据 |
| --- | --- | --- |
| [0xsline/OpenChatCut](../../content/repos/1301135370.md) | 更新正文 | 桌面代理本地目录访问默认扩大，新增媒体浏览和批量导入。 |
| [a597873885/webfunny_monitor](../../content/repos/139662221.md) | 更新正文 | 删去旧 Demo 直链、企业试用保证及本地安装命令，统一官网与部署文档入口。 |
| [abhigyanpatwari/GitNexus](../../content/repos/1031059905.md) | 更新正文 | 新增外部索引位置、源码保留策略、跳过全文检索和 Objective-C；补当前使用边界。 |
| [addyosmani/agent-skills](../../content/repos/1158722119.md) | 更新正文 | 目录树改为宿主适配表，技能仍为 25 个。 |
| [affaan-m/ECC](../../content/repos/1136590548.md) | 更新正文 | 发布入口固定到 2.2.1，明确多宿主向导、Hooks 同意与独立扫描器前提；大部分长差异为章节迁移。 |
| [ai/nanoid](../../content/repos/99401299.md) | 保留正文 | 包体积自述变化及示例代码格式化，API/长度契约不变；保留 6.0.1 历史实测。 |
| [alvinunreal/oh-my-opencode-slim](../../content/repos/1135179558.md) | 更新正文 | V3 Beta 展示、删旧 v2 承诺和预设，新增预设可能过期说明。 |
| [awesome-vpn/awesome-vpn](../../content/repos/146239863.md) | 更新正文 | 删原始池/特定协议入口、调整客户端表和 CDN 镜像。 |
| [binaricat/Netcatty](../../content/repos/1111357457.md) | 更新正文 | 新增保存终端当前画面和 Windows 社区 Scoop 安装。 |
| [bojieli/ai-agent-book](../../content/repos/1053118194.md) | 更新正文 | 在线阅读迁移到 /astro/，新增姊妹书、提供商与贡献者；章节实验入口未变。 |
| [boyang-hu/website-rebuild-skill](../../content/repos/1330468709.md) | 更新正文 | 新增 Lama Lama 案例及 v0.3.23 媒体就绪、协议指纹和端点桩说明。 |
| [chatfire-AI/huobao-drama](../../content/repos/1128267392.md) | 更新正文 | 数据库从 MySQL 改 SQLite，新增桌面发行、旧数据导入及 Watchtower 更新边界。 |
| [citrolabs/ego-lite](../../content/repos/1212503250.md) | 保留正文 | 仅文件末尾换行变化，无语义变化。 |
| [cloudflare/cloudflared](../../content/repos/106867604.md) | 更新正文 | 增加破坏性变更公告政策，现有命令未改变。 |
| [code-yeongyu/oh-my-openagent](../../content/repos/1108837393.md) | 更新正文 | 主代理和规划器命名及流程调整，AST-Grep 改共用 skill；现有版本选择仍有效。 |
| [Dailin521/codex-provider-sync](../../content/repos/1185965712.md) | 更新正文 | 新增 Windows Electron 桌面版、预览与备份保留规则；明确 CLI 直接写入和跨 Provider 能力边界。 |
| [deepcoldy/botmux](../../content/repos/1179074781.md) | 更新正文 | 新增 macOS 正式版签名、MiniMax 适配及会话级 Codex 实例说明。 |
| [dembrandt/dembrandt](../../content/repos/1101924225.md) | 保留正文 | GitHub Action 示例从 v0.31.1 更新为 v0.33.0，本站未固定该 Action 版本。 |
| [DietrichGebert/ponytail](../../content/repos/1266797999.md) | 保留正文 | 新增 Retriever 展示案例，规则与安装流程未改变。 |
| [DingTalk-Real-AI/dingtalk-workspace-cli](../../content/repos/1187709537.md) | 更新正文 | 新增通用 Skills 安装，明确 glibc/CGO 依赖及事件回调契约。 |
| [eternityspring/shuohao-skills](../../content/repos/1325096132.md) | 保留正文 | 语言徽章、作者链接、社群措辞与 Star 图更新，五阶段制作流程未变。 |
| [EveryInc/compound-engineering-plugin](../../content/repos/1073224021.md) | 更新正文 | 新增技能、实验性 Compound Packs，以及 /lfg 的调试路线与发布边界。 |
| [ExplosiveCoderflome/AI-Novel-Writing-Assistant](../../content/repos/934527631.md) | 保留正文 | 最新日志改为 9 月 13 日结构化返回、索引与章节目标修复，入门步骤仍有效。 |
| [fawney19/Aether](../../content/repos/1055481168.md) | 更新正文 | 简化 Docker 文档、限制新二进制为 Linux，增加连接/超时与诊断预算说明。 |
| [freestylefly/awesome-gpt-image-2](../../content/repos/1220744720.md) | 更新正文 | 新增独立 2.5 展示专题与赞助；不等于新增实时生图入口。 |
| [garrytan/gstack](../../content/repos/1179264259.md) | 更新正文 | 新增可选 Impeccable 设计检查、第三方记忆桥，并区分行为配置与运行模型。 |
| [harry0703/MoneyPrinterTurbo](../../content/repos/770153867.md) | 更新正文 | 扩展配音/视频服务，明确 Windows 需下载 Assets 的启动包。 |
| [herdrdev/herdr](../../content/repos/1193909050.md) | 更新正文 | 纠正机器重启后进程不存活，并补多机窗口。 |
| [Hmbown/Codewhale](../../content/repos/1137711311.md) | 更新正文 | 明确发布版与开发候选，提供方/模型命令拆分，增加 Runtime 与 Computer Use 说明。 |
| [hugohe3/ppt-master](../../content/repos/1113573066.md) | 更新正文 | 赞助和徽章变化，明确可选 PDF 转换器采用 AGPL-3.0 的 PyMuPDF。 |
| [hwdsl2/wireguard-install](../../content/repos/494305627.md) | 保留正文 | 书籍推广和订阅链接措辞更新，WireGuard 安装入口未变。 |
| [itgoyo/TelegramGroup](../../content/repos/941043461.md) | 保留正文 | 搜索机器人与推广区重排、少量链接更换及大批符号清理；Claude Code 社区示例仍在，未登录 Telegram。 |
| [james-6-23/codex2api](../../content/repos/1190072018.md) | 更新正文 | 赞助删除、使用指南入口和模型列表示例更新；核心端点未变。 |
| [jaywcjlove/awesome-mac](../../content/repos/63539055.md) | 保留正文 | 软件目录增删及描述更新；Keka、iTerm2 示例和分类导航仍在，未逐个安装或验证新增外链。 |
| [jaywcjlove/github-rank](../../content/repos/181200364.md) | 保留正文 | 榜单数据日期更新；既有包快照和每周更新边界仍适用。 |
| [jlcodes99/cockpit-tools](../../content/repos/1135492298.md) | 保留正文 | 致谢与协议兼容来源调整，账号/实例用法未变。 |
| [jnMetaCode/agency-agents-zh](../../content/repos/1174369519.md) | 更新正文 | 新增搜索增长角色和 ZCode/QwenPaw 安装，调整索引与推广。 收尾检查又发现赞助文案更新，二次对照后正文无需追加。 |
| [kangarooking/cangjie-skill](../../content/repos/1212163658.md) | 更新正文 | v2.5.0 在 9 月 13 日刷新安装包，原标签不变；验证规则调整。 |
| [kunchenguid/firstmate](../../content/repos/1266884317.md) | 保留正文 | 新增 /quiet 安静监督模式，现有 ship/scout 和后端流程不变。 |
| [lbjlaq/Antigravity-Manager](../../content/repos/1104535633.md) | 保留正文 | 升级为 v4.7.1，补日志轮转与多项兼容修复；基础接入和鉴权入口仍有效。 |
| [LearnPrompt/ai-news-radar](../../content/repos/1163112839.md) | 更新正文 | 邮件摘要新增 QQ Agent Mail CLI 模式与可选公开链接读取。 |
| [msitarzewski/agency-agents](../../content/repos/1075372545.md) | 保留正文 | 新增网络、平台、文档和音乐等角色索引，已有角色用途与安装示例仍有效。 |
| [mvanhorn/last30days-skill](../../content/repos/1140843380.md) | 更新正文 | 新增官方 X API 后端及近一周/全档案权限边界。 |
| [nextlevelbuilder/ui-ux-pro-max-skill](../../content/repos/1106996539.md) | 保留正文 | 新增另一个 3D Skill 的推广区，不属于本项目既有设计流程变更。 |
| [nexu-io/open-design](../../content/repos/1223170290.md) | 更新正文 | 纠正 Linux 已有安装包的描述，当前仅源码运行。 |
| [nilbuild/developer-roadmap](../../content/repos/85077558.md) | 保留正文 | 新增 AI Product Builder 与 R Programming 路线链接，既有导航不受影响。 |
| [pbakaus/impeccable](../../content/repos/1097346685.md) | 更新正文 | 新增 Copilot/VS Code 扩展安装入口；现有入口仍有效。 |
| [public-apis/public-apis](../../content/repos/54346799.md) | 保留正文 | 新增 API 条目、修改 1inch 认证与推广链接；两个 Cat Facts 导航仍在，未实测各 API。 |
| [router-for-me/CLIProxyAPI](../../content/repos/1012087571.md) | 保留正文 | 赞助区和推广链接变化；主 README 的接口与管理流程未变，补充管理文档本轮未重查。 |
| [ruanyf/weekly](../../content/repos/152870372.md) | 保留正文 | 新增第 412 期目录；既有导航示例与用途仍有效。 |
| [shanraisshan/claude-code-best-practice](../../content/repos/1087192965.md) | 保留正文 | 工作流对照表、技能数量与 Star 数更新；本站天气编排示例和概念入口未变。 |
| [stablyai/orca](../../content/repos/1183888342.md) | 保留正文 | 功能演示 GIF/海报路径迁移，文字能力和现有操作流程不变。 |
| [steipete/CodexBar](../../content/repos/1097695258.md) | 更新正文 | 新增 Linux Qt 6 桌面应用和 Omarchy 集成。 |
| [swc-project/swc](../../content/repos/115110181.md) | 更新正文 | 增加原生 addon 压缩载体和首次加载物化说明，API 名称不变。 |
| [tanweai/pua](../../content/repos/1176129893.md) | 更新正文 | 3.5.1 明确兼容性与生产率评估限制，并改为自愿反馈。 |
| [thaw-app/Thaw](../../content/repos/1145374818.md) | 保留正文 | 徽章、文案和 Transparency 章节重排；权限、最低系统版本及核心操作未变。 |
| [tiann/hapi](../../content/repos/1122242121.md) | 更新正文 | 原生客户端能力、双二维码和默认启动选择行为更新，并新增 Codex 共享会话。 |
| [TokenRhythm/opensquilla](../../content/repos/1231170332.md) | 更新正文 | 遥测改为两个独立同意开关，移除旧自动安装/用量端点；新 Windows 构建签名。 |
| [tt-a1i/archify](../../content/repos/1211139949.md) | 保留正文 | 赞助区替换，无绘图接口变化。 |
| [tw93/Mole](../../content/repos/1062356571.md) | 更新正文 | 明确 macOS 12+、CLI/商业应用分离，补 purge 路径保护和估算语义。 |
| [vercel-labs/skills](../../content/repos/1134543109.md) | 更新正文 | 新增宿主并调整 Droid/Kilo 的技能目录，现有通用安装示例仍有效。 |
| [virgiliojr94/book-to-skill](../../content/repos/1226123343.md) | 更新正文 | 默认输出统一到跨宿主技能目录，并明确 Claude 链接验证和 Hermes 例外。 |
| [Waishnav/devspace](../../content/repos/1269395331.md) | 更新正文 | 澄清使用入口与可委派的子代理是独立选择。 |
| [Wei-Shaw/sub2api](../../content/repos/1118601518.md) | 更新正文 | 赞助区变化，Grok 媒体资格对不完整账单观察的处理更新。 |
| [wshobson/agents](../../content/repos/1025856648.md) | 更新正文 | 新增 Pi 的生成和安装适配，原有单技能/Claude 入口仍有效。 |
| [xbtlin/ai-berkshire](../../content/repos/1203777920.md) | 保留正文 | 研究报告索引、数量和日期变化，未逐篇审计新报告；现有研究入口仍有效。 |
| [Yeachan-Heo/oh-my-codex](../../content/repos/1148052330.md) | 更新正文 | HUD 新增当前会话团队成员状态与窗口高度处理。 |
| [YouMind-OpenLab/awesome-gpt-image-2](../../content/repos/1212562200.md) | 保留正文 | 自动图库轮换 100 个标题并更新总数/日期；复核栏目、来源格式及 Illustrated City Food Map 示例仍有效，仅做导航级复核，未逐条运行提示词或验证全部图片来源。 |
| [yzfly/awesome-skills-zh](../../content/repos/1119232564.md) | 更新正文 | 新增设计与教育专题及部分工具条目；核对导航和 archify 示例，未逐个审计合集目标。 |
| [ZhuLinsen/daily_stock_analysis](../../content/repos/1131513930.md) | 保留正文 | SerpAPI 推广链接更新，配置键和使用流程未变。 |

## 来源与日期边界

- [本轮来源记录](2026-09-14-refresh-sources.json) 保留 README URL、新旧 Git blob SHA 与处理理由；下载内容均按 Git blob SHA-1 校验。
- [来源检查数据](../../data/guide-source-check.json) 保留各条目实际检查时间；子集复查没有刷新其他 217 个条目的检查时间。
- 既有实测记录保持原版本、环境与范围。新的 README 复核日期不代表重新运行第三方项目或重查全部补充文档。
- 大型合集采用导航级复核，核对栏目、原示例及与本站介绍有关的变化。YouMind 图库轮换了 100 个案例标题，已确认 Illustrated City Food Map 示例仍在；未逐条验证提示词效果、图片与原始社交来源。

## 已验证

- `python3 scripts/verify_data.py`：active=296、total=297、curations=296。
- `python3 scripts/generate_readme.py`：根目录索引已更新。
- `python3 -m unittest discover -s tests`：28 项通过。
- `npm --prefix app run test`：32 项通过。
- `npm --prefix app run test:sites`：4 项通过。
- `GITHUB_PAGES=true npm --prefix app run build`：生产构建及 Sites 包装通过；来源检查收尾后重新生成产物。
- 真实 catalog 专项检查：9 个新增项目均可通过名称、分类与资源类型组合找回；79 篇来源 SHA、日期与 unchanged 状态一致；维护队列为 0/0/0/4。
- 与远端 previous 快照对照：全部已有 repo_id 与 first_seen_at 保留，missing 历史记录仍在。
- ego-browser 验收：名称与分类筛选、Excalidraw 新解读、FlyCursor 资料受限提示、火宝短剧 SQLite 说明及维护队列均通过。证据见 [页面检查](../audits/2026-09-14/refresh-browser-checks.json) 与 [维护页快照](../audits/2026-09-14/refresh-maintenance-snapshot.txt)。预览使用与构建相同的 GITHUB_PAGES=true 基路径。
- `git diff --check`：通过。

## 我没有防什么

- 未安装或运行本轮第三方工具，未接入模型、微信数据库或其他真实账号；新增用法不构成兼容性或成功运行保证。
- README 没变化不能证明代码、Releases 或补充文档没变化；未逐条重查全部外链、合集资源、模型/API 行为或安全与许可主张。
- 来源检查是记录时点的快照，上游再次修改后仍可能出现复核线索；没有引入后台自动分类、锁或重试队列。

## 本地与线上状态

- 本地事实、人工分类与解读、根索引和复核记录已更新。
- 未提交、推送、合并或部署；线上是否显示这些内容需在获授权发布后另行核实。
- `app/public/data/*.json` 仅通过构建生成，没有手改或加入提交。
- 用户既有 `app/qa/production-learning.png` 改动保留。
