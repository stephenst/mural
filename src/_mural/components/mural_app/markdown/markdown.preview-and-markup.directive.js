
/**
 * @ngdoc directive
 * @name mural.markdown.previewAndMarkup
 * @memberof mural.markdown
 *
 * @summary
 *  This directive will insert the template for the patterns.
 */
angular.module("mural.markdown").directive("previewAndMarkup", function () {
    return {
        restrict: "A",
        scope: {
            patterns: "="
        },
        template: '<div once-wait-for="patterns" once-show="patterns.path" class="block block--example"> \
                        <div class="block block--preview" ng-hide="patterns.meta.hidecode">\
                            <div raw-include="raw-include" patterns="patterns" src="patterns.path"></div>\
                        </div> \
                        <div class="block block--description"> \
                            <div class="patterns-description"></div> \
                        </div> \
                        <div once-wait-for="patterns" class="example-code"> \
                            <a class="toggle-code" ng-hide="patterns.meta.hidecode" ng-class="{ active:patterns.togglecode }" ng-click="patterns.togglecode = !patterns.togglecode"><em class="fa fa-code fa-lg" /></a> \
                            <pre ng-show="patterns.togglecode"><code class="language-markup"></code></pre> \
                        </div> \
                        <div class="block--meta" ng-show="patterns.meta"> \
                            <div ng-repeat="meta in patterns.meta"> \
                                <span ng-hide="meta.hidecode">{{ meta }}</span> \
                            </div> \
                        </div>\
                    </div>'

    }
});
