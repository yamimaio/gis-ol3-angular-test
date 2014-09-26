'use strict';

describe('Service: olSource', function () {

  // load the service's module
  beforeEach(module('gisApp'));

  // instantiate service
  var olSource;
  beforeEach(inject(function (_olSource_) {
    olSource = _olSource_;
  }));

  it('should do something', function () {
    expect(!!olSource).toBe(true);
  });

});
