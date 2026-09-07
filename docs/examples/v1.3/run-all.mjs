import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const directory = dirname(fileURLToPath(import.meta.url));
const names = ['nanoid', 'json2csv', 'koa', 'sequelize', 'node-xlsx', 'swc', 'vueuse', 'solid', 'svelte', 'mshared'];
for (const name of names) {
  const args = [...(name === 'solid' ? ['--conditions=browser'] : []), join(directory, `${name}.mjs`)];
  const result = spawnSync(process.execPath, args, { cwd: directory, encoding: 'utf8', timeout: 15000 });
  console.log(`\n=== ${name} ===`);
  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log('\nPASS: 10 public examples');
