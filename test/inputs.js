'use strict';

const test = require('tape');

const ggo = require('../index');

const expected = Symbol();

function testValue(genOrFn) {
  return function (t) {
    t.plan(1);
    ggo(genOrFn, (err, actual) => t.is(actual, expected));
  };
}

test('passing a generator function should pass value',
    testValue(function* () { return yield expected; }));

test('passing a generator should pass value',
    testValue((function* () { return yield expected; }())));

test('not passing a callback generator should not fail', function (t) {
  t.plan(1);
  ggo(function* () { return yield t.pass(); });
});

const OPTIONS = [undefined, null, {}, 1, ''];
test('passing a wrong type for generator and callback should trigger an error callback', function (t) {
  t.plan(OPTIONS.length * 2);
  OPTIONS.forEach(o => ggo(o, err => {
    t.is(err.constructor, TypeError);
    t.is(err.message, 'genOrFn must be a generator or a generator function');
  }));
});

test('passing a wrong type for generator and no callback should throw an error', function (t) {
  t.plan(OPTIONS.length);
  OPTIONS.forEach(o => t.throws(() => ggo(o),
      /genOrFn must be a generator or a generator function/));
});
