import assert from 'node:assert/strict';
import { Shared } from 'mshared';

const main = new Shared({ storeName: 'main', initStore: { count: 0 }, type: 'global' });
const child = new Shared({ storeName: 'panel', initStore: { open: false }, type: 'child' });
child.setGlobalShare(main);
const updates = [];
child.subscribe((state, previous) => updates.push({ before: previous.main.count, after: state.main.count }));
main.setStore('main', { count: 2 });
const afterUpdate = child.getStore();
child.unSubscribe();
main.setStore('main', { count: 3 });
assert.deepEqual(afterUpdate, { main: { count: 2 }, panel: { open: false } });
assert.deepEqual(updates, [{ before: 0, after: 2 }]);
assert.equal(child.getStore().main.count, 3);
console.log(JSON.stringify({ afterUpdate, notifications: updates, afterUnsubscribe: child.getStore() }, null, 2));
