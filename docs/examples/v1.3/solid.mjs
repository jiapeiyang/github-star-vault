import assert from 'node:assert/strict';
import { createRoot, createSignal, createMemo } from 'solid-js';

// 用 node --conditions=browser solid.mjs 选择客户端响应式入口；不操作 DOM。
createRoot(dispose => {
  try {
    const [count, setCount] = createSignal(0);
    let evaluations = 0;
    const doubled = createMemo(() => { evaluations += 1; return count() * 2; });
    const values = [doubled()];
    setCount(2); values.push(doubled());
    setCount(2); values.push(doubled());
    setCount(3); values.push(doubled());
    assert.deepEqual(values, [0, 4, 4, 6]);
    assert.equal(evaluations, 3);
    console.log(JSON.stringify({ inputs: [0, 2, 2, 3], doubled: values, memoEvaluations: evaluations }, null, 2));
  } finally { dispose(); }
});
