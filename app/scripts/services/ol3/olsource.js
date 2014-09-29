'use strict';
/**
 * @ngdoc service
 * @name ol3.olSource
 * @description
 * # olSource
 * Service in the gisApp.
 */
angular.module('ol3').service('ol3.source', ['$http', function ($http) {
// AngularJS will instantiate a singleton by calling "new" on this function

        this.uri = "http://yamilamaio.gis.suremptec.com.ar";

        /**
         * Crea un ol.source.StaticVector
         * @param {string} serviceName
         * @param {string} url
         * @param {string} mapProjection
         * @param {array} mapExtent
         * @returns {ol.source.StaticVector}
         */
        this.createStatic = function (serviceName, url, mapProjection,
            mapExtent) {
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
         * Crea un ol.source.ServerVector
         * @param {string} serviceName
         * @param {string} url
         * @param {string} mapProjection
         * @returns ol.source.ServerVector}
         */
        this.createServer = function (serviceName, url, mapProjection) {
            var source = new ol.source.ServerVector({
                url: url,
                format: new ol.format.WFS({
                    featureNS: "http://mapserver.gis.umn.edu/mapserver",
                    featureType: serviceName
                }),
                projection: mapProjection,
                loader: function (extent, resolution, projection) {
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
                    }).then(function (response) {
                        source.addFeatures(source.readFeatures(response));
                    });
                },
                strategy: ol.loadingstrategy.bbox
            });
            return source;
        };

        /**
         * Sanitiza la url
         * @param {string} url
         * @returns {String}
         */
        this.sanitizeUrl = function (url) {
            var sanitizedUrl = url.replace(/"/g, "");
            //armamos la url utilizando los parámetros del layer
            return sanitizedUrl + "?";
        };

        /**
         * Arma la url completa
         * @param {string} url
         * @returns {String}
         */
        this.getUrl = function (url) {
            return this.uri + '/' + url;
        };

        /**
         * Crea un ol.Source del tipo dado por <type>.
         * @param {string} type
         * @param {string} serviceName
         * @param {string} url
         * @param {string} projection
         * @param {array} extent
         * @returns {ol.source.ServerVector|ol.source.StaticVector}
         */
        this.create = function (type, serviceName, url, projection, extent) {
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
