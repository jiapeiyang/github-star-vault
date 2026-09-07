import assert from 'node:assert/strict';
import { Parser } from '@json2csv/plainjs';

const input = [
  { name: 'Ada, "A"', count: 2 },
  { name: 'Lin', count: 0 },
];
const csv = new Parser({ fields: ['name', 'count'], eol: '\n' }).parse(input);
assert.equal(csv, '"name","count"\n"Ada, ""A""",2\n"Lin",0');
console.log(csv);
