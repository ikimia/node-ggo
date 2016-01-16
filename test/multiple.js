'use strict';

const test = require('tape');

const ggo = require('../index');

function testMultipleValues(resolving, rejecting) {
  return function (t) {
    const first = 5;
    const second = 10;
    t.plan(2);
    ggo(resolving(first, second), (err, actual) => t.is(actual, first * second));
    ggo(rejecting(first, second), (actual) => t.is(actual, first * second));
  };
}

test('yielding multiple promises', testMultipleValues(
    function* resolving(a, b) { return (yield Promise.resolve(a)) * (yield Promise.resolve(b)); },
    function* rejecting(a, b) { return (yield Promise.reject(a * (yield Promise.resolve(b)))); }));

const resolvingFunction = v => cb => process.nextTick(() => cb(null, v));
const rejectingFunction = v => cb => process.nextTick(() => cb(v));
test('yielding multiple functions', testMultipleValues(
  function* resolving(a, b) { return (yield resolvingFunction(a)) * (yield resolvingFunction(b)); },
  function* rejecting(a, b) { return (yield rejectingFunction(a * (yield resolvingFunction(b)))); }));

const resolvingSynchronousFunction = v => cb => cb(null, v);
const rejectingSynchronousFunction = v => cb => cb(v);
test('yielding multiple functions', testMultipleValues(
  function* resolving(a, b) { return (yield resolvingSynchronousFunction(a)) * (yield resolvingSynchronousFunction(b)); },
  function* rejecting(a, b) { return (yield rejectingSynchronousFunction(a * (yield resolvingSynchronousFunction(b)))); }));

test('yielding multiple values', testMultipleValues(
  function* resolving(a, b) { return (yield a) * (yield b); },
  function* rejecting(a, b) { throw (yield a) * (yield b); }));

test('returning multiple values', testMultipleValues(
  function* resolving(a, b) { yield; return a * b; },
  function* rejecting(a, b) { yield; throw a * b; }));

test('yielding a promise and a function', testMultipleValues(
    function* resolving(a, b) { return (yield Promise.resolve(a)) * (yield resolvingFunction(b)); },
    function* rejecting(a, b) { return (yield rejectingFunction(a * (yield Promise.resolve(b)))); }));

test('yielding a value and a function', testMultipleValues(
    function* resolving(a, b) { return (yield a) * (yield resolvingFunction(b)); },
    function* rejecting(a, b) { return (yield rejectingFunction(a * (yield b))); }));
