var assert = require('assert')
process.mixin(GLOBAL, require('../lib'))

describe("test case #1:")
  test("assert equals", function() {
    assert.equal(1, 1)
  })

  test("sample exception", function() {
    a.b
  })

describe("test case #2:")
  test("assert equals", function() {
    assert.equal(1, 1)
  })

  test("sample exception", function() {
    a.b
  })