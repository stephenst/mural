---
name: Leftover
hidecode: true
description: >
  
  ## Manual Annotating for Dependency Injection
  
  ### UnSafe from Minification

  - Avoid using the shortcut syntax of declaring dependencies without using a minification-safe approach.

    *Why?*: The parameters to the component (e.g. controller, factory, etc) will be converted to mangled variables. For example, `common` and `dataservice` may become `a` or `b` and not be found by Angular.

    ```javascript
    /* avoid - not minification-safe*/
    angular
        .module('app')
        .controller('Dashboard', Dashboard);
    
    function Dashboard (common, dataservice) { }
    ```

    This code may produce mangled variables when minified and thus cause runtime errors.

    ```javascript
    /* avoid - not minification-safe*/
    angular.module('app').controller('Dashboard', d);function d(a, b) { }
    ```

  ### Manually Identify Dependencies

  - Use `$inject` to manually identify your dependencies for Angular components.

  *Why?*: This technique mirrors the technique used by [`ng-annotate`](https://github.com/olov/ng-annotate), used for automating the creation of minification safe dependencies. 
  If `ng-annotate` detects injection has already been made, it will not duplicate it.

  *Why?*: This safeguards your dependencies from being vulnerable to minification issues when parameters may be mangled. For example, `common` and `dataservice` may become `a` or `b` and not be found by Angular.

  *Why?*: Avoid creating in-line dependencies as long lists can be difficult to read in the array. Also it can be confusing that the array is a series of strings while the last item is the component's function.

  ```javascript
    /* avoid */
    angular
        .module('app')
        .controller('Dashboard',
            ['$location', '$routeParams', 'common', 'dataservice',
                function Dashboard ($location, $routeParams, common, dataservice) {}
            ]);
  ```

  ```javascript
    /* avoid */
    angular
      .module('app')
      .controller('Dashboard',
          ['$location', '$routeParams', 'common', 'dataservice', Dashboard]);

    function Dashboard ($location, $routeParams, common, dataservice) { }
  ```

  ```javascript
    /* recommended */
    angular
        .module('app')
        .controller('Dashboard', Dashboard);

    Dashboard.$inject = ['$location', '$routeParams', 'common', 'dataservice'];

    function Dashboard ($location, $routeParams, common, dataservice) { }
  ```

  Note: When your function is below a return statement the `$inject` may be unreachable (this may happen in a directive). You can solve this by moving the Controller outside of the directive.

  ```javascript
    /* avoid */
    // inside a directive definition
    function outer () {
        var ddo = {
            controller: DashboardPanelController,
            controllerAs: 'vm'
        };
        return ddo;

        DashboardPanelController.$inject = ['logger']; // Unreachable
        function DashboardPanelController(logger) {
        }
    }
  ```

  ```javascript
    /* recommended */
    // outside a directive definition
    function outer () {
        var ddo = {
            controller: DashboardPanelController,
            controllerAs: 'vm'
        };
        return ddo;
    }

    DashboardPanelController.$inject = ['logger'];
    function DashboardPanelController (logger) { }
  ```

  ### Manually Identify Route Resolver Dependencies

  - Use `$inject` to manually identify your route resolver dependencies for Angular components.

  *Why?*: This technique breaks out the anonymous function for the route resolver, making it easier to read.

  *Why?*: An `$inject` statement can easily precede the resolver to handle making any dependencies minification safe.

  ```javascript
    /* recommended */
    function config ($routeProvider) {
        $routeProvider
            .when('/avengers', {
                templateUrl: 'avengers.html',
                controller: 'AvengersController',
                controllerAs: 'vm',
                resolve: {
                    moviesPrepService: moviePrepService
                }
            });
    }

    moviePrepService.$inject = ['movieService'];
    function moviePrepService (movieService) {
        return movieService.getMovies();
    }
  ```

  **[⬆ back to top](#table-of-contents)**
  
  
  ## Minification and Annotation
  
  ### ng-annotate

  - Use [ng-annotate](//github.com/olov/ng-annotate) for [Grunt](http://gruntjs.com) and comment functions that need 
  automated dependency injection using `/** @ngInject */`

  *Why?*: This safeguards your code from any dependencies that may not be using minification-safe practices.

  *Why?*: [`ng-min`](https://github.com/btford/ngmin) is deprecated

  The following code is not using minification safe dependencies.

  ```javascript
    angular
        .module('app')
        .controller('Avengers', Avengers);

    /* @ngInject */
    function Avengers (storageService, avengerService) {
        var vm = this;
        vm.heroSearch = '';
        vm.storeHero = storeHero;

        function storeHero () {
            var hero = avengerService.find(vm.heroSearch);
            storageService.save(hero.name, hero);
        }
    }
  ```

  When the above code is run through ng-annotate it will produce the following output with the `$inject` annotation
  and become minification-safe.

  ```javascript
    angular
        .module('app')
        .controller('Avengers', Avengers);

    /* @ngInject */
    function Avengers (storageService, avengerService) {
        var vm = this;
        vm.heroSearch = '';
        vm.storeHero = storeHero;

        function storeHero () {
            var hero = avengerService.find(vm.heroSearch);
            storageService.save(hero.name, hero);
        }
    }

    Avengers.$inject = ['storageService', 'avengerService'];
  ```

  Note: If `ng-annotate` detects injection has already been made (e.g. `@ngInject` was detected), it will not duplicate the `$inject` code.

  Note: When using a route resolver you can prefix the resolver's function with `/* @ngInject */` and it will produce properly annotated code, keeping any injected dependencies minification safe.

  ```javascript
    // Using @ngInject annotations
    function config($routeProvider) {
        $routeProvider
            .when('/avengers', {
                templateUrl: 'avengers.html',
                controller: 'Avengers',
                controllerAs: 'vm',
                resolve: { /* @ngInject */
                    moviesPrepService: function(movieService) {
                        return movieService.getMovies();
                    }
                }
            });
    }
  ```

  Note: Starting from Angular 1.3 you can use the [`ngApp`](https://docs.angularjs.org/api/ng/directive/ngApp) directive's `ngStrictDi` parameter to detect any potentially missing 
  magnification safe dependencies. When present the injector will be created in "strict-di" mode causing the application to fail to invoke functions which do not use explicit function
  annotation (these may not be minification safe). Debugging info will be logged to the console to help track down the offending code. I prefer to only use `ng-strict-di` for debugging purposes only.
  `<body ng-app="APP" ng-strict-di>`

  ### Use Grunt for ng-annotate

  - Use [grunt-ng-annotate](https://www.npmjs.org/package/grunt-ng-annotate) in an automated build task. 
  Inject `/* @ngInject */` prior to any function that has dependencies.

    *Why?*: ng-annotate will catch most dependencies, but it sometimes requires hints using the `/* @ngInject */` syntax.


  **[⬆ back to top](#table-of-contents)**


  ## Exception Handling

  ### decorators

  - Use a [decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator), at config time using the [`$provide`](https://docs.angularjs.org/api/auto/service/$provide) service,
   on the [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler) service to perform custom actions when exceptions occur.

  *Why?*: Provides a consistent way to handle uncaught Angular exceptions for development-time or run-time.

  Note: Another option is to override the service instead of using a decorator. This is a fine option, but if you want to keep the default behavior and extend it a decorator is recommended.

  ```javascript
    /* recommended */
    angular
        .module('blocks.exception')
        .config(exceptionConfig);

    exceptionConfig.$inject = ['$provide'];

    function exceptionConfig ($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    extendExceptionHandler.$inject = ['$delegate', 'toastr'];

    function extendExceptionHandler ($delegate, toastr) {
        return function(exception, cause) {
            $delegate(exception, cause);
            var errorData = {
                exception: exception,
                cause: cause
            };
            /**
             * Could add the error to a service's collection,
             * add errors to $rootScope, log errors to remote web server,
             * or log locally. Or throw hard. It is entirely up to you.
             * throw exception;
             */
            toastr.error(exception.msg, errorData);
        };
    }
  ```

  ### Exception Catchers

  - Create a factory that exposes an interface to catch and gracefully handle exceptions.

  *Why?*: Provides a consistent way to catch exceptions that may be thrown in your code (e.g. during XHR calls or promise failures).

  Note: The exception catcher is good for catching and reacting to specific exceptions from calls that you know may throw one. For example, when making an XHR call to retrieve data from a 
  remote web service and you want to catch any exceptions from that service and react uniquely.

  ```javascript
    /* recommended */
    angular
        .module('blocks.exception')
        .factory('exception', exception);

    exception.$inject = ['logger'];

    function exception (logger) {
        var service = {
            catcher: catcher
        };
        return service;

        function catcher (message) {
            return function(reason) {
                logger.error(message, reason);
            };
        }
    }
  ```

  ### Route Errors

  - Handle and log all routing errors using [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError).

    *Why?*: Provides a consistent way to handle all routing errors.

    *Why?*: Potentially provides a better user experience if a routing error occurs and you route them to a friendly screen with more details or recovery options.

    ```javascript
    /* recommended */
    var handlingRouteChangeError = false;

    function handleRoutingErrors () {
        /**
         * Route cancellation:
         * On routing error, go to the dashboard.
         * Provide an exit clause if it tries to do it twice.
         */
        $rootScope.$on('$routeChangeError',
            function (event, current, previous, rejection) {
                if (handlingRouteChangeError) { return; }
                handlingRouteChangeError = true;
                var destination = (current && (current.title ||
                    current.name || current.loadedTemplateUrl)) ||
                    'unknown target';
                var msg = 'Error routing to ' + destination + '. ' +
                    (rejection.msg || '');

                /**
                 * Optionally log using a custom service or $log.
                 * (Don't forget to inject custom service)
                 */
                logger.warning(msg, [current]);

                /**
                 * On routing error, go to another route/state.
                 */
                $location.path('/');

            }
        );
    }
    ```

  **[⬆ back to top](#table-of-contents)**


  ## Naming

  ### Naming Guidelines

  - Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type `feature.type.js`. There are 2 names for most assets:
    * the file name (`avengers.controller.js`)
    * the registered component name with Angular (`AvengersController`)

    *Why?*: Naming conventions help provide a consistent way to find content at a glance. Consistency within the project is vital. Consistency with a team is important. Consistency across a company provides tremendous efficiency.

    *Why?*: The naming conventions should simply help you find your code faster and make it easier to understand.

  ### Feature File Names

  - Use all lowercase characters with optional dash separator two words. `feature.type.js` or `extra-feature.type.js`.

  *Why?*: Provides a consistent way to quickly identify components.
  
  *Why?*: Provides pattern matching for any automated tasks.
  
  *Why?*: Readability (speed and recognition).
  
  *Why?*: No ambiguity (e.g. LoggingHttpInterceptor.js vs loggingHTTPinterceptor.js).

    ```javascript
    /**
     * common options
     */

    // Controllers
    avengers.js
    avengers.controller.js
    avengersController.js

    // Services/Factories
    logger.js
    logger.service.js
    loggerService.js
    ```

    ```javascript
    /**
     * recommended
     */

    // controllers
    avengers.controller.js
    avengers.controller.spec.js

    // services/factories
    logger.service.js
    logger.service.spec.js

    // constants
    constants.js

    // module definition
    avengers.module.js

    // routes
    avengers.routes.js
    avengers.routes.spec.js

    // configuration
    avengers.config.js

    // directives
    avenger-profile.directive.js
    avenger-profile.directive.spec.js
    ```

    Note: Pattern on hold - naming controller files without the word `controller` in the file name such as `avengers.js` instead of `avengers.controller.js`. 
    Controllers are the most common type of component so this just saves typing and is still easily identifiable.
  
    ```javascript
    /**
     * On hold pattern
     */
    // Controllers
    avengers.js
    avengers.spec.js
    ```

  ### Test File Names

  - Name test specifications similar to the component they test with a suffix of `spec`.

    *Why?*: Provides a consistent way to quickly identify components.

    *Why?*: Provides pattern matching for [karma](http://karma-runner.github.io/) or other test runners.

    ```javascript
    /**
     * recommended
     */
    avengers.controller.spec.js
    logger.service.spec.js
    avengers.routes.spec.js
    avenger-profile.directive.spec.js
    ```

  ### Controller Names

  - Use consistent names for all controllers named after their feature. Use UpperCamelCase for controllers, as they are constructors.

    *Why?*: Provides a consistent way to quickly identify and reference controllers.

    *Why?*: UpperCamelCase is conventional for identifying object that can be instantiated using a constructor.

    ```javascript
    /**
     * recommended
     */

    // avengers.controller.js
    angular
        .module
        .controller('HeroAvengersController', HeroAvengersController);

    function HeroAvengersController () { }
    ```

  ### Controller Name Suffix

  - Append the controller name with the suffix `Controller`.

    *Why?*: The `Controller` suffix is more commonly used and is more explicitly descriptive.

    ```javascript
    /**
     * recommended
     */

    // avengers.controller.js
    angular
        .module
        .controller('AvengersController', AvengersController);

    function AvengersController () { }
    ```

  ### Service Names

  - Use consistent names for all factories named after their feature. Use camel-casing for services and factories. Avoid prefixing factories and services with `$`.

    *Why?*: Provides a consistent way to quickly identify and reference factories.

    *Why?*: Avoids name collisions with built-in factories and services that use the `$` prefix.

    ```javascript
    /**
     * recommended
     */

    // logger.service.js
    angular
        .module
        .service('logger', logger);

    function logger () { }
    ```

  ### Directive Component Names

  - Use consistent names for all directives using camel-case. Use `sg` prefix.

    *Why?*: Provides a consistent way to quickly identify and reference components.

    ```javascript
    /**
     * recommended
     */

    // criteria-browser.directive.js
    angular
        .module
        .directive('sgCriteriaBrowser', sgCriteriaBrowser);

    // usage is <sg-criteria-browser> </sg-criteria-browser>

    function sgCriteriaBrowser () { }
    ```

  ### Modules

  - When there are multiple modules, the main module file is named `app.module.js` while other dependent modules are named after what they represent. For example, an admin module is named
    `admin.module.js`. The respective registered module names would be `app` and `admin`.

    *Why?*: Provides consistency for multiple module apps, and for expanding to large applications.

    *Why?*: Provides easy way to use task automation to load all module definitions first, then all other angular files (for bundling).

  ### Configuration

  - Separate configuration for a module into its own file named after the module. A configuration file for the main `app` module is named `app.config.js` (or simply `config.js`).
    A configuration for a module named `admin.module.js` is named `admin.config.js`.

    *Why?*: Separates configuration from module definition, components, and active code.

    *Why?*: Provides an identifiable place to set configuration for a module.

  ### Routes

  - Separate route configuration into its own file. Examples might be `app.route.js` for the main module and `admin.route.js` for the `admin` module. Even in smaller apps I prefer this
    separation from the rest of the configuration.


  **[⬆ back to top](#table-of-contents)**


  ## Application Structure LIFT Principle

  ### LIFT

  - Structure the app in such that you can `L`ocate your code quickly, `I`dentify the code at a glance, keep the `F`lattest structure you can, and `T`ry to stay DRY. The structure should
    follow these 4 basic guidelines.

    *Why LIFT?*: Provides a consistent structure that scales well, is modular, and makes it easier to increase developer efficiency by finding code quickly. Another way to check your app
    structure is to ask yourself: How quickly can you open and work in all of the related files for a feature?

    When the structure does not feel comfortable, it is time to revisit LIFT

    1. `L`ocating our code is easy
    2. `I`dentify code at a glance
    3. `F`lat structure as long as we can
    4. `T`ry to stay DRY (Don’t Repeat Yourself) or T-DRY

  ### Locate

  - Make locating your code intuitive, simple and fast.

  *Why?*: If the team cannot find the files they need to work on quickly, they will not be able to work as efficiently as possible,
   and the structure needs to change. You may not know the file name or where its related files are, so putting them in
   the most intuitive locations and near each other saves a ton of time. A descriptive folder structure can help with this.

   **(Boilerplate link)**

  ### Identify

  - When you look at a file you should instantly know what it contains and represents.

    *Why?*: You spend less time hunting and pecking for code, and become more efficient. If this means you want longer file names, then so be it. Be descriptive with file names and keeping
    the contents of the file to exactly 1 component. Avoid files with multiple controllers, multiple services, or a mixture. There are deviations of the 1 per file rule when
    I have a set of very small features that are all related to each other, they are still easily identifiable.

  ### Flat

  - Keep a flat folder structure as long as possible. When you get to 7+ files, begin considering separation.

    *Why?*: Nobody wants to search 7 levels of folders to find a file. Think about menus on web sites … anything deeper than 2 should take serious consideration. In a folder structure
    there is no hard and fast number rule, but when a folder has 7-10 files, that may be time to create subfolders. Base it on your comfort level. Use a flatter structure until there is 
    an obvious value (to help the rest of LIFT) in creating a new folder.

  ### T-DRY (Try to Stick to DRY)

  - Be DRY, but do not sacrifice readability.

    *Why?*: Being DRY is important, but not crucial if it sacrifices the others in LIFT. If it is not obvious or by convention, then I name it. For example: `session-view.html`,
     `dialog.template.html`, `dashboard.controller.js` (feature appendixes might be redundant where agreed).

  **[⬆ back to top](#table-of-contents)**


  ## Application Structure

  ### Overall Guidelines

  - Have a near term view of implementation and a long term vision. In other words, start small and but keep in mind on where the app is heading down the road. All of the app's code goes
    in a root folder named `app`. All content is 1 feature per file. Each controller, service, module, view is in its own file. All 3rd party vendor scripts are stored in another root folder
    and not in the `app` folder.

    Note: Find more details and reasoning behind the structure at [this original post on application structure](http://www.johnpapa.net/angular-app-structuring-guidelines/).

  ### Layout

  - Place components that define the overall layout of the application in a folder named `layout`. These may include a shell view and controller may act as the container for the app,
    navigation, menus, content areas, and other regions.

    *Why?*: Organizes all layout in a single place re-used throughout the application.

  ### Folders-by-Feature Structure

  - Create folders named for the feature they represent. When a folder grows to contain more than 7 files, start to consider creating a folder for them. Your threshold may be different,
    so adjust as needed.

    *Why?*: A developer can locate the code, identify what each file represents at a glance, the structure is flat as can be, and there is no repetitive nor redundant names.

    *Why?*: The LIFT guidelines are all covered.

    *Why?*: Helps reduce the app from becoming cluttered through organizing the content and keeping them aligned with the LIFT guidelines.

    *Why?*: When there are a lot of files (10+) locating them is easier with a consistent folder structures and more difficult in flat structures.

    ```
    /**
     * recommended
     */

    app/
        app.module.js
        app.config.js
        _assets/  (global assets to be shared go here, as well as bower)
            bower/
            css/
            data/
            img/
            sass/
        components/
            calendar/
                calendar.directive.js
                calendar.directive.html
            user-profile/
                user-profile.directive.js
                user-profile.directive.html
            people/
                attendees/
                    attendees.html
                    attendees.controller.js
                    attendees.module.js
                people.routes.js
                speakers/
                    speakers.html
                    speakers.controller.js
                    speaker-detail.html
                    speaker-detail.controller.js
                    speakers.module.js
            services/
                services.module.js
                data.service.js
                localstorage.service.js
                logger.service.js
                spinner.service.js
            sessions/
                sessions.html
                sessions.controller.js
                sessions.routes.js
                session-detail.html
                session-detail.controller.js
        layout/
            shell.html
            shell.controller.js
            topnav.html
            topnav.controller.js
    ```

    [Sample App Structure](assets/images/modularity-2.png)

    Note: Do not use structuring using folders-by-type. This requires moving to multiple folders when working on a feature and gets unwieldy quickly as the app grows to 5, 10 or 25+ views 
    and controllers (and other features), which makes it more difficult than folder-by-feature to locate files.

    ```
    /*
    * Avoid
    * Alternative folders-by-type.
    */

    app/
        app.module.js
        app.config.js
        app.routes.js
        controllers/
            attendees.js
            session-detail.js
            sessions.js
            shell.js
            speakers.js
            speaker-detail.js
            topnav.js
        directives/
            calendar.directive.js
            calendar.directive.html
            user-profile.directive.js
            user-profile.directive.html
        services/
            dataservice.js
            localstorage.js
            logger.js
            spinner.js
        views/
            attendees.html
            session-detail.html
            sessions.html
            shell.html
            speakers.html
            speaker-detail.html
            topnav.html
    ```

  **[⬆ back to top](#table-of-contents)**


  ## Modularity

  ### Many Small, Self Contained Modules

  - Create small modules that encapsulate one responsibility.

    *Why?*: Modular applications make it easy to plug and go as they allow the development teams to build vertical slices of the applications and roll out incrementally.
    This means we can plug in new features as we develop them.

  ### Create an App Module

  - Create an application root module whose role is pull together all of the modules and features of your application. Name this for your application.

    *Why?*: Angular encourages modularity and separation patterns. Creating an application root module whose role is to tie your other modules together provides a very straightforward way
    to add or remove modules from your application.

  ### Keep the App Module Thin

  - Only put logic for pulling together the app in the application module. Leave features in their own modules.

    *Why?*: Adding additional roles to the application root to get remote data, display views, or other logic not related to pulling the app together muddies the app module and make both
    sets of features harder to reuse or turn off.

    *Why?*: The app module becomes a manifest that describes which modules help define the application.

  ### Feature Areas are Modules

  - Create modules that represent feature areas, such as layout, reusable and shared services, dashboards, and app specific features (e.g. customers, admin, sales).

    *Why?*: Self contained modules can be added to the application with little or no friction.

    *Why?*: Sprints or iterations can focus on feature areas and turn them on at the end of the sprint or iteration.

    *Why?*: Separating feature areas into modules makes it easier to test the modules in isolation and reuse code.

  ### Reusable Blocks are Modules

  - Create modules that represent reusable application blocks for common services such as exception handling, logging, diagnostics, security, and local data stashing.

    *Why?*: These types of features are needed in many applications, so by keeping them separated in their own modules they can be application generic and be reused across applications.

  ### Module Dependencies

  - The application root module depends on the app specific feature modules and any shared or reusable modules.

    ![Modularity and Dependencies](assets/images/modularity-1.png)

    *Why?*: The main app module contains a quickly identifiable manifest of the application's features.

    *Why?*: Each feature area contains a manifest of what it depends on, so it can be pulled in as a dependency in other applications and still work.

    *Why?*: Intra-App features such as shared data services become easy to locate and share from within `app.core`.

    Note: This is a strategy for consistency in larger and growing app.


  **[⬆ back to top](#table-of-contents)**


  ## Startup Logic

  ### Configuration

  - Inject code into [module configuration](https://docs.angularjs.org/guide/module#module-loading-dependencies) that must be configured before running the angular app. Ideal candidates
    include providers and constants.

    *Why?*: This makes it easier to have a less places for configuration.

    ```javascript
    angular
      .module('app')
      .config(configure);
    
    configure.$inject =
      ['routerHelperProvider', 'exceptionHandlerProvider', 'toastr'];
    
    function configure (routerHelperProvider, exceptionHandlerProvider, toastr) {
      exceptionHandlerProvider.configure(config.appErrorPrefix);
      configureStateHelper();
    
      toastr.options.timeOut = 4000;
      toastr.options.positionClass = 'toast-bottom-right';
    
      ////////////////
    
      function configureStateHelper () {
          routerHelperProvider.configure({
              docTitle: 'NG-Modular: '
          });
      }
    }
    ```

  ### Run Blocks

  - Any code that needs to run when an application starts should be declared in a factory, exposed via a function, and injected into the [run block](https://docs.angularjs.org/guide/module#module-loading-dependencies).

    *Why?*: Code directly in a run block can be difficult to test. Placing in a factory makes it easier to abstract and mock.

    ```javascript
    angular
      .module('app')
      .run(runBlock);
    
    runBlock.$inject = ['authenticator', 'translator'];
    
    function runBlock (authenticator, translator) {
        authenticator.initialize();
        translator.initialize();
    }
    ```

  **[⬆ back to top](#table-of-contents)**


  ## Angular Wrapper Services

  ### $document and $window

  - Use [`$document`](https://docs.angularjs.org/api/ng/service/$document) and [`$window`](https://docs.angularjs.org/api/ng/service/$window) instead of `document` and `window`.

    *Why?*: These services are wrapped by Angular and more easily testable than using document and window in tests. This helps you avoid having to mock document and window yourself.

  ### $timeout and $interval

  - Use [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) and [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) instead of `setTimeout` and `setInterval` .

    *Why?*: These services are wrapped by Angular and more easily testable and handle Angular's digest cycle thus keeping data binding in sync.


  **[⬆ back to top](#table-of-contents)**


  ## Testing

  ### Write Tests with Stories

  - Write a set of tests for every story. Start with an empty test and fill them in as you write the code for the story.

    *Why?*: Writing the test descriptions helps clearly define what your story will do, will not do, and how you can measure success.
    
    *Why?*: Running test can help you with migration to new Angular version

    ```javascript
    it('should have Avengers controller', function () {
        // TODO
    });

    it('should find 1 Avenger when filtered by name', function () {
        // TODO
    });

    it('should have 10 Avengers', function () {
        // TODO (mock data?)
    });

    it('should return Avengers via XHR', function () {
        // TODO ($httpBackend?)
    });

    // and so on
    ```

  ### Testing Library

  - Use [Jasmine](http://jasmine.github.io/) for unit testing.

    *Why?*: Jasmine is well estabilished and used in the Angular community. Read more about [unit testing in Angular](https://docs.angularjs.org/guide/unit-testing) 

  - Use [Protractor](http://angular.github.io/protractor/) for e2e testing.

    *Why?*: Protractor is build for Angular e2e and the [Angular Docs](https://docs.angularjs.org/api) provide additional examples how to use it. Read more about [e2e testing in Angular](https://docs.angularjs.org/guide/e2e-testing)
     
    *Why?*: Enables to write test in JavaScript (keeps the project dependency simple)
     

  ### Test Runner

  - Use [Karma](http://karma-runner.github.io) as a test runner.

    *Why?*: Karma is easy to configure to run once or automatically when you change your code.

    *Why?*: Karma hooks into your Continuous Integration process easily on its own or through Grunt.

    *Why?*: Some IDE's are beginning to integrate with Karma, such as [WebStorm](http://www.jetbrains.com/webstorm/) and [Visual Studio](http://visualstudiogallery.msdn.microsoft.com/02f47876-0e7a-4f6c-93f8-1af5d5189225).

    *Why?*: Karma works well with task automation leaders such as [Grunt](http://www.gruntjs.com) (with [grunt-karma](https://github.com/karma-runner/grunt-karma)).

  ### Stubbing and Spying

  - Use [Sinon](http://sinonjs.org/) for stubbing and spying.

    *Why?*: Sinon works well with Jasmine and extends the stubbing and spying features.

    *Why?*: Sinon has descriptive messages when tests fail the assertions.

    Note: **(Needs more research)**. Use Jasmine for everything with [Jasmine AJAX](https://github.com/jasmine/jasmine-ajax) .

  ### Headless Browser

  - Use [PhantomJS](http://phantomjs.org/) to run your tests on a server.

    *Why?*: PhantomJS is a headless browser that helps run your tests without needing a "visual" browser. So you do not have to install Chrome, Safari, IE, or other browsers on your server.

    Note: You should still test on all browsers in your environment, as appropriate for your target audience.

  ### Code Analysis

  - Run JSHint on your tests. See [JavaScript Style Guide](javascript-styleguide.html) for details and settings.

    *Why?*: Tests are code. JSHint can help identify code quality issues that may cause the test to work improperly.


  ### Organizing Tests

  - Place unit test files (specs) side-by-side with your client code. Place specs that cover server integration or test multiple components in a separate `tests` folder.

    *Why?*: Unit tests have a direct correlation to a specific component and file in source code.

    *Why?*: It is easier to keep them up to date since they are always in sight. When coding whether you do TDD or test during development or test after development, 
    the specs are side-by-side and never out of sight nor mind, and thus more likely to be maintained which also helps maintain code coverage.

    *Why?*: When you update source code it is easier to go update the tests at the same time.

    *Why?*: Placing them side-by-side makes it easy to find them and easy to move them with the source code if you move the source.

    *Why?*: Having the spec nearby makes it easier for the source code reader to learn how the component is supposed to be used and to discover its known limitations.

    *Why?*: Separating specs so they are not in a distributed build is easy with grunt or gulp.

    ```
    /src/client/app/customers/customer-detail.controller.js
                             /customer-detail.controller.spec.js
                             /customers.controller.spec.js
                             /customers.controller-detail.spec.js
                             /customers.module.js
                             /customers.route.js
                             /customers.route.spec.js
    ```

  **[⬆ back to top](#table-of-contents)**


  ## Routing

  Client-side routing is important for creating a navigation flow between views and composing views that are made of many smaller templates and directives.
  
  - For time being, use the [AngularUI Router](http://angular-ui.github.io/ui-router/) for client-side routing.

    *Why?*: UI Router offers additional features including nested routes and states.

    *Why?*: The syntax is quite similar to the Angular router and is easy to migrate to UI Router. **(add more details)**


  - Define routes for views in the module where they exist. Each module should contain the routes for the views in the module.

    *Why?*: Each module should be able to stand on its own.

    *Why?*: When removing a module or adding a module, the app will only contain routes that point to existing views.

    *Why?*: This makes it easy to enable or disable portions of an application without concern over orphaned routes.


  **[⬆ back to top](#table-of-contents)**


  ## Comments

  ### jsDoc

  - If planning to produce documentation, use [`jsDoc`](http://usejsdoc.org/) syntax to document function names, description, params and returns. Use `@namespace` and `@memberOf` to match your app structure.

    *Why?*: You can generate (and regenerate) documentation from your code, instead of writing it from scratch.

    *Why?*: Provides consistency using a common industry tool.

    ```javascript
    /**
     * Logger Factory
     * @namespace Factories
     */
    (function () {
      angular
          .module('app')
          .factory('logger', logger);

      /**
       * @namespace Logger
       * @desc Application wide logger
       * @memberOf Factories
       */
      function logger ($log) {
          var service = {
             logError: logError
          };
          return service;

          ////////////

          /**
           * @name logError
           * @desc Logs errors
           * @param {String} msg Message to log
           * @returns {String}
           * @memberOf Factories.Logger
           */
          function logError (msg) {
              var loggedMsg = 'Error: ' + msg;
              $log.error(loggedMsg);
              return loggedMsg;
          };
      }
    })();
    ```

  **[⬆ back to top](#table-of-contents)**


  ## Boilerplate
  
  **(provide link)**
  
  **[⬆ back to top](#table-of-contents)**


  ## Extras

  ## File Templates and Snippets
  Use file templates or snippets to help follow consistent styles and patterns. Here are templates and/or snippets for some of the web development editors and IDEs.

  ### Sublime Text

  - Angular snippets that follow these styles and guidelines.

    1. Find the Sublime Angular snippets under `assets/sublime-angular-snippets` folder
    2. Place it in your Packages folder
    3. Restart Sublime
    4. In a JavaScript file type these commands followed by a `TAB`

    ```javascript
    ngcontroller // creates an Angular controller
    ngdirective  // creates an Angular directive
    ngfactory    // creates an Angular factory
    ngmodule     // creates an Angular module
    ngservice    // creates an Angular service
    ngfilter     // creates an Angular filter
    ```

  ### WebStorm

  - Angular snippets and file templates that follow these styles and guidelines. You can import them into your WebStorm settings:

    1. Download the [WebStorm Angular file templates and snippets](assets/webstorm-angular-file-template.settings.jar)
    2. Open WebStorm and go to the `File` menu
    3. Choose the `Import Settings` menu option
    4. Select the file and click `OK`
    5. In a JavaScript file type these commands followed by a `TAB`:

    ```javascript
    ng-c // creates an Angular controller
    ng-f // creates an Angular factory
    ng-m // creates an Angular module
    ```

  ### Atom

  - Angular snippets that follow these styles and guidelines.
    ```
    apm install angularjs-styleguide-snippets
    ```
    or
    1. Open Atom, then open the Package Manager (Packages -> Settings View -> Install Packages/Themes)
    2. Search for the package 'angularjs-styleguide-snippets'
    3. Click 'Install' to install the package

  - In a JavaScript file type these commands followed by a `TAB`

    ```javascript
    ngcontroller // creates an Angular controller
    ngdirective // creates an Angular directive
    ngfactory // creates an Angular factory
    ngmodule // creates an Angular module
    ngservice // creates an Angular service
    ngfilter // creates an Angular filter
    ```

  **[⬆ back to top](#table-of-contents)**


  ## Contributing

  Any changes need to this document (published in official location or shared) need to go through team review.
  
  
  **[⬆ back to top](#table-of-contents)**
  
---
