---
name: Commas
hidecode: true
description: >

  - Leading commas: **Don't use.**


  ```javascript
    // good
    var story = [
      once,
      upon,
      aTime
    ];
    
    // good
    var hero = {
      firstName: "Kevin",
      lastName: "Flynn"
    };
  ```

  - Additional trailing comma: **Don't use.** This can cause problems with IE6/7 and IE9 if it's in quirksmode. 
  Also, in some implementations of ES3 would add length to an array if it had an additional trailing comma. 
  This was clarified in ES5 ([source](http://es5.github.io/#D)):

  > Edition 5 clarifies the fact that a trailing comma at the end of an ArrayInitialiser does not add to the length of the array. This is not a semantic change from Edition 3 but some implementations may have previously misinterpreted this.


  ```javascript
    // bad
    var story = [
      once,
      upon,
      aTime,
    ];
    
    // bad
    var hero = {
      firstName: "Kevin",
      lastName: "Flynn",
    };
  ```

  **[⬆ back to top](#table-of-contents)**


---
