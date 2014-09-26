'use strict';

/**
 * @ngdoc service
 * @name ol3.olMap
 * @description
 * # olMap
 * Service in the ol3.
 */
angular.module('ol3').service('olMap', function olMap() {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.create = function () {
        // Create layers instances
        /*var layerOSM = new ol.layer.Tile({
         source: new ol.source.OSM(),
         name: 'OpenStreetMap'
         });*/

        // Create map
        return new ol.Map({
            target: 'map', // The DOM element that will contain the map
            renderer: 'canvas', // Force the renderer to be used
            // Create a view centered on the specified location and zoom level
            view: new ol.View({
                center: ol.proj.transform([-59.12, -35.80], 'EPSG:4326',
                    'EPSG:3857'),
                zoom: 4
            })
        });
    };

    this.getProjection = function (map) {
        return map.getView().getProjection().getCode();
    };

    this.getExtent = function (map) {
        return map.getView().calculateExtent(map.getSize());
    };

    this.findBy = function (layer, key, value) {
        if (layer.get(key) === value) {
            return layer;
        }

        // Find recursively if it is a group
        if (layer.getLayers) {
            var layers = layer.getLayers().getArray(),
                len = layers.length, result;
            for (var i = 0; i < len; i++) {
                result = this.findBy(layers[i], key, value);
                if (result) {
                    return result;
                }
            }
        }

        return null;
    };
});