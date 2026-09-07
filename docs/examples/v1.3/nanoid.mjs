import assert from 'node:assert/strict';
import { nanoid, customAlphabet } from 'nanoid';

const bookmark = { id: nanoid(), title: 'Cache guide' };
const stableId = bookmark.id;
bookmark.title = 'HTTP cache guide';
const makeShortId = customAlphabet('0123456789abcdef', 10);
const shortId = makeShortId();
assert.equal(bookmark.id, stableId);
assert.match(bookmark.id, /^[A-Za-z0-9_-]{21}$/);
assert.match(shortId, /^[0-9a-f]{10}$/);
console.log(JSON.stringify({ bookmark, length: bookmark.id.length, idPreserved: bookmark.id === stableId, shortId }, null, 2));
