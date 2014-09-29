'use strict';

/**
 * @ngdoc service
 * @name sur.LayerTree
 * @description
 * # LayerTree
 * Service in the Sur.
 */
angular.module('Sur').service('Sur.LayerTree', [function () {
        // AngularJS will instantiate a singleton by calling "new" on this function


        /**
         * Elemento html que representa una capa en el árbol de capas.
         * @param {String} name nombre de la capa.
         * @param {String} serviceName Service Name de la capa.
         * @returns {String} Elemento html que representa una capa en el árbol de capas.
         */
        this.getLayerDiv = function (name, serviceName) {
            return "<li data-servicename='" + serviceName + "'>"
                + "<span><i class='glyphicon glyphicon-file'></i> " + name
                + "</span>"
                + "<i class='glyphicon glyphicon-check'></i> "
                + "<span class='opacity'></span>";
        }


        /**
         * Build a tree layer from the map layers with visible and opacity
         * options, starting from layer.
         *
         * @param {type} layer
         * @returns {String}
         */
        this.buildLayerTree = function (layer) {
            var elem;
            var name = layer.get('name') ? layer.get('name') : "Group";
            var div = this.getLayerDiv(name, layer.get('serviceName'));
            if (layer.getLayers) {
                var sublayersElem = '';
                var layers = layer.getLayers().getArray(),
                    len = layers.length;
                for (var i = len - 1; i >= 0; i--) {
                    sublayersElem += this.buildLayerTree(layers[i]);
                }
                elem = div + " <ul class='group'>"
                    + sublayersElem
                    + "</ul></li>";
            } else {
                elem = div + " </li>";
            }
            return elem;
        };

        this.build = function (map) {
            return '<ul>' + this.buildLayerTree(map.getLayerGroup())
                + '</ul>';

            /*  $('#layertree').empty().append(elem);

             $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr(
             'title',
             'Collapse this branch');
             $('.tree li.parent_li > span').on('click', function (e) {
             var children = $(this).parent('li.parent_li').find(
             ' > ul > li');
             if (children.is(":visible")) {
             children.hide('fast');
             $(this).attr('title', 'Expand this branch').find(' > i').
             addClass(
             'glyphicon-plus').removeClass('glyphicon-minus');
             } else {
             children.show('fast');
             $(this).attr('title', 'Collapse this branch').find(' > i').
             addClass('glyphicon-minus').removeClass(
             'glyphicon-plus');
             }
             e.stopPropagation();
             });

             //hacer que el árbol creado sea ordenable
             makeLayerTreeSortable($('#layertree ul'), '.group');
             //Inicializa los sliders de opacidad
             setOpacitySlider($('.opacity'));
             //inicializa los checks de prendido y apagado de capas
             setOnOffChecks($('i'));*/
        };
    }]);
