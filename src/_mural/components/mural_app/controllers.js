/**
 * @ngdoc overview
 * @name mural.controllers
 * @memberof mural
 *
 * @classdesc
 *  The Mural Controllers.
 *
 * @requires {@Link mural.controllers.headerController}
 * @requires {@Link mural.controllers.listingController}
 * @requires {@Link mural.controllers.templateController}
 * @requires {@Link mural.controllers.demoController}
 * @requires {@Link mural.controllers.demoModalInstanceController}
 */
angular.module("mural.controllers", []).controller("headerController", [
    "$scope",
    "isMobile",
    "$rootScope",
    "$filter",
    "$location",
    "$log",
    function($scope, isMobile, $rootScope, $filter, $location, $log) {
        /**
         * @ngdoc controller
         * @name mural.controllers.headerController
         * @memberof mural.controllers
         *
         * @classdesc
         *  The Header Controller
         *
         * @summary
         *  The Header Controller
         *
         * @requires $scope
         * @requires isMobile
         * @requires $rootScope
         * @requires $filter
         */

        var $html = angular.element("#wrapper");
        $scope.states = {};
        $rootScope.currentReadMe = undefined;

        /**
         * rootScope.isActive determines teh URL string and turns on navigation.
         * @memberof mural.controllers.headerController
         * @param viewLocation
         * @returns {boolean}
         */
        $rootScope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };

        /**
         * Main Section
         */
        $scope.$on("sectionChange", function(scope, section, name) {
            $log.info("SECTION CHANGE:--------------------");
            /* Main Section : elements or components */
            $rootScope.rootSection = name ? $filter("anchor")(name) : "";

            /* Section title : Page elements */
            $rootScope.section = section;

            /* Section slug : page-elements */
            $rootScope.sectionSlug = $filter("anchor")(section)
        });

        // Autocomplete
        $rootScope.$on("globalPatternsUpdate", function(event, data) {
            $scope.globalPatterns = data;
            console.log("globalPatternsUpdate");
            console.log($scope.globalPatterns);
        });

        $scope.onSelect = function ($item, $model, $label) {
            $scope.$item = $item;
            $scope.$model = $model;
            $scope.$label = $label;
            $log.info("Typeahead just fired with: ");
            $log.info($scope.$item);
            $log.info($scope.$model);
            $log.info($scope.$label);

            $log.info($location.path() + " === " + "/" + $scope.$item.category + "/" + $scope.$item.root.replace(/-/g, ""));

            if ($location.path() === "/" + $scope.$item.category + "/" + $scope.$item.root.replace(/-/g, "")) {
                $log.info("Lookup match, current document");
                $rootScope.scrollTo($scope.$item.slug);
            } else {
                $log.info("Non lookup match");
                var tempURL = "/" + $scope.$item.category + "/" + $scope.$item.root.replace(/-/g, "") + "/" + $scope.$item.slug;
                console.log(tempURL);
                //- $location.path(tempURL);
            }

        };

        /**
         * Menu Toggle
         */
        $scope.toggleMenu = function($event) {
            $event.stopPropagation();
            $html.toggleClass("toggled");
        };

        /**
         * Close menu when clicked outside
         */
        $html.bind("click", function() {
            $html.removeClass("toggled");
        });

        /**
         * Stop propagation in menu
         */
        document.getElementsByClassName("sidebar-nav")[0].addEventListener("click", function(e) {
            e.stopPropagation();
        });
    }
]).controller("listingController", [
    "$scope",
    "$http",
    "$routeParams",
    "$location",
    "$rootScope",
    "$timeout",
    "$interval",
    "$filter",
    "$route",
    "$anchorScroll",
    "$log",
    function($scope, $http, $routeParams, $location, $rootScope, $timeout, $interval, $filter, $route, $anchorScroll, $log) {
        /**
         * @ngdoc controller
         * @name mural.controllers.listingController
         * @memberof mural.controllers
         *
         * @classdesc
         *  The Listing Controller
         *
         * @summary
         *  The Listing Controller
         *
         * @requires $scope
         * @requires $http
         * @requires $routeParams
         * @requires $location
         * @requires $rootScope
         * @requires $timeout
         * @requires $interval
         * @requires $route
         * @requires $anchorScroll
         * @requires $log
         */
        var section = $location.$$path.split("/")[1];
        var element = $routeParams.slug;
        var n = $location.path().lastIndexOf("/");

        $log.info("section element : " + section + " - " + element);
        $scope.readmeToMatch = $location.path().substring(n + 1);


        if (!$scope.currentReadMe || $scope.currentReadMe.slug !== element) {
            angular.forEach($rootScope.readmes[0].data, function(value, key) {
                //  $log.info('ROOT ----- Readme value, then key');
                //  $log.info(value);
                //  $log.info(value.slug);
                //  $log.info(key);
                if (value.slug === $scope.readmeToMatch) {
                    $log.info("IT MATCHED: " + value.slug + " = " + $scope.readmeToMatch);
                    $rootScope.currentReadMe = $rootScope.readmes[0].data[key];
                    $log.info("currentReadMe:");
                    $log.info($rootScope.currentReadMe);
                }
            });
        }

        $rootScope.$watch("styles", function(newValue) {
            if (newValue) {
                // $log.info('STYLES WATCH FIRED');
                // $log.info(newValue);
                // $log.info($rootScope.styles);
                angular.forEach($rootScope.styles, function(value, key) {
                    //  $log.info('Pattern value, then key');
                    //  $log.info(value);
                    //  $log.info(key);
                    if (value.slug === section) {
                        angular.forEach(value.data, function(v, k) {
                            if (v.name.replace(/\s+/g, "-").toLowerCase() == element) {
                                $scope.patterns = value.data[k];
                                /* Change to new section */
                                $rootScope.$broadcast("sectionChange", v.name, value.name.replace(/\s+/g, "-").toLowerCase())
                            }
                        })
                    }
                });
            }
        });

        /**
         * Anchor
         */
        $scope.anchor = function(name) {
            // $log.info('ANCHOR: ' + $filter('anchor')(name));
            return $filter("anchor")(name);
        };
        /**
         * $scope.scrollTo
         * @memberof mural.controllers.listingController
         * @param id
         * @summary
         *  The function takes the subnav (for the Angular Style Guide at this point.  but really the read-mes)
         *  lower cases the link and adds dashes.
         */
        $rootScope.scrollTo = function(id) {
            var old = $location.hash();
            var newId = id.replace(/\s+/g, "-").toLowerCase().toLowerCase();

            $log.info("SCROLLING TO: " + newId);
            $location.hash(newId);
            $anchorScroll();
            //reset to old to keep any additional routing logic from kicking in
            $location.hash(old);
        };

        if ($routeParams.section) {
            console.log("checking Section");
            console.log($routeParams);
            $timeout(function () {
                $rootScope.scrollTo($routeParams.section);
            }, 100);
        }

        /**
         * Prevent route change
         */
        var lastRoute = $route.current;
        //
        // $scope.$on('$locationChangeSuccess', function (event) {
        //     if ($route && $route.current && $route.current.$$route.templateUrl.indexOf('listing') > 0) {
        //         //$route.current = lastRoute; //Does the actual prevention of routing
        //     }
        // });

        /**
         * Sub menu click event
         */
        var $menu = angular.element(".tapestry-menu-side").on("click", "a", function(e) {
            var id = $(this).data("target"),
                href = this.hash,
                top = $(id).position().top;

            $menu.find("a").removeClass("active");
            $(this).addClass("active");
            //window.location.hash = href
            e.preventDefault();
        });

        /**
         * Destroy interval when scope is destroyed
         */
        $scope.$on("destroy", function() {
            $timeout.cancel(checkIdExists);
        });
    }
]).controller("templateController", [
    "$scope",
    "$rootScope",
    "$location",
    "$routeParams",
    function($scope, $rootScope, $location, $routeParams) {
        /**
         * @ngdoc controller
         * @name mural.controllers.templateController
         * @memberof mural.controllers
         *
         * @classdesc
         *  The Template Controller
         *
         * @summary
         *  The Template Controller
         *
         * @requires $scope
         * @requires $rootScope
         * @requires $location
         * @requires $routeParams
         */

        var section = $location.$$path.split("/")[1],
            element = $routeParams.slug;

        angular.forEach($rootScope.styles, function(value, key) {
            if (value.slug == section) {
                angular.forEach(value.data, function(v, k) {
                    if (v.name.replace(/\s+/g, "-").toLowerCase() == element) {
                        $scope.templates = value.data[k];
                        /* Change to new section */
                        $rootScope.$broadcast("sectionChange", v.name, value.name.replace(/\s+/g, "-").toLowerCase());
                    }
                });
            }
        });
    }
]).controller("demoController", [
    "$scope",
    "$modal",
    function($scope, $modal) {

        /**
         * @ngdoc controller
         * @name mural.controllers.demoController
         * @memberof mural.controllers
         *
         * @classdesc
         *  The Demo Controller
         *
         * @summary
         *  Demo Controller is for the patterns that need a bit of JS.
         *
         * @requires $scope
         * @requires $modal
         * @todo Do I really need this controller?
         */

        // -------------------------------------------
        // Alert Pattern
        // -------------------------------------------
        $scope.alerts = [
            { type: "danger", msg: "DANGER: Change a few things up and try submitting again." },
            { type: "info", msg: "INFO: This is an informational alert."},
            { type: "warning", msg: "WARNING: This is an informational alert."},
            { type: "success", msg: "SUCCESS: You successfully read this important alert message." }
        ];
        $scope.addAlert = function() {
            $scope.alerts.push({msg: "DEFAULT WARNING: Another alert!"});
        };
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        // -------------------------------------------
        // Accordion Pattern
        // -------------------------------------------
        $scope.oneAtATime = true;
        $scope.groups = [
            {
                title: "Dynamic Group Header - 1",
                content: "Dynamic Group Body - 1"
            },
            {
                title: "Dynamic Group Header - 2",
                content: "Dynamic Group Body - 2"
            }
        ];

        $scope.items = ["Item 1", "Item 2", "Item 3"];
        $scope.addItem = function() {
            var newItemNo = $scope.items.length + 1;
            $scope.items.push("Item " + newItemNo);
        };
        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };

        // -------------------------------------------
        // Accordion Pattern
        // -------------------------------------------
        $scope.items = ["item1", "item2", "item3"];
        $scope.open = function(size) {
            var modalInstance = $modal.open({
                templateUrl: "myModalContent.html",
                controller: "demoModalInstanceController",
                size: size,
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info("Modal dismissed at: " + new Date());
            });
        };
    }
]).controller("demoModalInstanceController", [
    "$scope",
    "$modalInstance",
    "items",
    function($scope, $modalInstance, items) {

        /**
         * @ngdoc controller
         * @name mural.controllers.demoModalInstanceController
         * @memberof mural.controllers.demoController
         *
         * @classdesc
         *  The Demo Controller
         *
         * @summary
         *  Demo Controller is for the patterns that need a bit of JS.
         *
         * @requires $scope
         * @requires $modalInstance
         * @requires items
         */

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };
        $scope.ok = function() {
            $modalInstance.close($scope.selected.item);
        };
        $scope.cancel = function() {
            $modalInstance.dismiss("cancel");
        };
    }
]);
