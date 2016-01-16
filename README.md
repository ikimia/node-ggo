# ggo [![Build Status](https://travis-ci.org/ikimia/node-ggo.svg?branch=master)](https://travis-ci.org/ikimia/node-ggo)
Turn node-style asynchronous functions and promises to a synchronous code using ES6 generators.
## Requirements
ggo is an npm module intended to be run on node.js 4.0.0 and higher.  
This package is continuously tested on all minor versions from node.js 4.0.0 and higher using Travis CI.
## Installation
```bash
npm install ggo
```
## Example
```javascript
const ggo = require('ggo');
const request = require('request');

function* getJSON(url) {
  const res = yield cb => request.get(url, cb);
  return JSON.parse(res.body);
}

ggo(function* () {
  const status = yield* getJSON('https://status.github.com/api/status.json');
  console.log(status);
});
```
## Usage
### ggo(genOrFn[, callback])
`genOrFn` must be an initialized generator or a generator function that does not expect any arguments. Any other type will produce a `TypeError`.  
`callback`, if provided, must be a node-style callback, i.e. accepting an error and a result as an arguments.  
The return value of the generator will be provided as the result argument and if an error is thrown, it will be provided as the error argument.  
If `callback` is not provided, any error that the generator produces, will be thrown.

### Yieldable Objects
ggo supports the following types to be yielded:
- Single node-style callback argument functions (aka thunks)
- Promises
- Simple values, which will be returned as-is
- Arrays combining thunks, promises, generators or simple values to be run in parallel

### Parallelization
ggo allows parallelization by yielding an array.  
The array may contain any combination of:
- Single node-style callback argument functions (aka thunks)
- Promises
- Initialized generators
- Simple values, which will be returned as-is

When all given elements have finished processing, a new array that contains the results of the given elements in the same order will be returned.

### Generator Delegation Support
Delegation is supported using the `yield*` expression.  
To run in parallel, a generator can be passed as an element of the yielded array.

## License
Licensed under MIT.
