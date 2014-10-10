'use strict';

/**
 * @ngdoc controller
 * @name gisApp.controllers:GisCtrl
 * @description
 * # GisCtrl
 * Controlador general de SuriWebGis.
 * Crea e inicializa el mapa principal de la aplicación, así como el árbol de
 *  capas.
 *
 * Requiere que los módulos de {@link ol3 Openlayers3} y {@link sur Sur} estén
 *  instalados.
 *
 * @scope
 * @requires $scope
 * @requires sur.map
 * @requires sur.layer
 * @requires sur.group
 * @requires sur.layertree
 * @todo buscar recursivamente el padre del elemento cuyo service name obtuve.
 */
angular.module('gisApp').controller('GisCtrl',
    ['$scope', 'sur.map', 'sur.layer', 'sur.group', 'sur.layertree',
        'util.collection',
        function($scope, SurMap, SurLayer, SurGroup, SurLayerTree,
            utilCollection) {

            //guardamos el scope del controlador para tenerlo accesible desde
            //las promises
            var $this = this;

            /**
             * @ngdoc property
             * @name gisApp.controllers:GisCtrl.property:map
             * @description Contiene el objeto ol.map de la aplicación.
             * @propertyOf gisApp.controllers:GisCtrl
             */
            this.map = {};
            /**
             * @ngdoc property
             * @name gisApp.controllers:GisCtrl.property:layertree
             * @description Contiene una representación del árbol de capas
             *  asociado al mapa dado por
             *  {@link gisApp.controllers:GisCtrl#properties_map map}.
             * @propertyOf gisApp.controllers:GisCtrl
             */
            $scope.layertree = {};

            $scope.sortableOptions = {
                oldIndex: 0,
                serviceName: '',
                containment: '#layertree',
                connectWith: '.group',
                cancel: '.slider',
                cursor: 'move',
                scroll: false,
                start: function(event, ui) {
                    $scope.sortableOptions.oldIndex = ui.item.index();
                    $scope.sortableOptions.serviceName =
                        ui.item.scope().layer.serviceName;
                },
                stop: function() {
                    //buscamos el objeto en layer tree que contiene como serviceName
                    //el elemento que movimos
                    var objectFamily = utilCollection.findDeep($scope.layertree,
                        {serviceName: $scope.sortableOptions.serviceName});

                    //dado que lo que retorna, puede ser un objeto o array, me
                    //aseguro que sea el objeto que contiene al array en ese
                    //caso
                    var newGroup = objectFamily[0].items ? objectFamily[0] :
                        objectFamily[1];

                    //busco el nuevo indice del elemento en su nuevo grupo
                    var newIndex = _.findIndex(newGroup.items,
                        {serviceName: $scope.sortableOptions.serviceName});

                    console.log($scope.layertree);
                    console.log($scope.sortableOptions.serviceName, newGroup,
                        $scope.sortableOptions.oldIndex, newIndex);

                    SurLayerTree.reorderLayer($scope.sortableOptions.serviceName,
                        newGroup.serviceName, $scope.sortableOptions.oldIndex,
                        newIndex);
                    console.log($this.map.getLayerGroup().getLayers());
                }
            };

            /**
             * @ngdoc method
             * @name gisApp.controllers:GisCtrl.method:init
             * @description Inicializa el mapa, creando un ol.map y el árbol de
             *  capas que lo representa.
             * @methodOf gisApp.controllers:GisCtrl
             */
            this.init = function() {
                //creo un mapa ol.map default
                this.map = SurMap.create('map', 'Principal');

                //creo el árbol de capas vacío y lo asocio al mapa
                $scope.layertree = SurLayerTree.create(this.map);
                //cargo las capas del servidor
                this.loadLayers();
            };

            /**
             * @ngdoc method
             * @name gisApp.controllers:GisCtrl.method:createLayer
             * @description A partir de la información de un servicio, dado por
             * __layer__, crea una capa ol.layer apropiada para el tipo de
             * servicio en cuestión.
             * @methodOf gisApp.controllers:GisCtrl
             * @param {object} layer Representación de un servicio, con la
             *  información necesaria para crear una capa.
             *
             *  Debe incluir las propiedades:
             *  <ul>
             *      <li>__servicio__: Tipo de servicio (WFS, WMS).</li>
             *      <li> __name__: Nombre la capa.</li>
             *      <li> __serviceName__: Nombre del feature o layer asociado al
             *      servicio.</li>
             *      <li> __url__: Url del servidor del que se obtiene el servicio.
             *      </li>
             *  </ul>
             * @return {ol.layer} Capa de ol3.
             */
            this.createLayer = function(layer) {
                //ol3 no soporta capas Google, así que si el servicio es de
                //Google, salteo la creación de la capa
                if (layer.servicio !== 'Google') {
                    //creo la capa ol.layer correspondiente
                    var olLayer = SurLayer.createLayer(layer,
                        SurMap.getProjection(this.map),
                        SurMap.getExtent(this.map));
                    return olLayer;
                }
            };

            /**
             * @ngdoc method
             * @name gisApp.controllers:GisCtrl.method:addLayerToGroup
             * @description Agrega la capa dada por __layer__ al grupo de capas
             *  correspondiente dentro del mapa de la aplicación, dado por
             *  {@link gisApp.controllers:GisCtrl#properties_map map} y luego agrega
             *  la capa al árbol de capas dado por
             *  {@link gisApp.controllers:GisCtrl#properties_layertree layertree}.
             * @methodOf gisApp.controllers:GisCtrl
             * @param {ol.layer} layer Capa de ol3 que se agregará al mapa.
             * @param {array} parents Jerarquía de grupos a la que pertenece la capa,
             *  que debe ser replicada tanto en
             *  {@link gisApp.controllers:GisCtrl#properties_map map} como en
             *  {@link gisApp.controllers:GisCtrl#properties_layertree layertree}.
             *
             *  Cada grupo es un objeto que debe contener las siguientes propiedades:
             *  <ul><li> __name__: Nombre del grupo.</li></ul>
             */
            this.addLayerToGroup = function(layer, parents) {
                //agrego la capa al grupo (y familia de grupos) que le
                //corresponde dentro del mapa y obtengo el grupo olGroup creado
                var olGroup = SurLayer.addLayerToGroup(layer, parents,
                    this.map);
                //actualizo el layertree
                SurLayerTree.addLayerToTree(layer, parents, olGroup);
            };

            /**
             * @ngdoc method
             * @name gisApp.controllers:GisCtrl.method:createAndAddLayerToGroup
             * @description Crea una capa ol.layer a partir de una representación
             *  de un servicio dada por __layer__. Una vez creada, la agrega al
             *  grupo de capas que le corresponde.
             * @methodOf gisApp.controllers:GisCtrl
             * @param {object} layer Representación de un servicio, con la
             *  información necesaria para crear una capa.
             *
             *  Debe incluir las propiedades:
             *  <ul>
             *      <li>__servicio__: Tipo de servicio (WFS, WMS).</li>
             *      <li>__name__: Nombre la capa.</li>
             *      <li>__serviceName__: Nombre del feature o layer asociado al
             *      servicio.</li>
             *      <li>__url__: Url del servidor del que se obtiene el servicio.</li>
             *      </ul>
             */
            this.createAndAddLayerToGroup = function(layer) {
                //creamos la capa de openlayers
                var olLayer = this.createLayer(layer);
                //los promises no conocen el scope, así que dentro del microscope
                //en el que se llama al promise, se define una varibale global
                //que define el microscope asociandolo al scope del controlador
                var $this = this;
                //si la capa se creo con éxito
                if (olLayer) {
                    //obtengo la familia de grupos del grupo al que corresponde
                    //la capa
                    SurGroup.getParents(layer.groupId)
                        .then(function(parents) {
                            //agrego la capa a la familia de grupos
                            $this.addLayerToGroup(olLayer, parents);
                        });
                }
            };

            /**
             * @ngdoc method
             * @name gisApp.controllers:GisCtrl.method:loadLayers
             * @description Carga del servidor del sistema representaciones de
             *  todos los servicios que ofrece. En caso de éxito, para cada uno,
             *  crea una capa ol.layer y la agrega al mapa de la aplicación y al
             *  árbol de capas.
             * @methodOf gisApp.controllers:GisCtrl
             */
            this.loadLayers = function() {
                //obtengo las capas del servidor
                SurLayer.getLayers()
                    .then(function(layers) {
                        //para cada capa, la creo y la agrego al grupo que le
                        //corresponde
                        layers.forEach($this.createAndAddLayerToGroup, $this);
                    });
            };

            /**
             * @ngdoc method
             * @name gisApp.controllers:GisCtrl.method:toogleLayerVisibility
             * @description Cambia la visibilidad en el mapa de la capa dada por
             *  __layer__.
             * @methodOf gisApp.controllers:GisCtrl
             * @param {object} layer Nodo de
             *  {@link gisApp.controllers:GisCtrl#properties_layertree layertree}
             *  que representa una capa o grupo de capas en el mapa dado por
             *  {@link gisApp.controllers:GisCtrl#properties_map map}
             */
            $scope.toogleLayerVisibility = function(layer) {
                //cambio la visibilidad de la capa
                SurLayerTree.toggleVisible(layer);
            };

            /**
             * @ngdoc method
             * @name gisApp.controllers:GisCtrl.method:isGroupNode
             * @description Verifica si la capa dada por __layer__ es del tipo
             *  *group*, es decir, es un grupo de capas.
             * @methodOf gisApp.controllers:GisCtrl
             * @param {object} layer Nodo de
             *  {@link gisApp.controllers:GisCtrl#properties_layertree layertree}
             *  que representa una capa o grupo de capas en el mapa dado por
             *  {@link gisApp.controllers:GisCtrl#properties_map map}.
             * @return {boolean} Si __layer__ es o no un grupo de capas.
             */
            $scope.isGroupNode = function(layer) {
                return layer.type === 'group' ? true : false;
            };

            /**
             * @ngdoc method
             * @name gisApp.controllers:GisCtrl.method:changeOpacity
             * @description Cambia la opacidad en el mapa de la capa dada por
             *  __layer__.
             * @methodOf gisApp.controllers:GisCtrl
             * @param {object} layer Nodo de
             *  {@link gisApp.controllers:GisCtrl#properties_layertree layertree}
             *  que representa una capa o grupo de capas en el mapa dado por
             *  {@link gisApp.controllers:GisCtrl#properties_map map}
             */
            $scope.changeOpacity = function(layer) {
                //cambio la opacidad de la capa
                SurLayerTree.changeOpacity(layer);
            };

            //** init *//
            this.init();

        }]);