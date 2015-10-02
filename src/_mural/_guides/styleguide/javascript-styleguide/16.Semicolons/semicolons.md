---
name: Semicolons
hidecode: true
description: >

  - **Yes.** (declarations, function execution, modules)


  ```javascript
    // bad
    (function() {
      var name = "Skywalker"
      return name
    })()
    
    // good
    (function() {
      var name = "Skywalker";
      return name;
    })();
    
    // good (guards against the function becoming an argument when two files with IIFEs are concatenated)
    ;(function() {
      var name = "Skywalker";
      return name;
    })();
  ```

  More at [Stackoverflow](http://stackoverflow.com/a/7365214/1712802).

  **[⬆ back to top](#table-of-contents)**

---
