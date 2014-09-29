'use strict';

/**
 * @ngdoc function
 * @name gisApp.controller:GisCtrl
 * @description
 * # GisCtrl
 * Controller of the gisApp
 */
angular.module('gisApp').controller('GisCtrl', ['$scope', 'ol3.map',
    'ol3.layer', 'Sur.Layer', 'Sur.Group', 'Sur.LayerTree', function ($scope,
        olMap, olLayer, SurLayer, SurGroup, SurLayerTree) {

        $scope.map = olMap.create();

        $scope.layers = [];

        $scope.layerTree = "";

        var createLayer = function (layer) {
            if (layer.servicio != 'Google') {
                var olLayer = SurLayer.createLayer(layer,
                    $scope.map);
            }
            return olLayer;
        };

        var addLayerToGroup = function (layer, parents) {
            olLayer.addLayerToGroup(layer, parents, $scope.map);
        };

        var createAndAddLayerToGroup = function (layer, index) {
            var olLayer = createLayer(layer);
            if (olLayer) {
                $scope.layers[index].olLayer = olLayer;
                $scope.layers[index].active = false;
                SurGroup.getParents(layer.groupId)
                    .then(function (parents) {
                        $scope.layers[index].parents = parents;
                        return parents;
                    })
                    .then(function (parents) {
                        addLayerToGroup(
                            $scope.layers[index].olLayer, parents);
                    });
            }
        };

        $scope.loadLayers = function () {
            SurLayer.getLayers()
                .then(function (layers) {
                    $scope.layers = layers;
                    return layers;
                })
                .then(function (layers) {
                    layers.forEach(createAndAddLayerToGroup);
                });
        };

        $scope.toogleLayerVisibility = function (layer) {
            layer.active = !layer.active;
            olLayer.toggleVisible(layer.olLayer);
        };

        $scope.buildLayerTreeFromMap = function () {
            $scope.layerTree = SurLayerTree.build($scope.map);
        };

    }]);