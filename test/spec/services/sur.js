'use strict';

describe('Service: sur', function () {

  // load the service's module
  beforeEach(module('gisApp'));

  // instantiate service
  var sur;
  beforeEach(inject(function (_sur_) {
    sur = _sur_;
  }));

  it('should do something', function () {
    expect(!!sur).toBe(true);
  });

});
