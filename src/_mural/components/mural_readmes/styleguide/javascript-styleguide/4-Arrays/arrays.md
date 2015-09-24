---
name: Arrays
description: |
  ## Arrays

  - Use the literal syntax for array creation

    ```javascript
    // bad
    var items = new Array();
    
    // good
    var items = [];
    ```

  - If you don't know array length use Array.push().

    ```javascript
    var someStack = [];
    
    // bad
    someStack[someStack.length] = 'abracadabra';
    
    // good
    someStack.push('abracadabra');
    ```

  - When you need to copy an array use Array.slice(). [jsPerf](http://jsperf.com/converting-arguments-to-an-array/7)

    ```javascript
    var len = items.length,
        itemsCopy = [],
        i;
    
    // bad
    for (i = 0; i < len; i++) {
      itemsCopy[i] = items[i];
    }
    
    // good
    itemsCopy = items.slice();
    ```
  
  **[⬆ back to top](#table-of-contents)**
---
