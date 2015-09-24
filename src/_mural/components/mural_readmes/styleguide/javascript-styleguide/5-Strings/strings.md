---
name: Strings
description: |
  
  ## Strings
  - NOTE: I'd rather move to `"` double quotes; as that's the standard in JSON, and in HTML.
  - Use single quotes `''` for strings, and use + to add multiline strings. (We don't support ES6 backticks at this moment)
  
    ```javascript
    // bad
    var name = "Bob Parr",
        multiLine = 'multi \
                    line';
    
    // good
    var name = 'Bob Parr',
        fullName = 'Bob ' + this.lastName,
        multiLine = 'multi' +
                    'line';
    ```
  
  **[⬆ back to top](#table-of-contents)**
  
---
```javascript
// bad
var name = "Bob Parr",
    multiLine = 'multi \
                line';

// good
var name = 'Bob Parr',
    fullName = 'Bob ' + this.lastName,
    multiLine = 'multi' +
                'line';
```
