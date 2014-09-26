'use strict';

describe('Service: olLayer', function () {

  // load the service's module
  beforeEach(module('gisApp'));

  // instantiate service
  var olLayer;
  beforeEach(inject(function (_olLayer_) {
    olLayer = _olLayer_;
  }));

  it('should do something', function () {
    expect(!!olLayer).toBe(true);
  });

});
