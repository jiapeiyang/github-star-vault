import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import Koa from 'koa';

// 唯一的网络动作：向本脚本建立的临时 loopback 服务请求一次。
const app = new Koa();
const order = [];
app.use(async (ctx, next) => {
  order.push('before');
  await next();
  order.push('after');
  ctx.set('X-Example', 'local-only');
});
app.use(ctx => {
  order.push('handler');
  ctx.body = { greeting: `Hello ${ctx.query.name}`, total: Number(ctx.query.count) * 12 };
});
const server = app.listen(0, '127.0.0.1');
await once(server, 'listening');
const { port } = server.address();
try {
  const response = await new Promise((resolve, reject) => {
    const request = http.get({ hostname: '127.0.0.1', port, path: '/?name=Ada&count=2', agent: false }, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, type: res.headers['content-type'], example: res.headers['x-example'], body: JSON.parse(body) }));
      res.on('error', reject);
    });
    request.on('error', reject);
  });
  assert.deepEqual(response.body, { greeting: 'Hello Ada', total: 24 });
  assert.equal(response.status, 200);
  assert.equal(response.example, 'local-only');
  assert.deepEqual(order, ['before', 'handler', 'after']);
  console.log(JSON.stringify({ input: '/?name=Ada&count=2', response, order }, null, 2));
} finally {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
}
assert.equal(server.listening, false);
console.log(JSON.stringify({ port, listeningAfterClose: server.listening }));
