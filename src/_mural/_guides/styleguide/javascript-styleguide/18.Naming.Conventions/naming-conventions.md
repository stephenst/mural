---
name: Naming Conventions
hidecode: true
description: >

  - Avoid single letter names. Be descriptive with your naming.
  - Use camelCase when naming objects, functions, and instances.
  - DO NOT USE dashes or underscores in naming things. (unless private property leading underscore). Dashes and Underscores will typically be seen with CSS/SASS classes.
  - Use PascalCase when naming constructors or classes.
  - Use a leading underscore `_` when naming private properties.
  - When saving a reference to `this` use `_this` (unless other convention is followed by your library).


  ```javascript
    // bad
    function q () {
      // ...stuff...
    }
    
    // good
    function query () {
      // ..stuff..
    }

    // good
    this._firstName = "Panda";

    // good
    function User (options) {
      this.name = options.name;
    }
    
    var good = new User ({
      name: "yup"
    });
    
    // bad
    var OBJEcttsssss = {};
    var this_is_my_object = {};
    function c () {}
    var u = new user ({
      name: "Bob Parr"
    });
    
    // good
    var thisIsMyObject = {};
    function thisIsMyFunction () {}
    var user = new User ({
      name: "Bob Parr"
    });

    // good
    function log () {
      var _this = this;
      return function () {
        console.log(_this);
      };
    }
  ```

  **[⬆ back to top](#table-of-contents)**

---
