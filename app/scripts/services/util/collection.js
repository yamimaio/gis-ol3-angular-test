'use strict';

/**
 * @ngdoc service
 * @name util.collection
 * @description
 * # Collection
 * Provee utilidades comunes a utilizar por todos los componentes del sistema
 *  para el procesado de colecciones.
 */
angular.module('util').service('util.collection', [function() {

    /**
     * @ngdoc method
     * @name util.collection.method:findDeep
     * @description Busca en la colección indicada la jerarquía de elementos que
     *  contienen el valor __value__.
     *
     * @methodOf util.collection
     * @param {Array|Object|string} obj Colección en la cual realizar la búsqueda.
     * @param {Function|Object|string} value The function called per iteration.
     *  If a property name or object is provided it will be used to create a
     *  ".pluck" or ".where" style callback, respectively. Este puede ser el valor
     *  de una propiedad, o puede estar especificada como {'propiedad' : 'valor'}
     *  {@link https://lodash.com/docs#find Ver documentación de lodash}.
     * @return {Array} Array de objetos|arrays que representan la jerarquía de
     *  objetos|arrays que contienen el valor buscado.
     * @example
     * <pre>
     *     this.findDeep({a: 1, b: [{c: 1}, {d: 2}]}, {d: 2});
     *     // [[{c: 1}, {d: 2}], {a: 1, b: [{c: 1}, {d: 2}]}, {d: 2}]
     * </pre>
     */
    this.findDeep = function(obj, value) {
        /*
         * Este método es un wrapper de _findDeep para no tener que definir en
         * la interfaz una propiedad adicional "result" para utilizar durante
         * la recursividad. La idea es que para e usuario de este método, eso
         * sea transparente.
         */

        /**
         * Busca recursivamente en la colección indicada, el objeto que contiene
         *  el valor __value__.
         * @param {Array|Object|string} obj Colección en la cual realizar la búsqueda.
         * @param {Function|Object|string} value The function called per iteration.
         *  If a property name or object is provided it will be used to create a
         *  ".pluck" or ".where" style callback, respectively. Este puede ser el valor
         *  de una propiedad, o puede estar especificada como {'propiedad' : 'valor'}
         *  {@link https://lodash.com/docs#find Ver documentación de lodash}.
         * @return {Object} Objeto|Array que contiene el valor buscado o un array
         *  vacío en caso de no encontrar el valor.
         */
        var search = function(obj, value) {
            if (_.find(obj, value)) {
                return [obj];
            }
            return _.flatten(_.map(obj, function(v) {
                return typeof v == 'object' ? search(v, value) : [
                ];
            }), true);
        };

        /**
         * Busca recursivamente en la colección indicada la jerarquía de elementos
         *  que contienen el valor __value__.
         * @param {Array|Object|string} obj Colección en la cual realizar la búsqueda.
         * @param {Function|Object|string} value The function called per iteration.
         *  If a property name or object is provided it will be used to create a
         *  ".pluck" or ".where" style callback, respectively. Este puede ser el valor
         *  de una propiedad, o puede estar especificada como {'propiedad' : 'valor'}
         *  {@link https://lodash.com/docs#find Ver documentación de lodash}.
         * @param {array} result Resultado final a devolver que va acumulando
         *  con cada iteración de la recursividad el objeto que contiene al
         *  objeto encontrado anteriormente.
         * @return {Array} Array de objetos|arrays que representan la jerarquía de
         *  objetos|arrays que contienen el valor buscado.
         */
        var _findDeep = function(obj, value, result) {
            //en la primera vuelta, result no está definido así que lo definimos
            //como una array vacío.
            result = result || [];

            //buscamos el objeto deseado (que cambia en cada iteración)
            var new_value = search(obj, value).pop();

            //si no se encontró ningun resultado, se devuelve el array vacío
            if (!new_value) {
                return []
            }

            //si se encontró un resultado
            //agregamos el resultado al array de respuesta
            result.push(new_value);

            //si el resultado NO es la colección inicial, agregamos una iteración
            //más para seguir armando la jerarquía
            if (!_.isEqual(obj, new_value)) {
                _findDeep(obj, new_value, result);
            }

            //cuando el resulado igual a la colección inicial, es que se ha
            //completado la búsqueda y se retorna la respuesta final con el
            //array completo.
            return result;
        };

        //llamamos a _findDeep.
        return _findDeep(obj, value);
    };

}])
;
