'use strict';

/**
 * @ngdoc service
 * @name sur.layer
 * @description
 * # Layer
 * Servicio para operar sobre capas.
 * @requires Restangular
 * @requires ol3.layer
 */
angular.module('sur').service('sur.layer',
    ['Restangular', 'ol3.layer', function(Restangular, ol3Layer) {

        /**
         * @ngdoc method
         * @name sur.layer.method:serviceDictionary
         * @description Get Service Type From Layer Type.
         * @methodOf sur.layer
         * @param {string} layerType Tipo de servicio.
         * @returns {string} Service type.
         */
        this.serviceDictionary = function(layerType) {
            var services = {};
            services[1] = 'WMS';
            services[2] = 'WMS';
            services[4] = 'WFS';
            services[5] = 'Google';
            services['WMS'] = 'WMS';
            services['WMST'] = 'WMS';
            services['WFS'] = 'WFS';
            services['Google'] = 'Google';
            return services[layerType];
        };

        /**
         * @ngdoc method
         * @name sur.layer.method:createLayer
         * @description Crea una capa ol.layer correspondiente al tipo de servicio
         * @methodOf sur.layer
         * @param {object} layer Representación de un servicio.
         * @param {string} projection Proyección para crear la capa.
         * @param {object} ol.extent. Extent en el que debe crearse el servicio.
         * @returns {ol.layer} Capa de Openlayers.
         */
        this.createLayer = function(layer, projection, extent) {
            //obtengo el servicio correspondiente
            layer.service = this.serviceDictionary(layer.servicio);
            //creo la capa OL y la agrego al mapa
            var olLayer = ol3Layer.create(layer, projection, extent);
            olLayer.setVisible(false);
            return olLayer;
        };

        /**
         * @ngdoc method
         * @name sur.layer.method:getLayers
         * @description Obtiene la lista de capas del servidor.
         * @methodOf sur.layer
         * @returns {promise} Promise que obtiene la lista de servicios del servidor.
         */
        this.getLayers = function() {
            //definimos la ruta para la colección de layers.
            var layers = Restangular.all('layers');
            // This will query/layers and return a promise.
            return layers.getList();
        };

        /**
         * @ngdoc method
         * @name sur.layer.method:addLayerToGroup
         * @description  Agrega la capa dada por __layer__ al ol.layer.group
         *  correspondiente, realizando el anidamiento adecuado dado por __parents__.
         * @methodOf sur.layer
         * @param {ol.layer} layer Capa a agregar a un grupo.
         * @param {array} parents Array de grupos padres.
         * @param {ol.map} map Mapa al que se agrega la capa y sus grupos.
         * @returns {ol.layer.group} Grupo en el que se incluyó la capa.
         */
        this.addLayerToGroup = function(layer, parents, map) {
            return ol3Layer.addLayerToGroup(layer, parents, map);
        }
    }]);
