'use strict';

const test = require('tape');

const ggo = require('../index');

function testSingleValue(resolving, rejecting) {
  return function (t) {
    const expected = Symbol();
    t.plan(2);
    ggo(resolving(expected), (err, actual) => t.is(actual, expected));
    ggo(rejecting(expected), (actual) => t.is(actual, expected));
  };
}

test('yielding a single promise', testSingleValue(
    function* resolving(v) { return yield Promise.resolve(v); },
    function* rejecting(v) { yield Promise.reject(v); }));

test('yielding a single function', testSingleValue(
  function* resolving(v) { return yield cb => process.nextTick(() => cb(null, v)); },
  function* rejecting(v) { yield cb => process.nextTick(() => cb(v)); }));

test('yielding a single synchronous function', testSingleValue(
  function* resolving(v) { return yield cb => cb(null, v); },
  function* rejecting(v) { yield cb => cb(v); }));

test('yielding a single value', testSingleValue(
  function* resolving(v) { return yield v; },
  function* rejecting(v) { throw yield v; }));

test('returning a single value', testSingleValue(
  function* resolving(v) { yield; return v; },
  function* rejecting(v) { yield; throw v; }));
