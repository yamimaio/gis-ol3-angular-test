'use strict';

/**
 * @ngdoc service
 * @name util.string
 * @description
 * # String
 * Provee utilidades comunes a utilizar por todos los componentes del sistema
 *  para el procesado de texto.
 */
angular.module('util').service('util.string', [function() {

    /**
     * @ngdoc method
     * @name util.string.method:cleanString
     * @description Limpia un texto. Remueve Acentos, cambia *ñ* por *n* y
     *  remueve todo caracter que no sea letra ni número.
     * @methodOf util.string
     * @param {String} str Texto a limpiar.
     * @return {String} Texto limpio.
     */
    this.cleanString = function(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        // remove accents, swap ñ for n, etc
        var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
        var to = 'aaaaeeeeiiiioooouuuunc------';
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
