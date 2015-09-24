---
name: Modules
description: |
  ## Modules
  
  ### Avoid Naming Collisions
  
  - Use unique naming conventions with separators for sub-modules.

  *Why?*: Unique names help avoid module name collisions. Separators help define modules and their submodule hierarchy. For example `app` may be your root module while `app.dashboard` and 
  `app.users` may be modules that are used as dependencies of `app`.
   
  ### Definitions (aka Setters)
  
  - Declare modules without a variable using the setter syntax.

  *Why?*: With 1 component per file, there is rarely a need to introduce a variable for the module.

    ```javascript
    /* avoid */
    var app = angular.module('app', [
       'ngAnimate',
       'ngRoute',
       'app.shared',
       'app.dashboard'
    ]);
    ```
 
  Instead use the simple setter syntax.
 
    ```javascript
    /* recommended */
    angular.module('app', [
       'ngAnimate',
       'ngRoute',
       'app.shared',
       'app.dashboard'
    ]);
    ```
  
  ### Getters
   
  - When using a module, avoid using a variable and instead use chaining with the getter syntax.

  *Why?*: This produces more readable code and avoids variable collisions or leaks.
   
    ```javascript
    /* avoid */
    var app = angular.module('app');
    app.controller('SomeController', SomeController);
    
    function SomeController() { }
    ```
    
    ```javascript
    /* recommended */
    angular
       .module('app')
       .controller('SomeController', SomeController);
    
    function SomeController() { }
    ```
  
  ### Setting vs Getting
  
  - Only set once and get for all other instances.
  
  *Why?*: A module should only be created once, then retrieved from that point and after.
  
  - Use `angular.module('app', []);` to set a module.
  - Use `angular.module('app');` to get a module.
  
  - NOTE: If you call the same module name again with the `[]` it will re-instantiate the module; and remove any prior modules loaded under the name.
   
  ### Named vs Anonymous Functions
  - Use named functions instead of passing an anonymous function in as a callback.
  
  *Why?*: This produces more readable code, is much easier to debug, and reduces the amount of nested callback code.
   
    ```javascript
    /* avoid */
    angular
       .module('app')
       .controller('Dashboard', function() { })
       .factory('logger', function() { });
    ```
    
    ```javascript
    /* recommended */
    
    // dashboard.js
    angular
       .module('app')
       .controller('Dashboard', Dashboard);
    
    function Dashboard() { }
    ```
    
    ```javascript
    // logger.js
    angular
       .module('app')
       .factory('logger', logger);
    
    function logger() { }
    ```
  
  **[⬆ back to top](#table-of-contents)**

---
