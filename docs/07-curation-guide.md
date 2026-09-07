# 仓库资料维护指南（v1.3）

网站用于浏览、找回和理解仓库；日常浏览不需要编辑任何资料。

## 找到资料

项目库搜索覆盖名称、描述、摘要、标签和解读正文，多个词按同时命中处理。年份和日期以北京时间解释。收藏回顾默认包含已退出公开 Stars 的已收录记录；退出原因不一定是主动取消。

输入查询时默认按相关性排序，无查询时按收藏时间；手动选择的 Stars/收藏时间/上游更新时间继续生效。仓库精确名称优先，其次是名称、标签、摘要与正文。少量人工同义词维护在 `app/src/domain/search.js`，例如“文字识别”会匹配 OCR；同一概念内任选一个词，多个概念仍须同时匹配。输入英文短词本身保留子串查找，扩展出的英文别名要求词边界。

搜索结果可直接打开命中章节并高亮正文；代码保持原样。仓库入口是标准链接，可复制地址或在新标签页打开。用途专题的项目顺序和理由在 `config/topics.json` 中人工维护。

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

关联说明用 `related_notes = { "目标ID" = "适用场景或差异" }`，键必须来自 `related`，不能自关联或重复。资料受限时添加 `guide_status = "limited"` 和非空 `guide_limitation`；正常解读可省略状态。未填写核查日期的资料仍属于待补介绍。

不再支持 stage、note、takeaway 或旧个人更新时间字段。旧资料必须完成迁移后才能构建。教程的 `resource_type = "learning"` 仅表示资源类型，不是用户学习状态。

## 修改与导出

从详情底部的资料维护进入表单，或在关于页打开内容维护。表单用于修改分类、类型、摘要、标签和公开解读，保留关联、来源、核查日期与个人归档。

v1.3 导出也保留关联说明、受限原因与人工复核的 README SHA。修改这些字段需编辑 Git 文件；页面不会把“复制或下载成功”当成来源已重新核查。

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

人工解读只写入 `content/repos/`；来源检查报告由专用命令写入 `data/guide-source-check.json`。禁止手改事实快照和 `app/public/data/` 构建文件。发布仍按当前授权的目标和范围执行。

## 来源复核

```shell
python3 scripts/check_guide_sources.py
python3 scripts/check_guide_sources.py --repo 1330468709
```

命令只读取 GitHub 默认 README 的 blob SHA，最多 4 个并发；设置 `GITHUB_TOKEN` 可使用认证额度。它不会运行 README 中的命令、修改解读或更新 `reviewed_at`。不设置后台定时检查；普通构建只读现有报告，完全不访问 GitHub。

首次基线来自 `docs/content-batches/*-sources.json` 的已读 README 证据；之后可由文章的 `reviewed_readme_sha` 指定。`sources[0]` 应保留这份默认 README 的公开 URL，变更来源 URL 后旧报告不再适用。无基线的条目写入报告的 `without_baseline`，不能宣称已比较。

- `unchanged`：README 内容版本相同，不代表上游所有文档和 API 都不变。
- `changed`：与已读版本不同，进入来源待核查；普通代码提交不会触发这个状态。
- `unavailable`：本次没有取得版本信息，无法判断是否变化，也进入来源待核查；不要将网络错误直接改成资料受限。
- `limited` 是人工判断的资料受限，例如上游已关停或源码已移除；它与自动观察独立，两个队列可能重叠。

处理变化时，先读取对应上游版本并复核正文、示例和关联说明，再将已读 blob SHA 写入 `reviewed_readme_sha`，更新实际核查日期与必要内容。不要未读就复制报告的 SHA 来消除提示。再次检查和构建后，已复核版本与观察值一致即可消除变化提示。子集检查保留其他条目的原检查日期；页面总日期只表示最近一次命令运行。

10 个已执行示例的完整脚本、固定直接依赖与限制在 [复验说明](examples/v1.3/README.md)。传递依赖记录用于说明实际安装环境，不是未来安装的锁定承诺。

## 已知边界

资料编辑只保留在页面内存里，强制关闭时不能保证恢复；不提供云端草稿或自动合并。示例中的运行说明与本地验证记录要分开，未执行的例子必须明说，不能依据上游宣传代写实测结论。
