
/**
 * @ngdoc directive
 * @name mural.markdown.compile
 * @memberof mural.markdown
 */
angular.module("mural.markdown").directive("compile", [
    '$compile',
    function ($compile) {
        return function (scope, element, attrs) {
            scope.$watch(
                function (scope) {
                    return scope.$eval(attrs.compile);
                },
                function (value) {
                    var v = value? marked(value): value;
                    element.html(v);
                    $compile(element.contents())(scope);
                }
            );
        }
    }
]);
