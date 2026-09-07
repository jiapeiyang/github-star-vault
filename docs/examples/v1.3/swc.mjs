import assert from 'node:assert/strict';
import vm from 'node:vm';
import { transformSync } from '@swc/core';

const input = 'const price: number = 12; console.log(price * 2);';
const { code } = transformSync(input, {
  filename: 'example.ts',
  jsc: { parser: { syntax: 'typescript' }, target: 'es2022' },
});
const output = [];
// 执行的仅是上面这一行经审阅的自写示例，不接受外部源码。
vm.runInNewContext(code, { console: { log: value => output.push(value) } });
assert.deepEqual(output, [24]);
assert.ok(!code.includes(': number'));
console.log(JSON.stringify({ input, compiled: code.trim(), output }, null, 2));
