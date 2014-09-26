'use strict';

/**
 * @ngdoc overview
 * @name gisApp
 * @description
 * # gisApp
 *
 * Main module of the application.
 */
angular.module('gisApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.sortable',
    'restangular',
    'ol3'
]).config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl'
        })
        .when('/gis', {
            templateUrl: 'views/gis.html',
            controller: 'GisCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});
