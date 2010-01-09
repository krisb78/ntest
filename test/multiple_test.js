var assert = require('assert')
process.mixin(GLOBAL, require('../lib'))

describe("test case #1:")
  before(function() {
    this.a = 1
  })

  test("assert equals", function() {
    assert.equal(1, this.a)
  })

  test("sample exception", function() {
    ++this.a
  })

  after(function() {
    assert.equal(1, this.a) // this should fail for test #2
  })

describe("test case #2:")
  before(function() {
    this.a = 1
  })

  test("assert equals", function() {
    assert.equal(1, this.a)
  })

  test("sample exception", function() {
    ++this.a
  })

  after(function() {
    assert.equal(1, this.a) // this should fail for test #2
  })