'use strict';

/**
 * @ngdoc service
 * @name ol3.map
 * @description
 * # Map
 * Wrapper de la clase ol.map de Openlayers con funcionalidad adicional.
 * @requires util.string
 */
angular.module('ol3').service('ol3.map', ['util.string', function(utilString) {
    /**
     * @ngdoc method
     * @name ol3.map.method:create
     * @description Crea una instancia de la clase ol.map de OpenLayers.
     * @methodOf ol3.map
     * @param {string} map Id del elemento del DOM que contendrá el mapa.
     * @param {string} name Nombre del grupo principal de capas.
     * @returns {ol.map} Mapa.
     */
    this.create = function(map, rootName) {
        // Create layers instances
        /*var layerOSM = new ol.layer.Tile({
         source: new ol.source.OSM(),
         name: 'OpenStreetMap'
         });*/

        // Create map
        var map = new ol.Map({
            target: map, // The DOM element that will contain the map
            renderer: 'canvas', // Force the renderer to be used
            // Create a view centered on the specified location and zoom level
            view: new ol.View({
                center: ol.proj.transform([-59.12, -35.80],
                    'EPSG:4326',
                    'EPSG:3857'),
                zoom: 4
            })
        });

        //seteamos name y serviceName del grupo principal que contiene todas
        //las capas y grupos
        map.getLayerGroup().set('name', rootName);
        map.getLayerGroup().set('serviceName',
            utilString.cleanString(rootName));

        return map;
    };

        /**
         * @ngdoc method
         * @name ol3.map.method:getProjection
         * @description Obtiene la proyección del mapa dado por __map__.
         * @methodOf ol3.map
         * @param {ol.map} map Instacia de ol.map para la cual se quiere obtener
         *  la proyección.
         * @returns {string} Proyección del mapa.
         */
        this.getProjection = function(map) {
    return map.getView().getProjection().getCode();
};

/**
 * @ngdoc method
 * @name ol3.map.method:getExtent
 * @description Obtiene el Extent del mapa dado por __map__.
 * @methodOf ol3.map
 * @param {ol.map} map Instacia de ol.map para la cual se quiere obtener
 *  el extent.
 * @returns {object} ol.Extent. Extent del mapa.
 */
this.getExtent = function(map) {
    return map.getView().calculateExtent(map.getSize());
};
}]);