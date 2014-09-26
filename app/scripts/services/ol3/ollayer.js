'use strict';

/**
 * @ngdoc service
 * @name ol3.olLayer
 * @description
 * # olLayer
 * Service in the ol3.
 */
angular.module('ol3').service('olLayer', function olLayer(olSource) {
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
                return this.createVectorLayer(layer.name, layer.serviceName,
                    layer.url, projection, extent);
        }
    };
});

