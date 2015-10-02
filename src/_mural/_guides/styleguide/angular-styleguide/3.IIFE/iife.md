---
name: IIFE
hidecode: true
description: |

  - Wrap Angular components in an Immediately Invoked Function Expression (IIFE).


  *Why?*: An IIFE removes variables from the global scope. This helps prevent variables and function declarations from 
  living longer than expected in the global scope, which also helps avoid variable collisions.
  
  *Why?*: When your code is minified and bundled into a single file for deployment to a production server, you could have
   collisions of variables and many global variables. 
  
  An IIFE protects you against both of these by providing variable scope for each file.

  ```javascript
    /* avoid */
    // logger.js
    angular
      .module('app')
      .factory('logger', logger);
    
    // logger function is added as a global variable
    function logger () { }
    
    // storage.js
    angular
      .module('app')
      .factory('storage', storage);
    
    // storage function is added as a global variable
    function storage () { }

    /**
     * recommended
     *
     * no globals are left behind
     */
    
    // logger.js
    (function () {
      'use strict';
    
      angular
          .module('app')
          .factory('logger', logger);
    
      function logger () { }
    })();
    
    // storage.js
    (function () {
      'use strict';
    
      angular
          .module('app')
          .factory('storage', storage);
    
      function storage () { }
    })();
  ```

  **Note**: For brevity only, the rest of the examples in this guide may omit the IIFE syntax.

  **[⬆ back to top](#table-of-contents)**


---
