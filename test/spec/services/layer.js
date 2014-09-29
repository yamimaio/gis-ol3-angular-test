'use strict';

describe('Service: layer', function () {

  // load the service's module
  beforeEach(module('gisApp'));

  // instantiate service
  var layer;
  beforeEach(inject(function (_layer_) {
    layer = _layer_;
  }));

  it('should do something', function () {
    expect(!!layer).toBe(true);
  });

});
