'use strict';
/**
 * @ngdoc service
 * @name ol3.source
 * @description
 * # Source
 * Wrapper de la clase ol.source de Openlayers con funcionalidad adicional.
 * @requires $http
 */
angular.module('ol3').service('ol3.source', ['$http', function($http) {

    //uri harcodeada
    this.uri = "http://yamilamaio.gis.suremptec.com.ar";

    /**
     * @ngdoc method
     * @name ol3.source.method:createStatic
     * @description Crea un ol.source.StaticVector.
     * @methodOf ol3.source
     * @param {string} serviceName Nombre del servicio (feature o layer).
     * @param {string} url Url del servicio.
     * @param {string} mapProjection Proyección del mapa.
     * @param {array} mapExtent Extent del servicio.
     * @returns {ol.source.StaticVector} StaticVector source.
     */
    this.createStatic = function(serviceName, url, mapProjection, mapExtent) {
        return new ol.source.StaticVector({
            format: new ol.format.WFS({
                featureNS: "http://mapserver.gis.umn.edu/mapserver",
                featureType: serviceName
            }),
            projection: mapProjection,
            url: url
                + 'service=WFS&version=1.1.0&request=GetFeature&'
                + 'typename=feature:' + serviceName
                + '&srsname=' + mapProjection
                + '&bbox=' + mapExtent.join(',')
                + '&outputFormat=text/xml; subtype=gml/3.1.1'
        });
    };

    /**
     * @ngdoc method
     * @name ol3.source.method:createServer
     * @description Crea un ol.source.ServerVector.
     * @methodOf ol3.source
     * @param {string} serviceName Nombre del servicio (feature o layer).
     * @param {string} url Url del servicio.
     * @param {string} mapProjection Projección del mapa.
     * @returns {ol.source.ServerVector} ServerVector source.
     */
    this.createServer = function(serviceName, url, mapProjection) {
        var source = new ol.source.ServerVector({
            url: url,
            format: new ol.format.WFS({
                featureNS: "http://mapserver.gis.umn.edu/mapserver",
                featureType: serviceName
            }),
            projection: mapProjection,
            loader: function(extent, resolution, projection) {
                $http({
                    method: "get",
                    url: url,
                    params: {
                        service: "WFS",
                        version: "1.1.0",
                        request: "GetFeature",
                        typename: "feature:" + serviceName,
                        srsname: mapProjection,
                        bbox: extent.join(','),
                        outputFormat: "text/xml; subtype=gml/3.1.1'"
                    }
                }).then(function(response) {
                    source.addFeatures(source.readFeatures(response));
                });
            },
            strategy: ol.loadingstrategy.bbox
        });
        return source;
    };

    /**
     * @ngdoc method
     * @name ol3.source.method:getUrl
     * @description Arma la url completa.
     * @methodOf ol3.source
     * @param {string} url Url relativa provista por el servicio local.
     * @returns {string} Url completa.
     */
    this.getUrl = function(url) {
        return this.uri + '/' + url;
    };

    /**
     * @ngdoc method
     * @name ol3.source.method:create
     * @description Crea un ol.Source del tipo dado por __type__.
     * @methodOf ol3.source
     * @param {string} type Tipo de servicio.
     * @param {string} serviceName Nombre del servicio (feature o layer).
     * @param {string} url Url del servicio.
     * @param {string} projection Projección del mapa.
     * @param {array} extent Extent del servicio.
     * @returns {ol.source.ServerVector|ol.source.StaticVector}  Source.
     */
    this.create = function(type, serviceName, url, projection, extent) {
        url = this.getUrl(url);

        switch (type) {
            case 'server':
                return this.createServer(serviceName, url, projection);
            default:
                return this.createStatic(serviceName, url, projection,
                    extent);
        }
    }
    ;
}]);
