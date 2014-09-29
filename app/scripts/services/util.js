'use strict';

/**
 * @ngdoc service
 * @name gisApp.util
 * @description
 * # util
 * Service in the gisApp.
 */
angular.module('gisApp').service('util', [function () {
        // AngularJS will instantiate a singleton by calling "new" on this function

        /**
         *
         * @param {type} str
         * @returns {String}
         */
        this.cleanString = function (str) {
            str = str.replace(/^\s+|\s+$/g, ''); // trim
            // remove accents, swap ñ for n, etc
            var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
            var to = "aaaaeeeeiiiioooouuuunc------";
            for (var i = 0, l = from.length; i < l; i++) {
                str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(
                    i));
            }
            str = str.replace(/[^A-Za-z0-9 -]/g, '') // remove invalid chars
                .replace(/\s+/g,
                    ''); // collapse whitespace and replace nothing
            return str;
        };

    }]);
