/* eslint-disable no-undef */
const assert = require('assert');
const test = require('./script');

describe('test', () => {
  it('canvas size equals 32', () => {
    assert.equal(test(), 32);
  });
});
