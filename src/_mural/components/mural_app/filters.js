/**
 * Mural Filters
 */

angular.module('mural.filters', []).filter('anchor', [function () {
    /**
     * @ngdoc filter
     * @name mural.filters.anchor
     * @memberof mural
     */
    return function (text) {
        return text.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s+/g, '-').toLowerCase();
    }
}]);
