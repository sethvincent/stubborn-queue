var fs = require('fs')
var path = require('path')
var test = require('tape')

var queue = require('../')

test('example queue of fs.stat', function(t) {
  queue()
    .add(fs.stat, path.join(__dirname, '..', 'index.js'))
    .add(fs.stat, path.join(__dirname, '..', 'README.md'))
    .add(fs.stat, path.join(__dirname, '..', 'package.json'))
    .done(callback);

  function callback(errors, results) {
    t.notOk(errors)
    t.ok(results)
    t.end()
  }
})

test('collects multiple errors', function(t) {
  var q = queue()
  var task = createAsyncTask()
  var errorTask = createAsyncTask(0, { returnError: true })

  q.add(task)
  q.add(errorTask)
  q.add(task)
  q.add(errorTask)
  q.add(task)
  q.add(errorTask)
  q.done(callback)

  function callback(errors, results) {
    t.equal(errors.length, 3)
    t.ok(results)
    t.deepEqual(results, [
      { active: 1, index: 0 },
      { active: 1, index: 1 },
      { active: 1, index: 2 },
    ])
    t.end()
  }
})

test('collects multiple errors with concurrency', function(t) {
  var q = queue(3)
  var task = createAsyncTask()
  var errorTask = createAsyncTask(0, { returnError: true })

  q.add(task)
  q.add(errorTask)
  q.add(task)
  q.add(errorTask)
  q.add(task)
  q.add(errorTask)
  q.done(callback)

  function callback(errors, results) {
    t.equal(errors.length, 3)
    t.ok(results)
    t.deepEqual(results, [
      { active: 2, index: 0 },
      { active: 2, index: 1 },
      { active: 1, index: 2 },
    ])
    t.end()
  }
})

test('a serial queue of asynchronous closures processes tasks serially', function(t) {
  var tasks = []
  var task = createAsyncTask()

  var n = 10
  var q = queue(1)

  while (--n >= 0) tasks.push(task)
  tasks.forEach(function(t) { q.add(t) })
  q.done(callback)

  function callback(errors, results) {
    t.notOk(errors)

    t.deepEqual(results, [
      {active: 1, index: 0},
      {active: 1, index: 1},
      {active: 1, index: 2},
      {active: 1, index: 3},
      {active: 1, index: 4},
      {active: 1, index: 5},
      {active: 1, index: 6},
      {active: 1, index: 7},
      {active: 1, index: 8},
      {active: 1, index: 9}
    ])

    t.end()
  }
})

function createAsyncTask (counter, options) {
  options = options || {}
  var returnError = options.returnError
  var active = 0

  if (!counter) counter = {scheduled: 0}

  return function(callback) {
    var index = counter.scheduled++
    ++active

    process.nextTick(function() {
      try {
        callback(
          returnError ? new Error('!') : null,
          {active: active, index: index}
        )
      } finally {
        --active
      }
    })
  }
}

function createSyncTask (counter, options) {
  var active = 0;

  if (!counter) counter = {scheduled: 0};

  return function(callback) {
    try {
      callback(null, {active: ++active, index: counter.scheduled++});
    } finally {
      --active;
    }
  };

  options = options || {}
  var returnError = options.returnError
  var active = 0

  if (!counter) counter = {scheduled: 0}

  return function(callback) {
    var index = counter.scheduled++
    ++active

    process.nextTick(function() {
      try {
        callback(
          returnError ? new Error('!') : null,
          {active: active, index: index}
        )
      } finally {
        --active
      }
    })
  }
}
