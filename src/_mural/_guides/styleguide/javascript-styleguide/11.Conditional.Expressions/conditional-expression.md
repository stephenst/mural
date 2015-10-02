---
name: Conditional Expression And Equality
hidecode: true
description: >

  - Use Strict Equality see [Types](#types).
  - Keep space around expressions.
  - Use shortcuts.


  ```javascript
    // bad
    if (name !== '') {
      // ...stuff...
    }
    if (collection.length > 0) {
      // ...stuff...
    }
    
    // good
    if (name) {
      // ...stuff...
    }
    if (collection.length) {
      // ...stuff...
    }
  ```

  **[⬆ back to top](#table-of-contents)**

---
