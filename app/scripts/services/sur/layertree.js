'use strict';

/**
 * @ngdoc service
 * @name sur.layertree
 * @description
 *  # LayerTree
 *  Servicio para generar y operar sobre un árbol de capas.
 * @requires util.string
 * @requires ol3.layer
 */
angular.module('sur').service('sur.layertree', ['util.string', 'ol3.layer',
    function(utilString, olLayer) {

        /**
         * @ngdoc property
         * @name sur.layertree.property:layertree
         * @description Objeto que representa un árbol de capas.
         * @type object
         * @propertyOf sur.layertree
         */
        this.layertree = {};

        /**
         * @ngdoc property
         * @name sur.layertree.property:map
         * @description Instancia ol.map asociada a this.layertree.
         * @type object
         * @propertyOf sur.layertree
         */
        this.map = {};

        /**
         * @ngdoc method
         * @name sur.layertree.method:create
         * @description Crea un árbol de capas vinculado a un mapa en particular,
         *  dado por __map__.
         * @methodOf sur.layertree
         * @param {ol.map} map Instancia de ol.map a la que debe vincularse
         *  el árbol de capas.
         * @returns {Object} this.layertree. Árbol de capas generado.
         */
        this.create = function(map) {
            this.map = map;
            this.layertree = {
                // map: map,
                root: {
                    name: map.getLayerGroup().get('name'),
                    type: 'group',
                    serviceName: map.getLayerGroup().get('serviceName'),
                    // olRef: map.getLayerGroup(),
                    expanded: true,
                    visible: map.getLayerGroup().getVisible(),
                    opacity: 1,
                    items: []
                }
            };
            return this.layertree;
        };

        /**
         * @ngdoc method
         * @name sur.layertree.method:addLayerToTree
         * @description Agrega un nodo del tipo *layer* vinculado a la capa
         *  __olLayer__, al árbol de capas dado por
         *  {@link sur.layertree#properties_layertree layertree}, así como
         *  todos los nodos de tipo *group* correspondientes a la jerarquía de
         *  grupos a la que pertenece la capa, dado por __parents__.
         *  Referencia el grupo creado con el objeto ol.layer.group del mapa
         *  dado por __olGroup__.
         * @methodOf sur.layertree
         * @param {ol.layer} olLayer Instancia de una capa OL3 para la que debe
         *  crearse el elemento en el árbol de capas.
         * @param {array} parents Jerarquía de grupos a la que pertence la capa.
         * @param {ol.layer.group} olGroup Instancia de un capa de tipo grupo
         *   de OL3 que debe asociarse al nodo creado para incluir la capa.
         * @returns {ol.layer.group} Instacia de ol.layer.group en la que  se
         *  incluyo la capa.
         */
        this.addLayerToTree = function(olLayer, parents, olGroup) {
            //para cada grupo
            var child = {
                name: olLayer.get('name'),
                serviceName: olLayer.get('serviceName'),
                type: 'layer',
                //olRef: olLayer,
                visible: olLayer.getVisible(),
                opacity: olLayer.getOpacity()
            };

            for (var i = 0; i < parents.length; i++) {
                var group = parents[i];
                child.group = utilString.cleanString(group.name);
                //si el grupo es el principal, agrego el hijo al layertree directamente
                if (this.layertree.root.serviceName ==
                    utilString.cleanString(group.name)) {
                    this.layertree.root.items.push(child);
                    break;
                }
                //si no es el principal
                //verifico si existe el grupo
                var parentGroup = _.find(this.layertree.root.items,
                    function(node) {
                        return  node.type == 'group'
                            && node.serviceName == child.group;
                    });
                if (parentGroup) {
                    //si el grupo ya existe, le agrego la capa y salgo
                    parentGroup.items.push(child);
                    break;
                } else {
                    //si no existe ya, lo creo y le agrego el hijo
                    var groupNode = {
                        name: group.name,
                        type: 'group',
                        serviceName: utilString.cleanString(group.name),
                        expanded: false,
                        visible: true,
                        opacity: 1,
                        //olRef: olGroup,
                        items: [child]
                    };
                }
                //defino a esta capa como el hijo de la siguiente interación
                child = groupNode;
            }
        };

        /**
         * @ngdoc method
         * @name sur.layertree.method:toggleVisible
         * @description Cambia la visibilidad de la capa dada por __layer__,
         *  tanto en el mapa como en el árbol de capas.
         * @methodOf sur.layertree
         * @param {ol.layer} olLayer Instancia de una capa OL3 para la que debe
         *  cambiarse la visibilidad.
         */
        this.toggleVisible = function(layer) {
            //cambio la visibilidad en el árbol de capas
            layer.visible = !layer.visible;

            //obtengo la capa equivalente del mapa
            var mapLayer = olLayer.findBy(this.map.getLayerGroup(),
                'serviceName', layer.serviceName);

            //cambio la visibilad de la cala en el mapa
            olLayer.toggleVisible(mapLayer);
        };

        /**
         * @ngdoc method
         * @name sur.layertree.method:changeOpacity
         * @description Cambia la opacidad de la capa ol.layer asociada a
         * __layer__.
         * @methodOf sur.layertree
         * @param {object} layer Nodo del árbol de capas que representa una
         *  capa.
         */
        this.changeOpacity = function(layer) {
            //obtengo la capa equivalente del mapa
            var mapLayer = olLayer.findBy(this.map.getLayerGroup(),
                'serviceName', layer.serviceName);

            //cambio la opacidad de la capa
            olLayer.changeOpacity(mapLayer, layer.opacity);
        };

        /**
         * Raise a layer by diff number of places.
         * @param {ol.layer} layer Capa a reordenar.
         * @param {int} diff Number of places to move layer
         * @returns {undefined}
         */
        this.raiseLayer = function(layer, diff) {
            var layers = olLayer.getLayerOwnerCollection(layer,
                this.map.getLayerGroup());
            var index = olLayer.indexOf(layers, layer);
            for (var i = 0; i < diff; i++) {
                var next = layers.item(index + i + 1);
                var indexNext = olLayer.indexOf(layers, next);
                layers.setAt(indexNext - 1, next);
            }
            layers.setAt(index + diff, layer);
        };

        /**
         * Lowers a layer by diff number of places.
         * @param {ol.layer} layer Capa a reordenar.
         * @param {int} diff Number of places to move layer.
         * @returns {undefined}
         */
        this.lowerLayer = function(layer, diff) {
            var layers = olLayer.getLayerOwnerCollection(layer,
                this.map.getLayerGroup());
            var index = olLayer.indexOf(layers, layer);
            for (var i = 0; i < diff; i++) {
                var prev = layers.item(index - 1 - i);
                var indexPrev = olLayer.indexOf(layers, prev);
                layers.setAt(indexPrev + 1, prev);
            }
            layers.setAt(index - diff, layer);
        };

        /**
         * @ngdoc method
         * @name sur.layertree.method:reorderLayer
         * @description
         *  Reordena las capas en el mapa, inclusive teniendo en cuenta los grupos.
         *  Si no se cambió de grupo newGroup y oldGroup son iguales y es un método
         *  válido tanto para cambios inter o intra grupos.
         * @methodOf sur.layertree
         * @param {String} serviceName Nombre de la capa que ha sido movida.
         * @param {String} newGroup Nombre del nuevo grupo en que se encuentra
         *  la capa.
         * @param {number} oldIndex Índice en el grupo original de la capa.
         * @param {number} newIndex Nuevo índice en el grupo actual de la capa.
         */
        this.reorderLayer =
            function(serviceName, newGroup, oldIndex, newIndex) {

                //si está seteado el service name y es diferente del grupo
                //principal (el principal no puede ser reordenado)
                if (serviceName &&
                    serviceName !=
                    this.map.getLayerGroup().get('serviceName')) {

                    var layer = olLayer.findBy(this.map.getLayerGroup(),
                        'serviceName', serviceName);

                    if (newGroup === layer.get('group')) {
                        //si la capa sigue dentro del mismo group, la muevo
                        // normalmente
                        var diff = oldIndex - newIndex;
                        diff > 0 ? this.lowerLayer(layer, Math.abs(diff)) :
                            this.raiseLayer(layer, Math.abs(diff));
                    } else {
                        //si la capa cambió de grupo

                        //obtengo el array de capas del grupo nuevo
                        var group = olLayer.findBy(this.map.getLayerGroup(),
                            'serviceName', newGroup);
                        var newLayers = group.getLayers();

                        //agrego la capa en el nuevo grupo en el indice que le
                        // corresponde
                        newLayers.insertAt(newIndex, layer);

                        //obtengo las capas del grupo anterior
                        var oldLayers = olLayer.findBy(this.map.getLayerGroup(),
                            'serviceName', layer.get('group')).getLayers();

                        //quito la capa del grupo anterior
                        oldLayers.remove(layer);

                        //cambio el nombre del grupo asociado a la capa
                        layer.set('group', newGroup);
                    }
                }

            };
    }]);
