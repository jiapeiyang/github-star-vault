# 仓库资料维护指南（v1.2）

网站用于浏览、找回和理解仓库；日常浏览不需要编辑任何资料。

## 找到资料

项目库搜索覆盖名称、描述、摘要、标签和解读正文，多个词按同时命中处理。年份和日期以北京时间解释。收藏回顾默认包含已退出公开 Stars 的已收录记录；退出原因不一定是主动取消。

## 资料文件

一仓库一份 `content/repos/<repo_id>.md`，使用 TOML frontmatter 与 Markdown 正文：

```toml
+++
repo_id = 123
category = "devtools-automation"
resource_type = "app"
tags = ["终端"]
summary = "客观描述仓库的用途。"
related = []
content_updated_at = "2026-09-07"
+++
```

`repo_id` 必须存在于事实数据中，示例数字不是实际仓库 ID。需要个人归档时可以添加 `personal_archived = true`，缺省为 false。

完成资料核查后，添加 `reviewed_at` 和 `sources`（HTTP/HTTPS URL 数组），并在正文中包含它是什么、适合什么场景、如何开始、一个使用示例、注意事项与相关项目、资料来源六个二级章节。日期只在实际核查后填写，完整性还需人工审阅。

不再支持 stage、note、takeaway 或旧个人更新时间字段。旧资料必须完成迁移后才能构建。教程的 `resource_type = "learning"` 仅表示资源类型，不是用户学习状态。

## 修改与导出

从详情底部的资料维护进入表单，或在关于页打开内容维护。表单用于修改分类、类型、摘要、标签和公开解读，保留关联、来源、核查日期与个人归档。

- 阅读预览与实际详情复用同一 Markdown 渲染器。
- 无修改导出保留内容更新时间；实际修改更新内容日期，不冒充重新核查来源。
- 下载后放入 `content/repos/`，核对数字文件名，审阅差异后提交。
- 导出只说明复制成功或已发起下载，网站在提交并成功发布后才更新。
- 不支持的元数据阻止导出，防止文件替换时悄悄丢失内容。

普通 Markdown 支持标题、段落、列表、引用、代码块和安全外链；代码可复制。HTML 不执行，远程图片显示文字说明。页内标题链接采用 `content-` 前缀，正文中用普通 `#标题` 锚点即可。

## 验证

```shell
python3 scripts/verify_data.py
python3 scripts/build_catalog.py
python3 scripts/generate_readme.py
python3 -m unittest discover -s tests
npm --prefix app test
npm --prefix app run test:sites
GITHUB_PAGES=true npm --prefix app run build
git diff --check
```

检查事实与人工内容的职责，禁止将资料写入 data/ 或 app/public/data/。发布仍按当前授权的目标和范围执行。

## 已知边界

资料编辑只保留在页面内存里，强制关闭时不能保证恢复；不提供云端草稿或自动合并。示例中的运行说明与本地验证记录要分开，未执行的例子必须明说，不能依据上游宣传代写实测结论。
