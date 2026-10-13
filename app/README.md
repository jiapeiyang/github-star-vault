# Star Vault · Web 应用

这是 GitHub Star Vault 的静态浏览网站。视觉沿用方案 E“开发者杂志”，数据由根目录同步与目录生成脚本提供。v1.5 本地交付记录见 [交付文档](../docs/12-v1.5-delivery.md)，线上版本需另看成功部署记录。

## 页面与交互

- 首页：完整解读、资料受限与待补数量，来源复核入口，最近解读、最近收藏、年份回顾、用途专题与随机重访。
- 项目库：按名称和用途检索、相关性排序、分类/类型/语言/标签/日期筛选，列表与卡片视图；空结果提供逐项调整建议。
- 收藏回顾：按北京时间年月回看已收录记录，包括已退出公开 Stars 的历史。
- 用途专题：视频创作、前端设计、Agent 工作流，每个专题 8 个项目及一组 3 项有来源的对照。
- 仓库详情：GitHub 事实、人工用途归纳、步骤、示例、来源状态、章节目录及关联项目；未执行示例与历史实测分别注明。
- 资料维护：按待分类、待补介绍、来源待核查、资料受限和全部资料分队列；可再按检查结果、专题、检查日期筛选及排序。表单仅生成可审阅文件，不在线保存。
- 关于页：数据来源、历史边界与内容维护入口。

## 运行

在本目录执行：

```shell
python3 ../scripts/verify_data.py
npm ci
npm run dev -- --host 127.0.0.1 --port 4174 --strictPort
```

在仓库根目录验证：

```shell
python3 -m unittest discover -s tests
npm --prefix app test
npm --prefix app run test:sites
GITHUB_PAGES=true npm --prefix app run build
node app/scripts/measure-catalog.mjs docs/audits/v1.5/catalog-performance.json
```

## 数据边界

GitHub 事实在 `data/repositories.json`，只有同步脚本写入；人工分类、客观摘要、解读及来源在 `content/repos/*.md`；专题在 `config/topics.json`；README 版本观察在 `data/guide-source-check.json`。应用只读取构建生成的 `app/public/data/catalog.json`，该目录不得手改或提交。

首页的“完整解读”表示具备约定内容结构，不等于上游已实测或来源永不变化。来源检查结果与资料完整度独立，读取失败不改成资料受限。网站没有学习阶段、笔记、完成统计、自动分类服务或行为追踪。

详细维护步骤见 [资料维护指南](../docs/07-curation-guide.md)。
