'use strict';

/**
 * @ngdoc function
 * @name gisApp.controller:GisCtrl
 * @description
 * # GisCtrl
 * Controller of the gisApp
 */
angular.module('gisApp').controller('GisCtrl', ['$scope', 'ol3.map',
    'ol3.layer', 'Sur.Layer', 'Sur.Group', 'util', function ($scope,
        olMap, olLayer, SurLayer, SurGroup, util) {

        $scope.map = olMap.create();
        $scope.layertree = {
            map: $scope.map,
            root: {
                name: $scope.map.getLayerGroup().get('name'),
                type: 'group',
                serviceName: $scope.map.getLayerGroup().get('serviceName'),
                olRef: $scope.map.getLayerGroup(),
                expanded: true,
                visible: $scope.map.getLayerGroup().getVisible(),
                items: []
            }
        };

        var createLayer = function (layer) {
            if (layer.servicio != 'Google') {
                var olLayer = SurLayer.createLayer(layer,
                    $scope.map);
            }
            return olLayer;
        };

        var addLayerToTree = function (layer, parents, olGroup) {
            //para cada grupo
            var child = {
                name: layer.get('name'),
                serviceName: layer.get('serviceName'),
                type: 'layer',
                olRef: layer,
                visible: layer.getVisible()
            };

            for (var i = 0; i < parents.length; i++) {
                var group = parents[i];
                child.group = util.cleanString(group.name);
                //si el grupo es el principal, agrego el hijo al layertree directamente
                if ($scope.layertree.root.serviceName == util.cleanString(group.name)) {
                    $scope.layertree.root.items.push(child);
                    break;
                }
                //si no es el principal
                //verifico si existe el grupo
                var parentGroup = _.find($scope.layertree.root.items,
                    function (node) {
                        return  node.type == 'group'
                            && node.serviceName == child.group;
                    });
                if (parentGroup) {
                    //si el grupo ya existe, le agrego la capa y salgo
                    parentGroup.items.push(child);
                    break;
                } else {
                    //si no existe ya, lo creo y le agrego el hijo
                    var groupNode = {
                        name: group.name,
                        type: 'group',
                        serviceName: util.cleanString(group.name),
                        expanded: false,
                        visible: true,
                        olRef: olGroup,
                        items: [child]
                    };
                }
                //defino a esta capa como el hijo de la siguiente interación
                child = groupNode;
            }
        };

        var addLayerToGroup = function (layer, parents) {
            var olGroup = olLayer.addLayerToGroup(layer, parents, $scope.map);
            addLayerToTree(layer, parents, olGroup);
            console.log($scope.layertree);
        };

        var createAndAddLayerToGroup = function (layer, index) {
            var olLayer = createLayer(layer);
            if (olLayer) {
                SurGroup.getParents(layer.groupId)
                    .then(function (parents) {
                        addLayerToGroup(olLayer, parents);
                    });
            }
        };

        $scope.loadLayers = function () {
            SurLayer.getLayers()
                .then(function (layers) {
                    layers.forEach(createAndAddLayerToGroup);
                });
        };

        $scope.toogleLayerVisibility = function (layer) {
            olLayer.toggleVisible(layer);
        };

        $scope.isGroupNode = function (layer) {
            return layer.getLayers ? true : false;
        };

        $scope.loadLayers();
    }]);