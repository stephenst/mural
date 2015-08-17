/**
 * Mural Directives
 */

angular.module('mural.directives', []).directive('compile', [
    '$compile',
    function ($compile) {
        /**
         * @ngdoc directive
         * @name mural.directives.compile
         * @memberof mural
         */
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
]).directive('previewAndMarkup', function () {
    /**
     * @ngdoc directive
     * @name mural.directives.previewAndMarkup
     * @memberof mural
     *
     * @summary
     *  This directive will insert the template for the patterns.
     */
    return {
        restrict: 'A',
        scope: {
            patterns: '='
        },
        template: '<div once-wait-for="patterns" once-show="patterns.path" class="block block--example"> \
                        <div class="block block--preview"><div raw-include="raw-include" patterns="patterns" src="patterns.path"></div></div> \
                        <div class="block block--description"> \
                            <div class="patterns-description"></div> \
                        </div> \
                        <div once-wait-for="patterns" once-hide="patterns.meta.hidecode" class="example-code"> \
                            <a class="toggle-code" ng-hide="patterns.meta.hidecode" ng-class="{ active:patterns.togglecode }" ng-click="patterns.togglecode = !patterns.togglecode"><em class="fa fa-code fa-lg" /></a> \
                            <pre ng-show="patterns.togglecode"><code class="language-markup"></code></pre> \
                        </div> \
                        <div class="block--meta" ng-show="patterns.meta.length"> \
                            <div ng-repeat="meta in patterns.meta"> \
                                {{meta}} \
                            </div> \
                        </div>\
                    </div>'

    }
}).directive('rawInclude', [
    '$http',
    '$templateCache',
    '$compile',
    '$q',
    '$timeout',
    '$log',
    function ($http, $templateCache, $compile, $q, $timeout, $log) {
        /**
         * @ngdoc directive
         * @name mural.directives.rawInclude
         * @memberof mural
         *
         * @requires $http
         * @requires $templateCache
         * @requires $compile
         * @requires $q
         * @requires $timeout
         * @requires $log
         */

        var totalcount = 0;

        return {
            restrict: 'A',
            terminal: true,
            scope: {
                patterns: '='
            },
            compile: function (telement, attr) {
                var srcExp = attr.src, count = 0;

                return function (scope, element) {
                    scope.$watch('patterns', function (newValue) {
                        if (newValue) {
                            if(scope.patterns && scope.patterns.children) totalcount = scope.patterns.children.length
                        }
                    }, true);

                    var changeCounter = 0;

                    scope.$watch(srcExp, function (src) {
                        var thisChangeId = ++changeCounter;

                        if (src) {
                            $http.get(src, {
                                cache: $templateCache
                            }).success(function (response) {
                                if (thisChangeId !== changeCounter) return;

                                /* Increment counter */
                                count++;

                                /**
                                 * Parsing Markdown files
                                 * @type {Object}
                                 */
                                var parsedContent = {
                                    yaml: '',
                                    markdown: '',
                                    html: '',
                                    meta: {}
                                };

                                var re = /^(-{3}(?:\n|\r)([\w\W]+?)-{3})?([\w\W]*)*/,
                                      results = re.exec(response.trim()),
                                      conf = {},
                                      yamlOrJson,
                                      name = "content";

                                if ((yamlOrJson = results[2])) {
                                    if (yamlOrJson.charAt(0) === '{') {
                                        conf = JSON.parse(yamlOrJson);
                                    } else {
                                        conf = jsyaml.load(yamlOrJson);
                                    }
                                }

                                conf[name] = results[3] ? results[3] : '';

                                /* Add description */
                                var $description = element.parent().next();

                                if (conf.description) {
                                    $log.info('CONF DESCRIPTION');
                                    parsedContent.markdown = marked(conf.description);
                                    $log.info(parsedContent.markdown);
                                    $description.html(parsedContent.markdown);
                                } else {
                                    /* If there is no description: Hide it */
                                    $description.hide();
                                }

                                /* Element preview */
                                element.html(conf.content);

                                /* Compile Angular directives */
                                $compile(element.contents())(scope);

                                /* Trigger element added */
                                if (count == totalcount) {
                                    $timeout(function () {
                                        angular.element('body').trigger('tapestry.completed')
                                    },500);
                                }

                                /* Element Syntax highlight */
                                var code = element.closest('.block--example').find('code'),
                                    $element = element.clone();

                                /* Adds codes to the code block */
                                code.text(conf.content.trim());

                                /* Highlighting */
                                Prism.highlightElement(code[0]);

                            }).error(function () {
                                if (thisChangeId === changeCounter) element.html('');
                            });
                        } else {
                            element.html('');
                        }
                    });
                };
            },
            link: function (scope, element, attrs) {
                if (scope.$last) {
                    $log.info(element);
                    $log.info(attrs);
                }
            }
        };
    }
]).directive('muralVersion', [
    'version',
    function (version) {
        /**
         * @ngdoc directive
         * @name mural.directives.muralVersion
         * @memberof mural
         */
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }
]).directive('lastUpdated', [
    'lastUpdated',
    function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }
]);
