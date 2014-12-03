/**
 * Mural Filters
 */

angular.module('mural.filters', []).filter('anchor', [function () {
    return function (text) {
        return text.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(/\s+/g, '-').toLowerCase();
    }
}]);
