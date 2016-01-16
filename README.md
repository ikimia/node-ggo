# ggo
Turn node-style asynchronous functions and promises to a synchronous code using ES6 generators.
## Requirements
ggo is an npm module intended to be run on a node.js version that supports ES6 generators.
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
