'use strict';

/**
 * @ngdoc function
 * @name gisApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gisApp
 */
angular.module('gisApp')
    .controller('MainCtrl', function ($scope) {
        $scope.todos = [];
        $scope.addTodo = function () {
            $scope.todos.push($scope.todo);
            $scope.todo = '';
        };
        $scope.removeTodo = function (index) {
            $scope.todos.splice(index, 1);
        };
    });
