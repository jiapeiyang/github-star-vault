import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';

const source = '<script>let { name, count } = $props();</script><p>Hello {name}; total: {count * 12}</p>';
const { js, warnings } = compile(source, { filename: 'Greeting.svelte', generate: 'server' });
// 文件创建在复制到 /tmp 的示例目录旁，仅为加载自写编译产物，finally 清除。
const temporary = await mkdtemp(join(dirname(fileURLToPath(import.meta.url)), '.svelte-example-'));
try {
  const file = join(temporary, 'Greeting.mjs');
  await writeFile(file, js.code);
  const { default: Greeting } = await import(pathToFileURL(file).href);
  const { body } = render(Greeting, { props: { name: '<Ada>', count: 2 } });
  assert.equal(body, '<!--[--><p>Hello &lt;Ada>; total: 24</p><!--]-->');
  assert.equal(warnings.length, 0);
  console.log(JSON.stringify({ input: { name: '<Ada>', count: 2 }, html: body, warnings: warnings.length }, null, 2));
} finally { await rm(temporary, { recursive: true, force: true }); }
