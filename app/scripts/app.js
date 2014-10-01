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
    'ui.bootstrap-slider',
    'restangular',
    'ol3',
    'Sur'
]).config(function ($routeProvider, RestangularProvider) {
    //configura routers
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

    //configura RestangularProvider
    RestangularProvider.setDefaultHeaders({
        'Content-Type': 'application/json'
    });

    RestangularProvider.setDefaultHttpFields({
        withCredentials: true
    });

    // set only for get method
    RestangularProvider.requestParams.get = {
        'fields[0]': 'servicio',
        'fields[1]': 'groupId',
        'fields[2]': 'url',
        'fields[3]': 'serviceName'
    };

    RestangularProvider.addResponseInterceptor(
        function (data, operation, what, url, response, deferred) {
            var extractedData;
            var routing = {
                layers: 'items',
                parents: 'parents'
            };

            // .. to look for getList operations
            if (operation === "getList") {
                extractedData = data[routing[what]];
            } else {
                extractedData = data;
            }
            return extractedData;
        }
    );

    RestangularProvider.setBaseUrl(
        'http://developers.desa.suriwebgis.com.ar/valentin/htdocs/2/rest/1.0/');
});
