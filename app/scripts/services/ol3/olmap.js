'use strict';

/**
 * @ngdoc service
 * @name ol3.olMap
 * @description
 * # olMap
 * Service in the ol3.
 */
angular.module('ol3').service('ol3.map', [function () {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.create = function () {
            // Create layers instances
            /*var layerOSM = new ol.layer.Tile({
             source: new ol.source.OSM(),
             name: 'OpenStreetMap'
             });*/

            // Create map
            var map = new ol.Map({
                target: 'map', // The DOM element that will contain the map
                renderer: 'canvas', // Force the renderer to be used
                // Create a view centered on the specified location and zoom level
                view: new ol.View({
                    center: ol.proj.transform([-59.12, -35.80],
                        'EPSG:4326',
                        'EPSG:3857'),
                    zoom: 4
                })
            });

            map.getLayerGroup().set('name', 'Principal');
            map.getLayerGroup().set('serviceName', 'Principal');

            return map;
        };

        this.getProjection = function (map) {
            return map.getView().getProjection().getCode();
        };

        this.getExtent = function (map) {
            return map.getView().calculateExtent(map.getSize());
        };
    }]);