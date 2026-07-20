const { test } = require('node:test');
const assert = require('node:assert/strict');

test('cents format used by the portal rows', () => {
  assert.equal((123456 / 100).toFixed(2), '1234.56');
});
