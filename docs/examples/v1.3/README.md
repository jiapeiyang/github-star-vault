# v1.3 公开用法示例

这 10 个短例子只使用自行构造的输入。它们验证一项具体 API 行为，不代表整仓库、实际业务或用户实践已经验证。对应版本、输入和输出也已写入仓库解读的「本地验证」小节；原例继续标为未执行。

## 复验方式

从 Star Vault 仓库根目录运行，先把本目录复制到新的临时目录：

```sh
example_dir="$(mktemp -d /tmp/star-vault-examples.XXXXXX)"
cp -R docs/examples/v1.3/. "$example_dir/"
cd "$example_dir"
npm install --ignore-scripts --no-audit --no-fund --registry=https://registry.npmjs.org
node run-all.mjs
```

`package.json` 只服务这些独立示例，不属于 Star Vault 应用依赖。请不要在原应用目录安装。所有直接依赖固定版本，`installed-packages.json` 记录本次实际安装的传递依赖版本、来源与完整性摘要；它不是锁文件，未来安装的传递依赖可能变化。

验证环境为 macOS 26.3.1 arm64、Node.js 24.14.0、npm 11.9.0。包全部来自 `registry.npmjs.org`，安装时禁用了生命周期脚本。SWC 的平台二进制由 npm 平台包提供，其他系统是否可用需另验。

单项可运行 `node <名称>.mjs`，Solid 使用 `node --conditions=browser solid.mjs`。`run-all.mjs` 已处理这一差异，并在任一例子失败时停止。

## 例子与范围

| 脚本 | 输入 → 验证点 | 依赖版本 | 未覆盖 |
| --- | --- | --- | --- |
| nanoid | 新记录 → 随机 ID、格式和修改标题后 ID 保留 | nanoid 6.0.1 | 碰撞概率实测、绝对唯一性 |
| json2csv | 含逗号/引号/零值的两条记录 → 精确 CSV | @json2csv/plainjs 7.0.8 | 流式大文件、公式注入、Excel 显示 |
| koa | 一次 loopback 查询 → JSON 与中间件执行顺序 | koa 3.2.1 | 业务输入校验、认证、负载 |
| sequelize | name → 默认颜色、修改对象、新记录状态 | sequelize 6.37.8；mysql2 3.24.3 | 任何数据库连接、SQL、保存和事务 |
| node-xlsx | 一张二维表 → Buffer → 相同表与值类型 | node-xlsx 0.21.2；xlsx 0.17.5 | 新版本、Office 显示、复杂格式、不可信文件 |
| swc | 一行 TypeScript → JavaScript → 24 | @swc/core 1.16.2 | 类型检查、完整应用构建 |
| vueuse | 初值和上下限 → 计数器 [1,3,0,2,1] | @vueuse/core 14.4.0；vue 3.5.42 | 浏览器存储、DOM 与生命周期 |
| solid | [0,2,2,3] → memo [0,4,4,6]、计算 3 次 | solid-js 1.9.15 | DOM、组件渲染、服务端响应式路径 |
| svelte | 组件与 props → 已转义的服务端 HTML | svelte 5.57.0 | 点击、浏览器 hydration、完整安全评估 |
| mshared | 主/子状态 → 共享读取、通知与退订 | mshared 0.0.4；react 16.14.0 | React 挂载、Qiankun、跨窗口 |

node-xlsx 0.24.0 在 npm 元数据中指向 SheetJS CDN 依赖。本次固定使用完全来自 npm registry 的 0.21.2 历史组合，只处理自写表格；没有声称这是最新版或适合处理任意外来文件。React 16.14.0 只满足 mshared 的旧 peer dependency。

## 运行与清理

- 除 Koa 对自己的 loopback 服务发出一次 HTTP 请求外，运行示例不访问网络，不使用真实账号或系统配置。
- Koa 监听 `127.0.0.1` 随机端口，在 `finally` 中关闭；实际端口打印于输出。最后一次是 53002，已额外用 `lsof` 确认没有监听。
- Sequelize 只 `define` / `build` / `set` / `toJSON`，不调用 `authenticate`、`sync`、`save`、`create` 或查询；结束调用 `close()`。
- Svelte 仅为动态加载自写编译产物创建 `.svelte-example-*` 临时子目录，`finally` 删除；本次结束后无残留。
- Nano ID 和 Koa 端口输出每次可能不同。Svelte HTML 注释和转义形式固定于所测版本；断言失败时应先查看真实输出与版本，不直接删掉断言。

完整输出见 [verified-output.txt](verified-output.txt)，公开来源见 [sources.json](sources.json)。本次最终执行退出码为 0，stderr 为空。第一次 Svelte 断言误以为 `>` 也会转义；查看真实输出后按此版本的合法文本转义修正，再完成全套复验，没有修改上游包。
