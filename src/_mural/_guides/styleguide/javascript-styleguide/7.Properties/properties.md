---
name: Properties
hidecode: true
description: |
  
  - Use dot notation when accessing properties.


  ```javascript
    var luke = {
      jedi: true,
      age: 28
    };
    
    // bad
    var isJedi = luke["jedi"];
    
    // good
    var isJedi = luke.jedi;
  ```
    
  - Use subscript notation [] if you need to access properties with a variable.
    
  
  ```javascript
    var luke = {
      jedi: true,
      age: 28
    };
    
    function getProp(prop) {
      return luke[prop];
    }
    
    var isJedi = getProp("jedi");
  ```

  **[⬆ back to top](#table-of-contents)**

---
