'use strict';

/**
 * @ngdoc service
 * @name sur.Layer
 * @description
 * # layer
 * Service in the Sur.
 */
angular.module('Sur').service('Sur.Layer', ['Restangular', 'ol3.map',
    'ol3.layer', function (Restangular, olMap, ol3Layer) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        this.createLayer = function (layer, map) {
            //creo la capa OL y la agrego al mapa
            var olLayer = ol3Layer.create(layer, olMap.getProjection(map),
                olMap.getExtent(map));
            olLayer.setVisible(false);
            return olLayer;
        };

        this.getLayers = function () {
            var layers = Restangular.all('layers');
            // This will query/layers and return a promise.
            return layers.getList();
        };
    }]);
