---
name: Directives
hidecode: true
description: >
  
  - Create one directive per file. Name the file for the directive.

  *Why?*: It is easy to mash all the directives in one file, but difficult to then break those out so some are shared across apps, some across modules, some just for one module.

  *Why?*: One directive per file is easy to maintain.

  > Note: "**Best Practice**: Directives should clean up after themselves. You can use `element.on('$destroy', ...)` or `scope.$on('$destroy', ...)` to run a clean-up function when the directive is removed" ... from the Angular documentation

  ```javascript
    /* avoid */
    /* directives.js */
    
    angular
      .module('app.widgets')
    
      /* order directive that is specific to the order module */
      .directive('orderCalendarRange', orderCalendarRange)
    
      /* sales directive that can be used anywhere across the sales app */
      .directive('salesCustomerInfo', salesCustomerInfo)
    
      /* spinner directive that can be used anywhere across apps */
      .directive('sharedSpinner', sharedSpinner);
    
    function orderCalendarRange () {
      /* implementation details */
    }
    
    function salesCustomerInfo () {
      /* implementation details */
    }
    
    function sharedSpinner () {
      /* implementation details */
    }
  ```

  ```javascript
    /* recommended */
    /* calendarRange.directive.js */
    
    /**
    * @desc order directive that is specific to the order module at a company named Acme
    * @example <div acme-order-calendar-range></div>
    */
    angular
      .module('sales.order')
      .directive('acmeOrderCalendarRange', orderCalendarRange);
    
    function orderCalendarRange () {
      /* implementation details */
    }
  ```
  
  ```javascript
    /* recommended */
    /* customerInfo.directive.js */
    
    /**
    * @desc sales directive that can be used anywhere across the sales app at a company named Acme
    * @example <div acme-sales-customer-info></div>
    */
    angular
      .module('sales.widgets')
      .directive('acmeSalesCustomerInfo', salesCustomerInfo);
    
    function salesCustomerInfo () {
      /* implementation details */
    }
  ```
  
  ```javascript
    /* recommended */
    /* spinner.directive.js */
    
    /**
    * @desc spinner directive that can be used anywhere across apps at a company named Acme
    * @example <div acme-shared-spinner></div>
    */
    angular
      .module('shared.widgets')
      .directive('acmeSharedSpinner', sharedSpinner);
    
    function sharedSpinner () {
      /* implementation details */
    }
  ```

  Note: There are many naming options for directives, especially since they can be used in narrow or wide scopes. Choose one that makes the directive and its file name distinct and clear.

  Some examples are below, but see the [Naming](#naming) section for more recommendations.

  ### Manipulate DOM in a Directive

  - When manipulating the DOM directly, use a directive. If alternative ways can be used such as using CSS to set styles or the [animation services](https://docs.angularjs.org/api/ngAnimate), Angular templating, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) or [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide), then use those instead. For example, if the directive simply hides and shows, use ngHide/ngShow.

  *Why?*: DOM manipulation can be difficult to test, debug, and there are often better ways (e.g. CSS, animations, templates)

  ### Provide a Unique Directive Prefix
  
  - Provide a short, unique and descriptive directive prefix such as `sgCriteriaBrowser` which would be declared in HTML as `sg-criteria-browser`.

  *Why?*: The unique short prefix identifies the directive's context and origin. For example a prefix of `sg-` may indicate that the directive is part of a Security Group.

  Note: Avoid `ng-` as these are reserved for Angular directives. Research widely used directives to avoid naming conflicts, such as `ion-` for the [Ionic Framework](http://ionicframework.com/).
  
  ### Restrict to Elements and Attributes

  - When creating a directive that makes sense as a stand-alone element, allow restrict `E` (custom element) and optionally restrict `A` (custom attribute). Generally, if it could be its own control,
    `E` is appropriate. General guideline is allow `EA` but lean towards implementing as an element when it's stand-alone and as an attribute when it enhances its existing DOM element.

  *Why?*: It makes sense.

  *Why?*: While we can allow the directive to be used as a class, if the directive is truly acting as an element it makes more sense as an element or at least as an attribute.

  Note: EA is the default for Angular 1.3 +
  
  ```html
    <!-- recommended -->
    <my-calendar-range></my-calendar-range>
    <div my-calendar-range></div>
  ```
  
  ```javascript
    /* recommended */
    angular
      .module('app.widgets')
      .directive('myCalendarRange', myCalendarRange);
    
    function myCalendarRange () {
      var directive = {
          link: link,
          templateUrl: '/template/is/located/here.html',
          restrict: 'EA'
      };
      return directive;
    
      function link (scope, element, attrs) {
        /* */
      }
    }
  ```

  ### Directives and ControllerAs
  
  - Use `controller as` syntax with a directive to be consistent with using `controller as` with view and controller pairings.

  *Why?*: It makes sense and it's not difficult.

  Note: The directive below demonstrates some of the ways you can use scope inside of link and directive controllers, using controllerAs. I in-lined the template just to keep it all in one place.
  
  Note: Regarding dependency injection, see [Manually Identify Dependencies](#manual-annotating-for-dependency-injection).

  Note: The directive's controller is outside the directive's closure. This style eliminates issues where the injection gets created as unreachable code after a `return`.
  
  ```html
    <div my-example max="77"></div>
  ```
      
  ```javascript
    angular
      .module('app')
      .directive('myExample', myExample);
    
    function myExample () {
      var directive = {
          restrict: 'EA',
          templateUrl: 'app/feature/example.directive.html',
          scope: {
              max: '='
          },
          link: linkFunc,
          controller: ExampleController,
          controllerAs: 'vm',
          bindToController: true // because the scope is isolated
      };
    
      return directive;
    
      function linkFunc (scope, el, attr, ctrl) {
          console.log('LINK: scope.min = %s *** should be undefined', scope.min);
          console.log('LINK: scope.max = %s *** should be undefined', scope.max);
          console.log('LINK: scope.vm.min = %s', scope.vm.min);
          console.log('LINK: scope.vm.max = %s', scope.vm.max);
      }
    }
    
    ExampleController.$inject = ['$scope'];
    
    function ExampleController($scope) {
      // Injecting $scope just for comparison
      var vm = this;
    
      vm.min = 3;
    
      console.log('CTRL: $scope.vm.min = %s', $scope.vm.min);
      console.log('CTRL: $scope.vm.max = %s', $scope.vm.max);
      console.log('CTRL: vm.min = %s', vm.min);
      console.log('CTRL: vm.max = %s', vm.max);
    }
  ```
      
  ```html
    <!-- example.directive.html -->
    <div>hello world</div>
    <div>max={{vm.max}}<input ng-model="vm.max"/></div>
    <div>min={{vm.min}}<input ng-model="vm.min"/></div>
  ```
      
  Note: You can also name the controller when you inject it into the link function and access directive attributes as properties of the controller.
    
  ```javascript
    // Alternative to above example
    function linkFunc (scope, el, attr, vm) {
      console.log('LINK: scope.min = %s *** should be undefined', scope.min);
      console.log('LINK: scope.max = %s *** should be undefined', scope.max);
      console.log('LINK: vm.min = %s', vm.min);
      console.log('LINK: vm.max = %s', vm.max);
    }
  ```

  - Use `bindToController = true` when using `controller as` syntax with a directive when you want to bind the outer scope to the directive's controller's scope.

  *Why?*: It makes it easy to bind outer scope to the directive's controller scope.

  Note: `bindToController` was introduced in Angular 1.3.0.

  ```html
    <div my-example max="77"></div>
  ```
      
  ```javascript
    angular
      .module('app')
      .directive('myExample', myExample);
    
    function myExample () {
      var directive = {
          restrict: 'EA',
          templateUrl: 'app/feature/example.directive.html',
          scope: {
              max: '='
          },
          controller: ExampleController,
          controllerAs: 'vm',
          bindToController: true
      };
    
      return directive;
    }
    
    function ExampleController () {
      var vm = this;
      vm.min = 3;
      console.log('CTRL: vm.min = %s', vm.min);
      console.log('CTRL: vm.max = %s', vm.max);
    }
  ```
    
  ```html
    <!-- example.directive.html -->
    <div>hello world</div>
    <div>max={{vm.max}}<input ng-model="vm.max"/></div>
    <div>min={{vm.min}}<input ng-model="vm.min"/></div>
  ```

---
