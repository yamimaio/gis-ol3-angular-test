'use strict';

describe('Service: olMap', function () {

  // load the service's module
  beforeEach(module('gisApp'));

  // instantiate service
  var olMap;
  beforeEach(inject(function (_olMap_) {
    olMap = _olMap_;
  }));

  it('should do something', function () {
    expect(!!olMap).toBe(true);
  });

});
