'use strict';

/**
 * @ngdoc service
 * @name ol3.olLayer
 * @description
 * # olLayer
 * Service in the ol3.
 */
angular.module('ol3').service('ol3.layer', ['ol3.source', 'util', function (
        olSource, util) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        /**
         * Get Service Type From Layer Type
         * @returns {string}
         */
        this.serviceDictionary = function (layerType) {
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
         * Crea una ol.layer.Image
         * @param {string} name
         * @param {string} serviceName
         * @param {string} url
         * @returns {ol.layer.Image}
         */
        this.createImageLayer = function (name, serviceName, url) {
            return new ol.layer.Image({
                name: name,
                serviceName: serviceName,
                source: new ol.source.ImageWMS({
                    url: url.replace(/"/g, ""),
                    params: {
                        layers: serviceName
                    }
                })
            });
        };

        /**
         * Crea una capa ol.layer.Vector
         * @param {string} name
         * @param {string} serviceName
         * @param {string} url
         * @param {string} projection
         * @param {array} extent
         * @returns {ol.layer.Vector}
         */
        this.createVectorLayer = function (name, serviceName, url, projection,
            extent) {
            return new ol.layer.Vector({
                name: name,
                serviceName: serviceName,
                source: olSource.create('static', serviceName, url, projection,
                    extent)
            });
        };

        /**
         * Crea una capa openlayers
         * @returns {olLayer}
         */
        this.create = function (layer, projection, extent) {
            var service = this.serviceDictionary(layer.servicio);

            switch (service) {
                case 'WMS':
                    return this.createImageLayer(layer.name, layer.serviceName,
                        layer.url);
                case 'WFS':
                    return this.createVectorLayer(layer.name,
                        layer.serviceName,
                        layer.url, projection, extent);
            }
        };

        /**
         * Cambia la visibilidad de la capa dada por layer.
         * @param {ol.layer} layer
         */
        this.toggleVisible = function (layer) {
            layer.setVisible(!layer.getVisible());
        };

        /**
         * Dado un layerGroup, busca el capa que tenga la propiedad key con el
         * valor value
         * @param {ol.layer.Group} layer
         * @param {string} key
         * @param {string} value
         * @returns {ol.layer}
         */
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
        };
        /**
         * Finds a layers given a 'name' attribute.
         * @param {type} name
         * @returns {unresolved}
         */
        this.findByName = function (name, layers) {
            var length = layers.getLength();
            for (var i = 0; i < length; i++) {
                if (name === layers.item(i).get('name')) {
                    return layers.item(i);
                }
            }
            return null;
        };

        this.createOlGroup = function (group, layer) {
            return new ol.layer.Group({
                layers: [layer],
                name: group.name,
                serviceName: util.cleanString(group.name),
                group: group.parentGroup.id
            });
        };


        this.addLayerToGroup = function (layer, parents, map) {
            //para cada grupo
            var child = layer;
            for (var i = 0; i < parents.length; i++) {
                var group = parents[i];
                child.set('group', util.cleanString(group.name));
                //si el grupo es el principal, agrego el hijo al mapa directamente
                if (map.getLayerGroup().get('name') == group.name) {
                    map.addLayer(child);
                    break;
                }
                //si no es el principal
                //verifico si existe el grupo
                var olGroupLayer = this.findByName(group.name,
                    map.getLayers());
                if (olGroupLayer) {
                    //si el grupo ya existe, le agrego la capa y salgo
                    olGroupLayer.getLayers().push(child);
                    break;
                } else {
                    //si no existe ya, lo creo y le agrego el hijo
                    var olGroupLayer = this.createOlGroup(group, child);
                }
                //defino a esta capa como el hijo de la siguiente interación
                child = olGroupLayer;
            }
            return child;
        };
    }]);

