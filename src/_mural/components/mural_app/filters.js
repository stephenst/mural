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
}]).filter('capitalize', [function () {
    /**
     * @ngdoc capitalize
     * @name mural.filters.capitalize
     * @memberof mural.filters
     */
    return function (input, all) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) : '';
    }
}]).filter('dashToSpace', [function () {
    /**
     * @ngdoc capitalize
     * @name mural.filters.capitalize
     * @memberof mural.filters
     */
    return function (text) {
        return text.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ').toLowerCase();
    };
}]);
