---
name: Variables
hidecode: true
description: >
  - Always use `var` to declare variables. Not doing so will result in global variables. We want to avoid polluting the global namespace.
  - Use one `var` declaration per variable.
    It's easier to add new variable declarations this way, and you never have
    to worry about swapping out a `;` for a `,` or introducing punctuation-only
    diffs. 

  
  ```javascript
    // good
    var items = getItems();
    var goSportsTeam = true;
    var dragonball = "z";
  ```

  - Assign variables at the top of their scope. This helps avoid issues with variable declaration and assignment hoisting related issues.
  - Declare unassigned variables last. This is helpful when later on you might need to assign a variable depending on one of the previous assigned variables.


  ```javascript
    // bad
    var i, len, dragonball,
        items = getItems(),
        goSportsTeam = true;
    
    // bad
    var i;
    var items = getItems();
    var dragonball;
    var goSportsTeam = true;
    var len;
    
    // good
    var items = getItems();
    var goSportsTeam = true;
    var dragonball;
    var length;
    var i;
  ```

  **[⬆ back to top](#table-of-contents)**


---
