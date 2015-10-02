---
name: Constructors
hidecode: true
description: >

  - Assign methods to the prototype object, instead of overwriting the prototype with a new object. Overwriting the prototype makes inheritance impossible: by resetting the prototype you'll overwrite the base!
  - Methods can return `this` to help with method chaining.
  
  
  ```javascript
    function Jedi() {
      console.log("new jedi");
    }
    
    // good
    Jedi.prototype.fight = function fight() {
      console.log("fighting");
    };
    
    Jedi.prototype.block = function block() {
      console.log("blocking");
    };
  ```

  **[⬆ back to top](#table-of-contents)**

---
