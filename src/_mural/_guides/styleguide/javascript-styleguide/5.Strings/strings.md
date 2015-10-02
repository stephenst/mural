---
name: Strings
hidecode: true
description: |

  - Use double quotes `"` for strings, and use + to add multiline strings.
  
  ```javascript
    // bad
    var name = 'Bob Parr',
        multiLine = 'multi \
                    line';
    
    // good
    var name = "Bob Parr";
    var fullName = "Bob " + this.lastName;
    var multiLine = "multi" +
                    "line";
  ```
  
  **[⬆ back to top](#table-of-contents)**
---
