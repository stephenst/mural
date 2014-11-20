/**
 * Tapestry Controllers
 */

angular.module('tapestry.controllers', []).controller('headerController', [
    '$scope',
    'isMobile',
    '$rootScope',
    '$filter',
    function ($scope, isMobile, $rootScope, $filter) {
        var $html = angular.element('html');

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
            $html.toggleClass('menu__opened');
        };

        /**
         * Close menu when clicked outside
         */
        $html.bind('click', function () {
            $html.removeClass('menu__opened');
        });

        /**
         * Stop propagation in menu
         */
        document.getElementsByClassName('tapestry-menu')[0].addEventListener('click', function (e) {
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
        $log.info("section element : " + section + " - " + element);

        $rootScope.$watch('styles', function (newValue) {
            if (newValue) {
                angular.forEach($rootScope.styles, function (value, key) {
                    if (value.slug === section) {
                        angular.forEach(value.data, function (v, k) {
                            $log.info('current subsection name: ' + (v.name.replace(/\s+/g, '-').toLowerCase()));
                            if (v.name.replace(/\s+/g, '-').toLowerCase() == element) {
                                $log.info('MATCH: ' + v.name.replace(/\s+/g, '-').toLowerCase());
                                $scope.patterns = value.data[k];
                                $log.info($scope.patterns);
                                $log.info(value.name + ' and ' + v.name);
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

        $scope.$on('$locationChangeSuccess', function(event) {
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
]);
