---
name: ECMAScript 5 Compatibility
hidecode: true
description: >

  - Refer to [Kangax](https://twitter.com/kangax/)'s ES5 [compatibility table](http://kangax.github.com/es5-compat-table/)

  - Use [Strict Mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode). Declare `"use strict";` at 
  the top of the execution context (of module or function).
  
  
  ```javascript
    // good
    "use strict"
    var v = "Strict mode on!";
    
    // good - used just once at the top level
    function strict () {
        // Function-level strict mode syntax
        "use strict";
        
        function nested () { 
          return "And so am I!";
        }
        return "Hi!  I'm a strict mode function!  " + nested();
    }
    
    function notStrict () {
      return "I'm not strict.";
    }
  ```

  **[⬆ back to top](#table-of-contents)**

---
