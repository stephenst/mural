---
name: Whitespace
hidecode: true
description: > 

  - Use soft tabs set to 4 spaces.
  - Place 1 space before the leading brace.
  - Place 1 space after the function, before the parens.
  - Set off operators with spaces.
  - Use indentation when making long method chains.


  ```javascript
    // bad
    function test(){
      console.log("test");
    }
    
    // good
    function test (User, UserFactory, AuthFactory) {
      console.log("test");
    }

    // bad
    var x=y+5;
    
    // good
    var x = y + 5;

    // not bad.
    $("#items").find(".selected").highlight().updateCount();
    
    // a bit worse
    $("#items").find(".selected").highlight().end().find(".open").updateCount();
    
    // good
    $("#items")
        .find(".selected")
            .highlight()
            .end()
        .find(".open")
            .updateCount();
    
    // bad
    var leds = stage.selectAll(".led").data(data).enter().append("svg:svg").class("led", true)
        .attr("width",  (radius + margin) * 2).append("svg:g")
        .attr("transform", "translate(" + (radius + margin) + "," + (radius + margin) + ")")
        .call(tron.led);
    
    // good
    var leds = stage.selectAll(".led")
        .data(data)
      .enter().append("svg:svg")
        .class("led", true)
        .attr("width",  (radius + margin) * 2)
      .append("svg:g")
        .attr("transform", "translate(" + (radius + margin) + "," + (radius + margin) + ")")
        .call(tron.led);
  ```
    
  - End files with a single newline character. (Editors automatically support this when correctly set to honor the provided `.editorconfig`)
    
  ```javascript
    // good
    (function(global) {
      // ...stuff...
    })(this);↵
    ↵
  ```

  **[⬆ back to top](#table-of-contents)**

---
