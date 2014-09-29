'use strict';

/**
 * @ngdoc service
 * @name Sur.Group
 * @description
 * # group
 * Service in the Sur.
 */
angular.module('Sur').service('Sur.Group', ['Restangular', function (
        Restangular) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        this.getParents = function (groupId) {
            return Restangular.one('groups', groupId).getList('parents');
        };
    }
]);
