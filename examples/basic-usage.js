var fs = require('fs')
var path = require('path')
var queue = require('../index')

queue()
  .add(fs.readFile, path.join(__dirname, '..', 'index.js'))
  .add(fs.readFile, path.join(__dirname, '..', 'README.md'))
  .add(fs.readFile, path.join(__dirname, '..', 'package.json'))
  .done(function (errors, results) {
    console.log(errors, results)
  })
