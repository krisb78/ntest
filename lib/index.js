var sys = require('sys');

// starts a new TestCase with the given description.
//
//   var assert = require('assert')
//   describe("An array")
//     it("tracks length", function() {
//       var a = [1]
//       assert.equal(1, a.length)
//     })
//
exports.describe = function(desc) {
  var test = new TestCase(desc);
  exports.testSuite.testCases.push(test);
  exports.testSuite.currentTestCase = test;
  return test;
}

// Adds a new test to the current TestCase.
exports.test = function(desc, callback) {
  if(!exports.testSuite.currentTestCase)
    this.describe();
  return exports.testSuite.currentTestCase.test(desc, callback);
}

exports.it = exports.test;

// stores info on the current suite of tests.
// exports.testSuite.runTests() is runs all tests.  If exports.testSuite.runOnExit
// is true (default), then tests are run when the process exits.
//
// This also functions as a test runner (something that reports the status of
// the tests as they are running.)
exports.testSuite = {
  runOnExit: true,
  passed: 0,
  failed: [],
  testCases: [],
  currentTestCase: null,

  runTests: function() {
    var len = this.testCases.length;
    for(var i = 0; i < this.testCases.length; ++i) {
      var testCase = this.testCases[i],
             tests = testCase.run(this);
          testsLen = tests.length;
      for(var j = 0; j < testsLen; ++j) {
        var test = tests[j];
        if(test.passed) {
          ++this.passed;
        } else {
          this.failed.push(test);
        }
      }
    }

    sys.puts("\n")

    this.displayResults()
  },

  displayResults: function() {
    var fail = this.failed.length
    sys.puts((this.passed + fail) + " tests.  " + this.passed + " passed, " + fail + " failed.\n");
    for(var f = 0; f < fail; ++f) {
      var test = this.failed[f];
      sys.puts('TEST: ' + test.description)
      sys.puts(this.red(test.error.stack))
      sys.puts("")
    }
  }, 

  greenDot: function(s) {
    sys.print(this.green(s || '.'))
  },

  redDot: function(s) {
    sys.print(this.red(s || 'F'))
  },

  color: function(color, message) { return "\033[" + color + "m" + message + "\033[1;37m"; },
  red: function(message)          { return this.color("0;31", message) },
  green: function(message)        { return this.color("0;32", message) }
}


// represents a group of tests for a common subject.  These tests share the same
// before/after callbacks (callbacks are unimplemented...)
var TestCase = function(desc) {
  this.description = (desc) ? desc : "";
  this.tests       = [];

  this.test = function(summary, callback) {
    var t = new Test(this, summary, callback)
    this.tests.push(t)
    return t;
  }

  this.run = function(runner) {
    this.tests.forEach(function(test) { test.run(runner) })
    return this.tests;
  }
}

// represents a single test, which is just an executable function and a description.
var Test = function(testCase, summary, callback) {
  this.testCase    = testCase;
  this.summary     = summary;
  this.description = (testCase.description + " " + summary).replace(/^\s+/i, '');
  this.callback    = callback //|| function() { throw "No callback." };
  this.passed      = false;
  this.error       = null;

  this.run = function(runner) {
    var context = {} // each test has a clean slate
    try {
      this.callback.apply(context);
      this.passed = true;
      this.error  = null;
      runner.greenDot()
    } catch(err) {
      this.error  = err;
      this.passed = false;
      runner.redDot()
    }
  }
}

process.addListener('exit', function() {
  if(!exports.testSuite.runOnExit) return;
  exports.testSuite.runTests()
})