---
name: Objects
description: |
  
  ## Objects
  - Use the literal syntax for object creation.

    ```javascript
    // bad
    var items = new Array(),
        item = new Object();

    // good
    var items = [];
    var item = {};
    ```
  - Don't use [reserved words](http://es5.github.io/#x7.6.1) as keys.  Avoid using similar words if possible as well.

    ```javascript
    // bad
    var superman = {
      default: { clark: 'kent' },
      private: true
    };
    
    // good
    var superman = {
      baseValue: { clark: 'kent' },
      hidden: true
    };
    ```

  - Use readable synonyms in place of [reserved words](http://es5.github.io/#x7.6.1).

    ```javascript
    // bad
    var superman = {
      class: 'alien',
      klass: 'alien'
    };
    
    // good
    var superman = {
      type: 'alien'
    };
    ```

  **[⬆ back to top](#table-of-contents)**
---
