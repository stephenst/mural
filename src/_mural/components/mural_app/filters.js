/**
 * @ngdoc overview
 * @name mural.filters
 * @memberof mural
 *
 * @classdesc
 *  The Mural Filters for replacing text
 *
 * @requires {@Link mural.filters.anchor}
 *
 */

angular.module('mural.filters', []).filter('anchor', [function () {
    /**
     * @ngdoc filter
     * @name mural.filters.anchor
     * @memberof mural.filters
     */
    return function (text) {
        return text.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s+/g, '-').toLowerCase();
    };
}]);
