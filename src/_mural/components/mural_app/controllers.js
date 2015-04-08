/**
 * Tapestry Controllers
 */

angular.module('mural.controllers', []).controller('headerController', [
    '$scope',
    'isMobile',
    '$rootScope',
    '$filter',
    function ($scope, isMobile, $rootScope, $filter) {
        var $html = angular.element('#wrapper');

        /**
         * Main Section
         */
        $scope.$on('sectionChange', function (scope, section, name) {
            /* Main Section : elements or components */
            $rootScope.rootSection = name? $filter('anchor')(name): '';

            /* Section title : Page elements */
            $rootScope.section = section;

            /* Section slug : page-elements */
            $rootScope.sectionSlug = $filter('anchor')(section)
        });

        // Autocomplete
        $rootScope.$on('globalPatternsUpdate',function (event, data){
            $scope.globalPatterns = data;
        });

        /**
         * Menu Toggle
         */
        $scope.toggleMenu = function ($event) {
            $event.stopPropagation();
            $html.toggleClass('toggled');
        };

        /**
         * Close menu when clicked outside
         */
        $html.bind('click', function () {
            $html.removeClass('toggled');
        });

        /**
         * Stop propagation in menu
         */
        document.getElementsByClassName('sidebar-nav')[0].addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }
]).controller('listingController', [
    '$scope',
    '$http',
    '$routeParams',
    '$location',
    '$rootScope',
    '$timeout',
    '$interval',
    '$filter',
    '$route',
    '$log',
    function ($scope, $http, $routeParams, $location, $rootScope, $timeout, $interval, $filter, $route, $log) {

        var section = $location.$$path.split('/')[1],
            element = $routeParams.slug;
        // $log.info("section element : " + section + " - " + element);

        $rootScope.$watch('styles', function (newValue) {
            if (newValue) {
                angular.forEach($rootScope.styles, function (value, key) {
                    if (value.slug === section) {
                        angular.forEach(value.data, function (v, k) {
                            // $log.info('current subsection name: ' + (v.name.replace(/\s+/g, '-').toLowerCase()));
                            if (v.name.replace(/\s+/g, '-').toLowerCase() == element) {
                                // $log.info('MATCH: ' + v.name.replace(/\s+/g, '-').toLowerCase());
                                $scope.patterns = value.data[k];
                                // $log.info($scope.patterns);
                                // $log.info(value.name + ' and ' + v.name);
                                /* Change to new section */
                                $rootScope.$broadcast('sectionChange', v.name, value.name.replace(/\s+/g, '-').toLowerCase())
                            }
                        })
                    }
                });
            }
        });

        /**
         * Anchor
         */
        $scope.anchor = function (name) {
            // $log.info('ANCHOR: ' + $filter('anchor')(name));
            return $filter('anchor')(name);
        };

        /**
         * Prevent route change
         */
        var lastRoute = $route.current;

        $scope.$on('$locationChangeSuccess', function (event) {
            if ($route && $route.current && $route.current.$$route.templateUrl.indexOf('listing') > 0) {
                //$route.current = lastRoute; //Does the actual prevention of routing
            }
        });

        /**
         * Sub menu click event
         */
        var $menu = angular.element('.tapestry-menu-side').on('click', 'a', function (e) {
            var id = $(this).data('target'),
                href = this.hash,
                top = $(id).position().top

            $menu.find('a').removeClass('active');
            $(this).addClass('active');
            //window.location.hash = href
            e.preventDefault();
        });




        /**
         * Destroy interval when scope is destroyed
         */
        $scope.$on('destroy', function () {
            $timeout.cancel(checkIdExists);
        });
    }
]).controller('templateController', [
    '$scope',
    '$rootScope',
    '$location',
    '$routeParams',
    function ($scope, $rootScope, $location, $routeParams) {
        var section = $location.$$path.split('/')[1],
            element = $routeParams.slug;

        angular.forEach($rootScope.styles, function (value, key) {
            if (value.slug == section) {
                angular.forEach(value.data, function (v, k) {
                    if (v.name.replace(/\s+/g, '-').toLowerCase() == element) {
                        $scope.templates = value.data[k];
                        /* Change to new section */
                        $rootScope.$broadcast('sectionChange', v.name, value.name.replace(/\s+/g, '-').toLowerCase());
                    }
                });
            }
        });
        //console.log($scope.templates)
    }
]).controller('demoController', [
    '$scope',
    '$modal',
    function ($scope, $modal) {
        // Demo Controller is for the patterns that need a bit of JS.

        // -------------------------------------------
        // Alert Pattern
        // -------------------------------------------
        $scope.alerts = [
            { type: 'danger', msg: 'DANGER: Change a few things up and try submitting again.' },
            { type: 'info', msg: 'INFO: This is an informational alert.'},
            { type: 'warning', msg: 'WARNING: This is an informational alert.'},
            { type: 'success', msg: 'SUCCESS: You successfully read this important alert message.' }
        ];
        $scope.addAlert = function() {
            $scope.alerts.push({msg: 'DEFAULT WARNING: Another alert!'});
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
                title: 'Dynamic Group Header - 1',
                content: 'Dynamic Group Body - 1'
            },
            {
                title: 'Dynamic Group Header - 2',
                content: 'Dynamic Group Body - 2'
            }
        ];

        $scope.items = ['Item 1', 'Item 2', 'Item 3'];
        $scope.addItem = function() {
            var newItemNo = $scope.items.length + 1;
            $scope.items.push('Item ' + newItemNo);
        };
        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };


        // -------------------------------------------
        // Accordion Pattern
        // -------------------------------------------
        $scope.items = ['item1', 'item2', 'item3'];
        $scope.open = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'demoModalInstanceController',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }
]).controller('demoModalInstanceController', [
    '$scope',
    '$modalInstance',
    'items',
    function ($scope, $modalInstance, items) {
        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };
        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
