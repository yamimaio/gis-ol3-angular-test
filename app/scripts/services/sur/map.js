'use strict';

/**
 * @ngdoc service
 * @name sur.map
 * @description
 * # Map
 * Servicio para operar sobre mapas.
 * @requires ol3.map
 */
angular.module('sur').service('sur.map', ['ol3.map', function(olMap) {

    /**
     * @ngdoc method
     * @name sur.map.method:create
     * @description Crea un mapa ol.map y lo asocia al DOM Element dado por
     *  __map__ y le agrega el nombre al grupo principal de acuerdo a
     *  __rootName__.
     * @methodOf sur.map
     * @param {string} map DOM Element donde se quiere incluir el mapa.
     * @param {string} rootName Nombre del grupo principal de capas en el mapa.
     * @returns {ol.map} Instacia del mapa OL3.
     */
    this.create = function(map, rootName) {
        return olMap.create(map, rootName);
    }

    /**
     * @ngdoc method
     * @name sur.map.method:getProjection
     * @description Obtiene la proyección del mapa dado por __map__.
     * @methodOf sur.map
     * @param {ol.map} map Instacia de ol.map para la cual se quiere obtener
     *  la proyección.
     * @returns {string} Proyección del mapa.
     */
    this.getProjection = function(map) {
        return olMap.getProjection(map);
    };

    /**
     * @ngdoc method
     * @name sur.map.method:getExtent
     * @description Obtiene el Extent del mapa dado por __map__.
     * @methodOf ol3.map
     * @param {ol.map} map Instacia de ol.map para la cual se quiere obtener
     *  el extent.
     * @returns {ol.Extent} Extent del mapa.
     */
    this.getExtent = function(map) {
        return olMap.getExtent(map);
    };
}]);