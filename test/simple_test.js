var assert = require('assert')
process.mixin(GLOBAL, require('../lib'))

setup(function() {
  this.a = 1
})

test("assert equals", function() {
  assert.equal(1, this.a)
})

test("sample exception", function() {
  ++this.a;
})

teardown(function() {
  assert.equal(1, this.a) // this should fail for test #2
})