'use strict';

/**
 * @ngdoc function
 * @name gisApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the gisApp
 */
angular.module('gisApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
