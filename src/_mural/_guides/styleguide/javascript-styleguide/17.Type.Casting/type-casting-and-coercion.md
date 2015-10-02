---
name: Type Casting And Coercion
hidecode: true
description: >

  - Use `parseInt` for Numbers and always with a radix for type casting.


  ```javascript
    var inputValue = "4";
    
    // bad
    var val = new Number(inputValue);
    
    // good
    var val = parseInt(inputValue, 10);
  ```

  - Booleans:


  ```javascript
    var age = 0;
    
    // bad
    var hasAge = new Boolean(age);
    
    // good
    var hasAge = Boolean(age);
    
    // good
    var hasAge = !!age;
  ```

  **[⬆ back to top](#table-of-contents)**


---
