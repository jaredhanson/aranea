/* global describe, it, expect */

var pkg = require('..');

describe('anansi', function() {
  
  it('should export object', function() {
    expect(pkg).to.be.an('object');
  });
  
});
