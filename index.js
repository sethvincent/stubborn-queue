var assert = require('assert-argument')

module.exports = Queue

function Queue (concurrency) {
  if (!(this instanceof Queue)) {
    return new Queue(concurrency)
  }

  this._concurrency = concurrency || 1
  this._tasks = []
  this._tasksWaiting = 0
  this._tasksRunning = 0
  this._tasksDone = 0
  this._errors = []
  this._results = []
  this._lock = null
}

Queue.prototype.add = function Queue_add (callback) {
  assert.isFunction(callback, 'Queue.add: function required as first argument')
  var args = Array.prototype.slice.call(arguments, 1)
  args.push(callback)
  ++this._tasksWaiting
  this._tasks.push(args)
  this._next()
  return this
}

Queue.prototype._next = function Queue_next () {
  var self = this

  if (this._tasksRunning === this._concurrency) {
    return
  }

  if (!this._tasks.length && !this._tasksWaiting) {
    if (this._tasksRunning) return
    return this._onEnd(this._errors.length ? this._errors : null, this._results)
  }

  var taskArguments = this._tasks.shift()
  var task = taskArguments.splice(-1, 1)[0]
  taskArguments.push(callback)

  --self._tasksWaiting
  ++self._tasksRunning
  task.apply(null, taskArguments)

  function callback (err, result) {
    if (err) {
      self._errors.push(err)
    }

    // result will be null if there's an error
    // pushing a null result keeps the index accurate
    self._results.push(result)
    --self._tasksRunning
    self._next()
  }
}

Queue.prototype.done = function Queue_done (callback) {
  assert.isFunction(callback, 'Queue.done: function required as first argument')
  this._onEnd = callback
}
