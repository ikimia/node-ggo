# ggo [![Build Status](https://travis-ci.org/ikimia/node-ggo.svg?branch=master)](https://travis-ci.org/ikimia/node-ggo)
**This project has moved to [forter/few](https://github.com/forter/few)**  
**Please install using `npm install few`**
* * *
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
const assert = require('assert');
const ggo = require('ggo');

function returnValue(v, callback) {
  process.nextTick(() => callback(null, v));
}

function* generateValue(v) {
  return yield cb => returnValue(v, cb);
}

ggo(function* () {
  const a = yield cb => returnValue(1, cb);
  const b = yield Promise.resolve(2);
  const c = yield 3;
  const d = yield* generateValue(4);

  const all = yield [
    cb => returnValue(1, cb),
    Promise.resolve(2),
    3,
    generateValue(4)
  ];

  assert.deepEqual([a, b, c, d], all);
});
```
## Usage
### ggo(genOrFn[, callback])
`genOrFn` must be an initialized generator or a generator function that does not expect any arguments. Any other type will produce a `TypeError`.  
`callback`, if provided, must be a node-style callback, i.e. accepting an error and a result as arguments.  
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
If any of the elements provides an error, the error will be thrown inside the generator.

### Generator Delegation Support
Delegation is supported using the `yield*` expression.  
To run in parallel, a generator can be passed as an element of the yielded array.

### Error Handling
Any error originating from yielded objects will be thrown inside the generator, and can be caught using `try...catch`.  
For example, the following code prints ERROR to stderr:
```javascript
ggo(function* () {
  try {
    yield Promise.reject(new Error('ERROR'));
  } catch (err) {
    console.error(err.message);
  }
});
```
If an error is thrown inside a generator (and not caught), it will be passed to the callback given as a second argument to `ggo` or thrown if a callback has not been given.  
The following example also prints ERROR to stderr:
```javascript
ggo(function* () {
  yield Promise.reject(new Error('ERROR'));
}, (err, result) => { console.error(err.message); });
```
In the following example, the uncaught error will crash the process. Make sure you handle all errors!
```javascript
ggo(function* () {
  yield Promise.reject(new Error('ERROR'));
});
```

## License
Licensed under MIT.
