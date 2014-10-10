'use strict';

/**
 * @ngdoc service
 * @name sur.group
 * @description
 *  # Group
 *  Servicio para operar sobre grupos.
 * @requires Restangular
 */
angular.module('sur').service('sur.group',
    ['Restangular', function(Restangular) {

        /**
         * @ngdoc method
         * @name sur.group.method:getParents
         * @description Obtiene la lista de capas del servidor.
         * @methodOf sur.group
         * @param {number} groupId Id del grupo para el que se quieren obtener
         *  los padres.
         * @returns {promise} Promise que obtiene la lista de padres del grupo.
         */
        this.getParents = function(groupId) {
            //generamos el objeto restangular que trae un grupo en particular
            //y obtenemos acto seguido la promesa de obtener los padres.
            return Restangular.one('groups', groupId).getList('parents');
        };
    }
    ]);
