---
name: Controllers
hidecode: true
description: >

  ### controllerAs View Syntax

  - Use the [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) syntax 
  over the `classic controller with $scope` syntax.

  *Why?*: Controllers are constructed, "newed" up, and provide a single new instance, and the `controllerAs` syntax is 
  closer to that of a JavaScript constructor than the classic `$scope` syntax.
   
  *Why?*: It promotes the use of binding to a "dotted" object in the View (e.g. `customer.name` instead of `name`),
   which is more contextual, easier to read, and avoids any reference issues that may occur without "dotting".
  
  *Why?*: Helps avoid using `$parent` calls in Views with nested controllers.

  ```html
    <!-- avoid -->
    <div ng-controller="Customer">
      {{ name }}
    </div>

    <!-- recommended -->
    <div ng-controller="Customer as customer">
      {{ customer.name }}
    </div>
  ```

  ### controllerAs Controller Syntax

  - Use the `controllerAs` syntax over the `classic controller with $scope` syntax.
  
  - The `controllerAs` syntax uses `this` inside controllers which gets bound to `$scope`

  *Why?*: `controllerAs` is syntactic sugar over `$scope`. You can still bind to the View and still access `$scope` methods.
    
  *Why?*: Helps avoid the temptation of using `$scope` methods inside a controller when it may otherwise be better to
     avoid them or move them to a factory. Consider using `$scope` in a factory, or if in a controller just when needed.
     For example when publishing and subscribing events using [`$emit`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$emit),
     [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast), or [`$on`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$on) 
     consider moving these uses to a factory and invoke from the controller.

  ```javascript
    /* avoid */
    function Customer ($scope) {
      $scope.name = {};
      $scope.sendMessage = function () { };
    }

    /* recommended - but see next section */
    function Customer () {
      this.name = {};
      this.sendMessage = function () { };
    }
  ```

  ### controllerAs with vm

  - Use a capture variable for `this` when using the `controllerAs` syntax. Choose a consistent variable name such as `vm`,
  which stands for ViewModel.
  
  *Why?*: The `this` keyword is contextual and when used within a function inside a controller may change its context.
  Capturing the context of `this` avoids encountering this problem.

  ```javascript
    /* avoid */
    function Customer () {
      this.name = {};
      this.sendMessage = function () { };
    }

    /* recommended */
    function Customer () {
      var vm = this;
      vm.name = {};
      vm.sendMessage = function () { };
    }
  ```

  Note: You can exclude code from [jshint](http://www.jshint.com/) warnings, by using the following statement:

  ```javascript
    /* jshint validthis: true */
    var vm = this;
  ```
    
  Note: When creating watches in a controller using `controller as`, you can watch the `vm.*` member using the following syntax.
  (Create watches with caution as they add more load to the digest cycle.)
    
  ```html
    <input ng-model="vm.title"/>
  ```
    
  ```javascript
    function SomeController($scope, $log) {
      var vm = this;
      vm.title = 'Some Title';
    
      $scope.$watch('vm.title', function (current, original) {
          $log.info('vm.title was %s', original);
          $log.info('vm.title is now %s', current);
      });
    }
  ```

  ### Bindable Members Up Top

  - Place bindable members at the top of the controller, alphabetized, and not spread through the controller code.

  *Why?*: Placing bindable members at the top makes it easy to read and helps you instantly identify which members of 
  the controller can be bound and used in the View.
  
  *Why?*: Setting anonymous functions in-line can be easy, but when those functions are more than 1 line of code
  they can reduce the readability. Defining the functions below the bindable members (the functions will be hoisted)
  moves the implementation details down, keeps the bindable members up top, and makes it easier to read.

  ```javascript
    /* avoid */
    function Sessions() {
      var vm = this;
    
      vm.gotoSession = function () {
        /* ... */
      };
      vm.refresh = function () {
        /* ... */
      };
      vm.search = function () {
        /* ... */
      };
      vm.sessions = [];
      vm.title = 'Sessions';

    /* recommended */
    function Sessions () {
      var vm = this;
    
      vm.gotoSession = gotoSession;
      vm.refresh = refresh;
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
    
      ////////////
    
      function gotoSession () {
        /* */
      }
    
      function refresh () {
        /* */
      }
    
      function search () {
        /* */
      }
  ```  
  
  ```javascript
    /* recommended */
    function Sessions (dataservice) {
      var vm = this;
    
      vm.gotoSession = gotoSession;
      vm.refresh = dataservice.refresh; // 1 liner is OK
      vm.search = search;
      vm.sessions = [];
      vm.title = 'Sessions';
  ```

  ### Function Declarations to Hide Implementation Details
  
  - Use function declarations to hide implementation details. Keep your bindable members up top. When you need to bind
   a function in a controller, point it to a function declaration that appears later in the file. 
   This is tied directly to the section Bindable Members Up Top. For more details see [this post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code).

  *Why?*: Placing bindable members at the top makes it easy to read and helps you instantly identify which members of the controller can be bound and used in the View. (Same as above.)
  
  *Why?*: Placing the implementation details of a function later in the file moves that complexity out of view so you can see the important stuff up top.
  
  *Why?*: Function declaration are hoisted so there are no concerns over using a function before it is defined (as there would be with function expressions).
  
  *Why?*: You never have to worry with function declarations that moving `var a` before `var b` will break your code because `a` depends on `b`.
  
  *Why?*: Order is critical with function expressions

  ```javascript
    /**
    * avoid
    * Using function expressions.
    */
    function Avengers (dataservice, logger) {
      var vm = this;
      vm.avengers = [];
      vm.title = 'Avengers';
    
      var activate = function () {
          return getAvengers().then(function () {
              logger.info('Activated Avengers View');
          });
      }
    
      var getAvengers = function () {
          return dataservice.getAvengers().then(function (data) {
              vm.avengers = data;
              return vm.avengers;
          });
      }
    
      vm.getAvengers = getAvengers;
    
      activate();
    }
  ```

  Notice that the important stuff is scattered in the preceding example. In the example below, notice that the important stuff is up top. For example, the members bound to the controller such as `vm.avengers` and `vm.title`. The implementation details are down below. This is just easier to read.

  ```javascript
    /**
    * recommend
    * Using function declarations
    * and bindable members up top.
    */
    function Avengers(dataservice, logger) {
      var vm = this;
      vm.avengers = [];
      vm.getAvengers = getAvengers;
      vm.title = 'Avengers';
    
      activate();
    
      function activate () {
          return getAvengers().then(function () {
              logger.info('Activated Avengers View');
          });
      }
    
      function getAvengers () {
          return dataservice.getAvengers().then(function (data) {
              vm.avengers = data;
              return vm.avengers;
          });
      }
    }
  ```

  ### Defer Controller Logic to Services

  - Defer logic in a controller by delegating to services and factories.

  *Why?*: Logic may be reused by multiple controllers when placed within a service and exposed via a function.
    
  *Why?*: Logic in a service can more easily be isolated in a unit test, while the calling logic in the controller can be easily mocked.
    
  *Why?*: Removes dependencies and hides implementation details from the controller.
    
  *Why?*: Keeps the controller slim, trim, and focused.

  ```javascript
    /* recommended */
    function Order (creditService) {
      var vm = this;
      vm.checkCredit = checkCredit;
      vm.isCreditOk;
      vm.total = 0;
    
      function checkCredit () {
         return creditService.isOrderTotalOk(vm.total)
            .then(function (isOk) { vm.isCreditOk = isOk; })
            .catch(showServiceError);
      };
    }
  ```

  ### Keep Controllers Focused

  - Define a controller for a view, and try not to reuse the controller for other views. Instead, move reusable logic to factories and keep the controller simple and focused on its view.

  *Why?*: Reusing controllers with several views is brittle and good end to end (e2e) test coverage is required to ensure stability across large applications.


  ### Combined Example

  Controller using "Above the Fold" and above mentioned techniques (IIFE, strict mode, angular getter syntax, controllerAs syntax,
  named functions, hiding implementation details) in a [combined example](assets/images/above-the-fold-1.png).

  ### Assigning Controllers

  - When a controller must be paired with a view and either component may be re-used by other controllers or views, define controllers along with their routes.


  *Why?*: Pairing the controller in the route allows different routes to invoke different pairs of controllers and views. When controllers are assigned in the view using
  [`ng-controller`](https://docs.angularjs.org/api/ng/directive/ngController), that view is always associated with the same controller.


  ```javascript
    /* avoid - when using with a route and dynamic pairing is desired */
    
    // route-config.js
    angular
      .module('app')
      .config(config);
    
    function config ($routeProvider) {
      $routeProvider
          .when('/avengers', {
            templateUrl: 'avengers.html'
          });
    }
  ```
    
  ```html
    <!-- avengers.html -->
    <div ng-controller="Avengers as vm"></div>
  ```
    
  ```javascript
    /* recommended */
    
    // route-config.js
    angular
      .module('app')
      .config(config);
    
    function config($routeProvider) {
      $routeProvider
          .when('/avengers', {
              templateUrl: 'avengers.html',
              controller: 'Avengers',
              controllerAs: 'vm'
          });
    }
  ```
    
  ```html
    <!-- avengers.html -->
    <div></div>
  ```

  **[⬆ back to top](#table-of-contents)**



---
