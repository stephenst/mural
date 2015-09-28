/**
 * @ngdoc directive
 * @name mural.markdown.rawInclude
 * @memberof mural.markdown
 *
 * @requires $http
 * @requires $templateCache
 * @requires $compile
 * @requires $q
 * @requires $timeout
 * @requires $log
 */

"use strict";

angular.module("mural.markdown").directive("rawInclude", [
    "$http",
    "$templateCache",
    "$compile",
    "$q",
    "$timeout",
    "$log",
    function ($http, $templateCache, $compile, $q, $timeout, $log) {

        var totalcount = 0;

        return {
            restrict: "A",
            terminal: true,
            scope: {
                patterns: "="
            },
            compile: function (telement, attr) {
                var srcExp = attr.src, count = 0;

                return function (scope, element) {
                    var changeCounter = 0;

                    scope.$watch("patterns", function (newValue) {
                        if (newValue) {
                            if (scope.patterns && scope.patterns.children) {
                                totalcount = scope.patterns.children.length;
                            }
                        }
                    }, true);

                    scope.$watch(srcExp, function (src) {
                        var thisChangeId = ++changeCounter;

                        if (src) {
                            $http.get(src, {
                                cache: $templateCache
                            }).success(function (response) {
                                if (thisChangeId !== changeCounter) {
                                    return;
                                }

                                /* Increment counter */
                                count++;

                                /**
                                 * Parsing Markdown files
                                 * @type {Object}
                                 */
                                var parsedContent = {
                                    yaml: "",
                                    markdown: "",
                                    html: "",
                                    meta: {}
                                };

                                var re = /^(-{3}(?:\n|\r)([\w\W]+?)-{3})?([\w\W]*)*/,
                                    results = re.exec(response.trim()),
                                    conf = {},
                                    yamlOrJson,
                                    name = "content";

                                if ((yamlOrJson = results[2])) {
                                    if (yamlOrJson.charAt(0) === "{") {
                                        conf = JSON.parse(yamlOrJson);
                                    } else {
                                        conf = jsyaml.load(yamlOrJson);
                                    }
                                }

                                conf[name] = results[3] ? results[3] : results[2];

                                /* Add description */
                                var $description = element.parent().next();

                                if (conf.description) {
                                    // parsedContent.markdown = marked(conf.description);
                                    parsedContent.markdown = marked(conf.description);
                                    $description.html(parsedContent.markdown);
                                } else {
                                    /* If there is no description: Hide it */
                                    $description.hide();
                                }


                                //  if (conf.meta && conf.meta !== 'hidecode') {
                                //      $log.info('META DESCRIPTION');
                                //      scope.meta = marked(conf.meta);
                                //      $log.info(scope.meta);
                                //  }

                                /* Element preview */
                                element.html(conf.content);

                                /* Compile Angular directives */
                                $compile(element.contents())(scope);

                                /* Trigger element added */
                                if (count == totalcount) {
                                    $timeout(function () {
                                        angular.element("body").trigger("mural.completed");
                                    },500);
                                }

                                /* Element Syntax highlight */
                                var code = element.closest(".block--example").find("code");
                                // $element = element.clone();
                                // console.log(code);

                                angular.forEach(code, function(value, key) {
                                    this.push(key + ": " + value);
                                    // console.log("code for each, value, then key");
                                    // console.log(value);
                                    // console.log(key);

                                    /* Adds codes to the code block */
                                    code[key].text = conf.content.trim();

                                    /* Highlighting */
                                    Prism.highlightElement(code[key]);

                                }, code);


                            }).error(function () {
                                if (thisChangeId === changeCounter) {
                                    element.html("");
                                }
                            });
                        } else {
                            element.html("");
                        }
                    });
                };
            },
            link: function (scope, element, attrs) {
                if (scope.$last) {
                    $log.info("rawInclude link: is scope last.  element and attrs follow");
                    $log.info(element);
                    $log.info(attrs);
                }
            }
        };
    }
]);
