'use strict';

/**
 * @ngdoc overview
 * @name gisApp
 * @description
 * # SuriWebGis
 *  Sistema desarrollado por Sur Emprendimientos Tecnológicos.
 *
 *  #Dependencias externas
 *  Requiere que Angular esté instalado, así como las siguientes dependencias
 *  externas: ngAnimate, ngCookies, ngResource, ngRoute, ngSanitize, ngTouch,
 *  ui.sortable, ui.bootstrap-slider, restangular.
 *
 * @author Sur Emprendimientos Tecnológicos 2014.
 * @copyright Sur Emprendimientos Tecnológicos 2014.
 * @requires ol3
 * @requires sur
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
    'util',
    'ol3',
    'sur'
]).config(function($routeProvider, RestangularProvider) {
    //configura routers
    $routeProvider
        .when('/', {
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

    //configuro CORS
    RestangularProvider.setDefaultHttpFields({
        withCredentials: true
    });

    // set only for get method
    //pido campos adicionales en la respuesta de la lista
    RestangularProvider.requestParams.get = {
        'fields[0]': 'servicio',
        'fields[1]': 'groupId',
        'fields[2]': 'url',
        'fields[3]': 'serviceName'
    };

    //parseado de la respuesta de un pedido de colección según el recurso
    RestangularProvider.addResponseInterceptor(
        function(data, operation, what) {
            var extractedData;
            var routing = {
                layers: 'items',
                parents: 'parents'
            };

            // .. to look for getList operations
            if (operation === 'getList') {
                extractedData = data[routing[what]];
            } else {
                extractedData = data;
            }
            return extractedData;
        }
    );

    //seteo url base del servidor
    RestangularProvider.setBaseUrl(
        'http://developers.desa.suriwebgis.com.ar/valentin/htdocs/2/rest/1.0/');
});
