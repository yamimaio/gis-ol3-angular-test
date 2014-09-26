'use strict';

/**
 * @ngdoc function
 * @name gisApp.controller:GisCtrl
 * @description
 * # GisCtrl
 * Controller of the gisApp
 */
angular.module('gisApp').controller('GisCtrl', function ($scope, Restangular,
    olMap, olLayer) {

    $scope.map = olMap.create();

    $scope.layers = [];

    $scope.createLayer = function (layer) {
        return olLayer.create(layer, olMap.getProjection(
            $scope.map), olMap.getExtent($scope.map));
    };

    $scope.loadLayers = function () {
        Restangular.setDefaultHeaders({
            'Content-Type': 'application/json'
        });

        Restangular.setDefaultHttpFields({
            withCredentials: true
        });

        // set only for get method
        Restangular.requestParams.get = {
            'fields[0]': 'servicio',
            'fields[1]': 'groupId',
            'fields[2]': 'url',
            'fields[3]': 'serviceName'
        };

        Restangular.addResponseInterceptor(
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

        Restangular.setBaseUrl(
            'http://yamilamaio.gis.suremptec.com.ar/2/rest/1.0');

        var layers = Restangular.all('layers');


        // This will query/layers and return a promise.
        layers.getList().then(function (layers) {

            $scope.layers = layers;

            $scope.layers.forEach(function (layer) {
                //creo la capa OL y la agrego al mapa
                if (layer.servicio != 'Google') {
                    var olLayer = $scope.createLayer(layer);
                    //$scope.map.addLayer(olLayer);
                    olLayer.setVisible(false);
                    $scope.map.getLayers().push(olLayer);
                }

                layer.groups = Restangular.one('groups', layer.groupId)
                    .getList('parents').then(function (parents) {
                    // console.log(parents);
                });
            });

            console.log($scope.map);
        });
    };

    $scope.active = function (layer) {
        console.log(layer.active);
        var olLayer = olMap.findBy($scope.map.getLayerGroup(), 'serviceName',
            layer.serviceName);
        olLayer.setVisible(layer.active);
    };
});
