var assert = require('assert')
process.mixin(GLOBAL, require('../lib'))

test("assert equals", function() {
  assert.equal(1, 1)
})

test("sample exception", function() {
  a.b
})