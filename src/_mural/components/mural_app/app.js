/*jslint node: true, nomen: true */
/*globals angular, module, window, browser */

"use strict";

// todo: have version and lastupdated read from package.json or npm.  dynamic, rather than static.
var version = "3.1.1",
    lastUpdated = "17 Aug 2015";

//  jsonPath of the files will be inserted by gulp-script-inject after reading /src/mural_data folder

/**
 * @ngdoc overview
 * @name mural
 *
 * @classdesc
 *  The Main Mural App angular module.
 *
 * @summary
 *   This module bootstraps and starts the Mural app.
 *
 * @requires {@Link mural.services}
 * @requires {@Link mural.controllers}
 * @requires {@Link mural.markdown}
 * @requires {@Link mural.filters}
 * @requires ui.bootstrap
 * @requires ngRoute
 * @requires once
 * @requires sticky
 */
angular.module("mural", [
    "mural.services",
    "mural.controllers",
    "mural.markdown",
    "mural.filters",
    "ui.bootstrap",
    "ngRoute",
    "once",
    "sticky"
]).value("version", version)
    .value("lastUpdated", lastUpdated)
    .value("isMobile", /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test((navigator.userAgent || navigator.vendor || window.opera)))
    .config([
        "$routeProvider",
        "$locationProvider",
        "$provide",
        function($routeProvider, $locationProvider, $provide) {

            $locationProvider.hashPrefix("!");
            $routeProvider.when("/", {
                title: "Overview",
                templateUrl: "components/mural_templates/templates/home.html",
                controller: "headerController"
            }).when("/changelog", {
                title: "Changelog",
                templateUrl: "components/mural_templates/templates/changelog.html",
                controller: "headerController"
            }).otherwise({redirectTo: "/"});

            /* Add new routes based on the Configuration */
            angular.forEach(jsonPath, function(value, key) {
                value.slug = value.name.replace(/\s+/g, "-").toLowerCase();
                if (value.slug === "templates") {
                    $routeProvider.when("/" + value.slug + "/:slug", {
                        templateUrl: "components/mural_templates/templates/listing-template.html",
                        controller: "templateController"
                    });
                } else {
                    $routeProvider.when("/" + value.slug + "/:slug", {
                        templateUrl: "components/mural_templates/templates/listing.html",
                        controller: "listingController"
                    }).when("/" + value.slug + "/:slug/:section", {
                        templateUrl: "components/mural_templates/templates/listing.html",
                        controller: "listingController"
                    });
                }
            });

            /**
             *  Add new routes based on the Configuration
             *  @memberof mural
             *
             * @summary
             *   This will iterate through and create the paths for the Read-Me's.
             *
             * @requires {object} readmePath - This is the injected script to the dynamic JSON generated from teh Markdowns.
             *
             *  */
            angular.forEach(readmePath, function(value, key) {
                console.log("README FOLLOWS");
                console.log(readmePath);
                value.slug = value.name.replace(/\s+/g, "-").toLowerCase();
                console.log("the readmePath value.slug: " + value.slug);

                $routeProvider.when("/" + value.slug + "/:slug", {
                    templateUrl: "components/mural_templates/templates/readme.html",
                    controller: "listingController"
                }).when("/" + value.slug + "/:slug/:section", {
                    templateUrl: "components/mural_templates/templates/readme.html",
                    controller: "listingController"
                });
            });

            /**
             * Log Decoration
             *
             * @memberof mural
             * @requires $provide
             */
            $provide.decorator("$log", ["$delegate", "$filter", function($delegate, $filter) {
                // Save the original $log.debug()
                var debugFn = $delegate.debug;

                $delegate.info = function() {
                    var args = [].slice.call(arguments),
                        now = $filter("date")(new Date(), "h:mma");

                    // Prepend timestamp
                    args[0] = [now, ": ", args[0]].join("");

                    // Call the original with the output prepended with formatted timestamp
                    debugFn.apply(null, args);
                };
                return $delegate;
            }]);
        }
    ]).run([
        "$rootScope",
        "$http",
        "$q",
        "$filter",
        "$cacheFactory",
        "$log",
        function($rootScope, $http, $q, $filter, $cacheFactory, $log) {

            var cache = $cacheFactory.get("cache");
            var requests = [];
            var names = [];
            var slug = [];

            $rootScope.styles = [];
            $rootScope.readmes = [];

            /**
             * Change Title on routeChange
             */
            $rootScope.$on("$routeChangeSuccess", function(event, current, previous) {
                if (current.$route && current.$route.title) {
                    $rootScope.$broadcast("sectionChange", current.$route.title);
                }
            });

            angular.forEach(jsonPath, function(value, key) {
                /* Add Pattern name in array */
                names.push(value.name);
                slug.push(value.slug);

                /* Add requests in to array for $q */
                requests.push($http.get(value.path, {cache: cache}));
            });

            /**
             * When all requests are completed
             */
            $q.all(requests).then(function(response) {
                angular.forEach(response, function(response, index) {
                    var parseObject = response.data;

                    /**
                     * Create a Slug from the title
                     * Reduces $watch on filter {{element.name | anchor}}
                     */
                    angular.forEach(parseObject, function(value, key) {
                        value.slug = $filter("anchor")(value.name);
                    });

                    /**
                     * Push to rootScope
                     */
                    $rootScope.styles.push({
                        name: names[index],
                        slug: slug[index],
                        data: parseObject
                    });
                });
            });

            /**
             * Assign values to rootScope
             */
            var readmeRequests = [];
            var readmeNames = [];
            var readmeSlug = [];

            angular.forEach(readmePath, function(value, key) {
                /* Add Pattern name in array */
                readmeNames.push(value.name);
                readmeSlug.push(value.slug);

                /* Add requests in to array for $q */
                readmeRequests.push($http.get(value.path, {cache: cache}));
            });

            /**
             * When all requests are completed
             */
            $q.all(readmeRequests).then(function(response) {
                angular.forEach(response, function(r, i) {
                    var parseObject = r.data;
                    /**
                     * Create a Slug from the title
                     * Reduces $watch on filter {{element.name | anchor}}
                     */
                    angular.forEach(parseObject, function(value, key) {
                        value.slug = $filter("anchor")(value.name);
                    });

                    /**
                     * Push to rootScope
                     */
                    $rootScope.readmes.push({
                        name: readmeNames[i],
                        slug: readmeSlug[i],
                        data: parseObject
                    });
                });
                $log.info("Readmes follow");
                $log.info($rootScope.readmes);
            });

            /**
             * Watch changes and add to Autocomplete
             */
            $rootScope.$watch("styles", function(newValue) {
                if (newValue.length) {
                    /**
                     * Creates a flattened version of the array
                     */
                    var autoCompleteArray = [];
                    angular.forEach(newValue, function(value, index) {
                        autoCompleteArray.push(flattener(value.data, value.name, value.slug));
                    });

                    /**
                     * Combines Arrays
                     */
                    var data = autoCompleteArray.reduce(function(a, b, index, array) {
                        return a.concat(b);
                    });

                    /**
                     * Invokes autocomplete
                     */
                    $rootScope.$emit("globalPatternsUpdate", data);

                    /**
                     * hide Menu
                     */
                    setTimeout(function() {
                        angular.element("#wrapper").removeClass("toggled");
                    }, 2000);
                }
            }, true);
        }
    ]);

/**
 * Flattening Array - could probably be done using underscore; but this works.  Not going to rewrite.
 * -- note: this is NOT my code; but from pebbleRoad.
 * @param  {Object}
 * @return {Object} Flattened array
 * @memberof mural
 */
function flattener(arrr, template, category) {
    var a = [];

    var flattenArray = function(arr, parent) {
        for (var i = 0; i < arr.length; i++) {
            var parent = parent ? parent : "",
                root = parent.replace(/\s+/g, "-").toLowerCase(),
                slug = arr[i].name.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "").replace(/\s+/g, "-").toLowerCase();

            a.push({
                value: arr[i].name,
                slug: slug,
                root: root,
                template: arr[i].template ? arr[i].template : null,
                url: "/" + category + "/" + (root ? root : slug) + (slug != root && root ? "/" + slug : ""),
                category: category
            });
            if (arr[i].children && typeof arr[i].children == "object") {
                var p = parent ? parent : arr[i].name;

                flattenArray(arr[i].children, p);
            }
        }
        return a;
    };
    return flattenArray(arrr);
}
