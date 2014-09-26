'use strict';

describe('Controller: GisCtrl', function () {

    // load the controller's module
    beforeEach(module('gisApp'));

    var GisCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        GisCtrl = $controller('GisCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});
