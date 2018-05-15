# stubborn-queue

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]
[![conduct][conduct]][conduct-url]

[npm-image]: https://img.shields.io/npm/v/stubborn-queue.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/stubborn-queue
[travis-image]: https://img.shields.io/travis/sethvincent/stubborn-queue.svg?style=flat-square
[travis-url]: https://travis-ci.org/sethvincent/stubborn-queue
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard
[conduct]: https://img.shields.io/badge/code%20of%20conduct-contributor%20covenant-green.svg?style=flat-square
[conduct-url]: CODE_OF_CONDUCT.md

## About

A queue module with concurrency and that collects errors when they happen, then continue on with the next item in the queue, rather than emptying the queue on the first error.

This module was based in part on and takes some tests from [d3-queue](https://npmjs.com/d3-queue).

## Install

```sh
npm install --save stubborn-queue
```

## Usage

```js
var fs = require('fs')
var path = require('path')
var queue = require('stubborn-queue')

queue()
  .add(fs.readFile, path.join(__dirname, '..', 'index.js'))
  .add(fs.readFile, path.join(__dirname, '..', 'README.md'))
  .add(fs.readFile, path.join(__dirname, '..', 'package.json'))
  .done(function (errors, results) {
    console.log(errors, results)
  })
```

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## Conduct

It's important that this project contributes to a friendly, safe, and welcoming environment for all. Read this project's [code of conduct](CODE_OF_CONDUCT.md)

## Change log

Read about the changes to this project in [CHANGELOG.md](CHANGELOG.md). The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## License

[ISC](LICENSE.md)
