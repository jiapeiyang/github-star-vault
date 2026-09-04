# Star Vault · Web 应用

这是 GitHub Star Vault 的正式只读网站。视觉沿用 **方案 E：开发者杂志**，数据由根目录同步与目录生成脚本提供。

## 当前页面与交互

- 首页：策展主张、本周精选、数据概览、八个领域入口、收藏时间线、当前关注、继续学习、新收藏、最近学习和随机重访。
- 项目库：全文搜索、领域、类型、语言、个人标签、学习阶段与归档筛选，三种排序，列表/卡片视图，激活条件和清除入口。
- 新收藏收件箱：为新收藏或历史库存生成可复制的 `content/repos/<repo_id>.md`，提交到 Git 后生效。
- 学习工作台：当前学习、待学习、最近已学习、历史待整理和仅参考资源。
- 仓库详情：GitHub 事实、个人判断、学习结论、时间记录、Topics、相关项目和外部链接。
- 关于页：产品定义、状态流转、数据来源和公开边界。
- 响应式状态：桌面和移动端布局、移动导航、加载状态与空结果状态。

## 运行

```bash
python3 ../scripts/verify_data.py
npm ci
npm run dev -- --host 0.0.0.0 --port 4174 --strictPort
```

验证命令：

```bash
npm run build
npm test
npm run test:sites
```

## 数据边界

- 网站读取完整 `app/public/data/catalog.json` 构建产物。
- GitHub 事实来自 `data/repositories.json`，由同步脚本维护。
- 分类、阶段、标签、个人判断和学习结论来自 `content/repos/*.md`。
- 自动建议在 MVP 中关闭，网站没有在线写入能力。

视觉对照与验收记录见 [design-qa.md](design-qa.md)。
