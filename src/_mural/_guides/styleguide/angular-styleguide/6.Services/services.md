---
name: Services
hidecode: true
description: >

  ### Reusable Utilities
  
  - Use Angular services over factories.
 
  *Why?*: Using construction functions gives you more flexibility to extend and reuse.
    
  *Why?*: Working with constructor functions in ES5 makes ES6 migration easier.

  Read more:

  * [Service vs Factory - Once and for all](http://blog.thoughtram.io/angular/2015/07/07/service-vs-factory-once-and-for-all.html)
  * [NG Docs - Providers](https://docs.angularjs.org/guide/providers)

  ```javascript
    // service
    angular
      .module('app')
      .service('logger', logger);
    
    function logger () {
      this.logError = function (msg) {
      /* */
      };
    }
  ```
  
  ### Singletons
  
  [All Angular services are singletons](https://docs.angularjs.org/guide/services). This means that there is only one 
  instance of a given service per injector.
      
  **[⬆ back to top](#table-of-contents)**


  ## Data Services

  ### Separate Data Calls

  - Refactor logic for making data operations and interacting with data to a factory. Make data services responsible for XHR calls, local storage, stashing in memory, or any other data operations.

  *Why?*: The controller's responsibility is for the presentation and gathering of information for the view. It should not care how it gets the data, just that it knows who to ask for it.
  Separating the data services moves the logic on how to get it to the data service, and lets the controller be simpler and more focused on the view.

  *Why?*: This makes it easier to test (mock or real) the data calls when testing a controller that uses a data service.

  *Why?*: Data service implementation may have very specific code to handle the data repository. This may include headers, how to talk to the data, or other services such as $http.
  Separating the logic into a data service encapsulates this logic in a single place hiding the implementation from the outside consumers (perhaps a controller), also making it easier to change the implementation.
    
  ```javascript
    /* recommended */
    
    // dataservice factory
    angular
      .module('app.core')
      .factory('dataservice', dataservice);
    
    dataservice.$inject = ['$http', 'logger'];
    
    function dataservice($http, logger) {
      return {
          getAvengers: getAvengers
      };
    
      function getAvengers () {
          return $http.get('/api/maa')
              .then(getAvengersComplete)
              .catch(getAvengersFailed);
    
          function getAvengersComplete (response) {
              return response.data.results;
          }
    
          function getAvengersFailed (error) {
              logger.error('XHR Failed for getAvengers.' + error.data);
          }
      }
    }
  ```

  Note: The data service is called from consumers, such as a controller, hiding the implementation from the consumers, as shown below.

  ```javascript
    /* recommended */
    
    // controller calling the dataservice factory
    angular
      .module('app.avengers')
      .controller('Avengers', Avengers);
    
    Avengers.$inject = ['dataservice', 'logger'];
    
    function Avengers(dataservice, logger) {
      var vm = this;
      vm.avengers = [];
    
      activate();
    
      function activate () {
          return getAvengers().then(function () {
              logger.info('Activated Avengers View');
          });
      }
    
      function getAvengers () {
          return dataservice.getAvengers()
              .then(function (data) {
                  vm.avengers = data;
                  return vm.avengers;
              });
      }
    }
  ```

  ### Return a Promise from Data Calls
  
  - When calling a data service that returns a promise such as `$http`, return a promise in your calling function too.

  *Why?*: You can chain the promises together and take further action after the data call completes and resolves or rejects the promise.

  ```javascript
    /* recommended */
    
    activate();
    
    function activate () {
      /**
       * Step 1
       * Ask the getAvengers function for the
       * avenger data and wait for the promise
       */
      return getAvengers().then(function () {
          /**
           * Step 4
           * Perform an action on resolve of final promise
           */
          logger.info('Activated Avengers View');
      });
    }
    
    function getAvengers () {
        /**
         * Step 2
         * Ask the data service for the data and wait
         * for the promise
         */
        return dataservice.getAvengers()
            .then(function (data) {
                /**
                 * Step 3
                 * set the data and resolve the promise
                 */
                vm.avengers = data;
                return vm.avengers;
        });
    }
  ```

  **[⬆ back to top](#table-of-contents)**


---
