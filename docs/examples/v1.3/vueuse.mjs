import assert from 'node:assert/strict';
import { useCounter } from '@vueuse/core';

const { count, inc, dec, set, reset } = useCounter(1, { min: 0, max: 3 });
const values = [count.value];
inc(5); values.push(count.value);
dec(10); values.push(count.value);
set(2); values.push(count.value);
reset(); values.push(count.value);
assert.deepEqual(values, [1, 3, 0, 2, 1]);
console.log(JSON.stringify({ initial: 1, min: 0, max: 3, actions: ['initial', 'inc(5)', 'dec(10)', 'set(2)', 'reset()'], values }, null, 2));
