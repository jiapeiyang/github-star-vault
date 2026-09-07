import assert from 'node:assert/strict';
import xlsxModule from 'node-xlsx';

// 0.21.2 是 CommonJS 包；这里只处理自行构造的数据与内存 Buffer。
const xlsx = xlsxModule.default ?? xlsxModule;
const input = [{ name: 'Report', data: [['Name', 'Count', 'Enabled'], ['Ada', 2, true], ['Lin', 0, false]] }];
const buffer = xlsx.build(input);
const sheets = xlsx.parse(buffer);
assert.deepEqual(sheets, input);
console.log(JSON.stringify({ isBuffer: Buffer.isBuffer(buffer), sheets }, null, 2));
