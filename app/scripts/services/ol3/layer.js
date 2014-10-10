'use strict';

/**
 * @ngdoc service
 * @name ol3.layer
 * @description
 * # Layer
 * Wrapper de la clase ol.layer de Openlayers con funcionalidad adicional.
 * @requires util.string
 * @requires ol3.source
 */
angular.module('ol3').service('ol3.layer',
    ['ol3.source', 'util.string', function(olSource, utilString) {

        /**
         * @ngdoc method
         * @name ol3.layer.method:createImageLayer
         * @description Crea una ol.layer.Image
         * @methodOf ol3.layer
         * @param {string} name Nombre de la capa.
         * @param {string} serviceName Nombre del servicio (feature o layer).
         * @param {string} url Url del servicio.
         * @returns {ol.layer.Image} ImageLayer.
         */
        this.createImageLayer = function(name, serviceName, url) {
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
         * @ngdoc method
         * @name ol3.layer.method:createVectorLayer
         * @description Crea una capa ol.layer.Vector.
         * @methodOf ol3.layer
         * @param {string} name Nombre de la capa.
         * @param {string} serviceName Nombre del servicio (feature o layer).
         * @param {string} url Url del servicio.
         * @param {string} projection Proyección del mapa.
         * @param {array} extent Extent del servicio.
         * @returns {ol.layer.Vector} VectorLayer.
         */
        this.createVectorLayer =
            function(name, serviceName, url, projection, extent) {
                return new ol.layer.Vector({
                    name: name,
                    serviceName: serviceName,
                    source: olSource.create('static', serviceName, url,
                        projection,
                        extent)
                });
            };

        /**
         * @ngdoc method
         * @name ol3.layer.method:create
         * @description Crea una capa openlayers ol.layer.
         * @methodOf ol3.layer
         * @param {object} layer Representación de un servicio. Debe incluir las
         *  siguientes  propiedades:
         *  <ul>
         *      <li>name: nombre de la capa.</li>
         *      <li>serviceName: nombre de la servicio (feature or layer).</li>
         *      <li>url: url del servicio.</li>
         *      <li>servicio: tipo de servicio.</li>
         * </ul>
         * @param {string} projection Proyección del mapa.
         * @param {ol.extent} Extent del mapa.
         * @returns {ol.layer} Layer.
         */
        this.create = function(layer, projection, extent) {
            //creamos la capa ol correspondiente
            switch (layer.service) {
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
         * @ngdoc method
         * @name ol3.layer.method:toggleVisible
         * @description Cambia la visibilidad de la capa dada por __layer__.
         * @methodOf ol3.layer
         * @param {ol.layer} layer Capa a la cual se le cambiará la visibilidad.
         */
        this.toggleVisible = function(layer) {
            layer.setVisible(!layer.getVisible());
        };

        /**
         * @ngdoc method
         * @name ol3.layer.method:changeOpacity
         * @description Cambia la opacidad de la capa dada por __layer__ al valor
         *  dado por __opacity__
         * @methodOf ol3.layer
         * @param {ol.layer} layer Capa a la cual se le cambiará la visibilidad.
         * @param {number} opacity Valor de opacidad.
         */
        this.changeOpacity = function(layer, opacity) {
            layer.setOpacity(opacity);
        };

        /**
         * @ngdoc method
         * @name ol3.layer.method:findBy
         * @description  Dado un __layerGroup__, busca el capa que tenga la
         * propiedad __key__ con el valor __value__.
         * @methodOf ol3.layer
         * @param {ol.layer.Group} layer Grupo de capas o capa dentro de la que
         *  se quiere encontrar la capa.
         * @param {string} key Propiedad en la que debe realizarse la búsqueda.
         * @param {string} value Valor a buscar.
         * @returns {ol.layer} Capa encontrada.
         */
        this.findBy = function(layer, key, value) {
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
         * @ngdoc method
         * @name ol3.layer.method:findByName
         * @description  Finds a layer given a __name__ attribute.
         * @methodOf ol3.layer
         * @param {string} name Nombre de la capa.
         * @returns {ol.layer} Capa encontrada o null en caso de no encontrar nada.
         */
        this.findByName = function(name, layers) {
            var length = layers.getLength();
            for (var i = 0; i < length; i++) {
                if (name === layers.item(i).get('name')) {
                    return layers.item(i);
                }
            }
            return null;
        };

        /**
         * @ngdoc method
         * @name ol3.layer.method:createOlGroup
         * @description  Crea una ol.layer.group.
         * @methodOf ol3.layer
         * @param {object} group Representación de un grupo. Debe tener las
         *  siguientes propiedades:
         *  <ul>
         *      <li>name: nombre del grupo.</li>
         *      <li>parentGroup:grupo al que pertenece el grupo. </li>
         *  </ul>
         * @param {ol.layer} layer Capa a agregar al grupo cuando se haya creado
         *  el mismo.
         * @returns {ol.layer.Group} Grupo de capas creado.
         * @todo revisar el parámetro group.
         */
        this.createOlGroup = function(group, layer) {
            return new ol.layer.Group({
                layers: [layer],
                name: group.name,
                serviceName: utilString.cleanString(group.name),
                group: group.parentGroup.id
            });
        };

        /**
         * @ngdoc method
         * @name ol3.layer.method:addLayerToGroup
         * @description  Agrega la capa dada por __layer__ al ol.layer.group
         *  correspondiente, realizando el anidamiento adecuado dado por __parents__.
         * @methodOf ol3.layer
         * @param {ol.layer} layer Capa a agregar a un grupo.
         * @param {array} parents Array de grupos padres.
         * @param {ol.map} map Mapa al que se agrega la capa y sus grupos.
         * @returns {ol.layer.group} Grupo en el que se incluyó la capa.
         */
        this.addLayerToGroup = function(layer, parents, map) {
            //para cada grupo
            var child = layer;
            for (var i = 0; i < parents.length; i++) {
                var group = parents[i];
                child.set('group', utilString.cleanString(group.name));
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

        /**
         * @ngdoc method
         * @name ol3.layer.method:getLayerOwnerCollection
         * @description
         *  Devuelve la colección a la que pertenece la capa.
         * @methodOf ol3.layer
         * @param {ol.layer} layer Capa para la cual se quiere encontrar la
         *  collección a la  que pertenece.
         * @param {ol.layer.Group} rootGroup Capa raíz del mapa a la que pertence
         *   la capa.
         * @returns {Array} Colección a la que pertence la capa.
         */
        this.getLayerOwnerCollection = function(layer, rootGroup) {
            //si no es una capa grupo
            return this.findBy(rootGroup, 'serviceName',
                layer.get('group')).getLayers();
        };

        /**
         * Returns the index of the layer within the collection.
         * @param {ol.collection} layers Layer collection.
         * @param {ol.layer} layer Instancia de ol.layer.
         * @returns {Number} Index of the layer within the collection or -1 if
         *  the layer was not found.
         */
        this.indexOf = function(layers, layer) {
            var length = layers.getLength();
            for (var i = 0; i < length; i++) {
                if (layer === layers.item(i)) {
                    return i;
                }
            }
            return -1;
        }
    }]);