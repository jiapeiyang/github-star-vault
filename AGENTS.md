# Star Vault Project Instructions

- 默认使用中文沟通和交付。
- `data/repositories.json` 只允许同步脚本写入；`content/repos/*.md` 只允许人工维护。
- `app/public/data/*.json` 是构建产物，禁止手改和提交。
- 同步、校验、目录生成脚本使用 Python 标准库；前端沿用 React、Vite 和 Phosphor。
- GitHub 事实、自动建议、个人内容必须在数据字段和界面中明确分离。
- 方案 E“开发者杂志”是长期视觉基线：纸白、近黑、单一洋红、编辑分栏、等宽仓库名、真实头像。
- 不引入数据库、在线编辑、AI 自动分类、语义搜索、锁、重试队列或缓存层，除非有真实使用证据。
- 完成改动后运行相关 Python 测试、`npm --prefix app run test`、`npm --prefix app run test:sites` 和 `npm --prefix app run build`。
- 交付时列出已验证内容与“我没有防什么”。
