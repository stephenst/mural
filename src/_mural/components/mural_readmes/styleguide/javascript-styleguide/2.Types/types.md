---
name: Types
description: |

  ### Types
  - When comparing items; use the triple comparison to ensure you're also comparing types.

  **[⬆ back to top](#table-of-contents)**
---
```javascript
  var x = "2";
  var y = 2;
  if (x == y) {
    console.log("this will fire, but it shouldn't");
  }
  if (x === y) {
    console.log("This won't fire; as it compares types of string and integer as well as value");
  }
```
