---
name: Angular Style Guide
description: |
    # JavaScript Style Guide
    
    This guide serves as the coding standard for all JavaScript code. 
    It should be regularly revised and understood by front dev teams.
    Please comment by creating [pull request](https://secmgmtgit.provo.novell.com:8443/projects/ENGUTIL/repos/styleguide/pull-requests)
    
    ## Table of Contents
    
      1. [General](#general)
      1. [Types](#types)
      1. [Objects](#objects)
      1. [Arrays](#arrays)
      1. [Strings](#strings)
      1. [Functions](#functions)
      1. [Properties](#properties)
      1. [Variables](#variables)
      1. [Reserved Words](#reserved-words)
      1. [Hoisting](#hoisting)
      1. [Conditional Expressions & Equality](#conditional-expressions--equality)
      1. [Blocks](#blocks)
      1. [Comments](#comments)
      1. [Whitespace](#whitespace)
      1. [Commas](#commas)
      1. [Semicolons](#semicolons)
      1. [Type Casting & Coercion](#type-casting--coercion)
      1. [Naming Conventions](#naming-conventions)
      1. [Accessors](#accessors)
      1. [Constructors](#constructors)
      1. [Events](#events)
      1. [Modules](#modules)
      1. [jQuery](#jquery)
      1. [Angular](#Angular)
      1. [Testing](#Testing) 
      1. [ECMAScript 5 Compatibility](#ecmascript-5-compatibility)
      1. [Contributing](#contributing)
    
    
    ## General
    
    - All code and comments are written in succint professional English
    - Line length should be limited to a "screen width" which can vary between 100 and 200 characters
    - Consistency, readability, simplicity are ultimate goals
    - Use modern editors and lint tools for style guidance and enforcement  
    
    **[⬆ back to top](#table-of-contents)**
    
    ## Types
    - When comparing items; use the triple comparison to ensure you're also comparing types.
    
    
    **[⬆ back to top](#table-of-contents)**
    
    ## Objects
    
      - Use the literal syntax for object creation.
    
        ```javascript
        // bad
        var items = new Array();
    
        // good
        var items = [];
    
        // bad
        var item = new Object();
        
        // good
        var item = {};
        ```
    
    
      - Don't use [reserved words](http://es5.github.io/#x7.6.1) as keys.
    
        ```javascript
        // bad
        var superman = {
          default: { clark: 'kent' },
          private: true
        };
        
        // good
        var superman = {
          defaults: { clark: 'kent' },
          hidden: true
        };
        ```
    
      - Use readable synonyms in place of reserved words.
    
        ```javascript
        // bad
        var superman = {
          class: 'alien'
        };
        
        // bad
        var superman = {
          klass: 'alien'
        };
        
        // good
        var superman = {
          type: 'alien'
        };
        ```
    
    **[⬆ back to top](#table-of-contents)**
    
    ## Arrays - add to indepth section
    
      - Use the literal syntax for array creation
    
        ```javascript
        // bad
        var items = new Array();
        
        // good
        var items = [];
        ```
    
      - If you don't know array length use Array#push.
    
        ```javascript
        var someStack = [];
        
        // bad
        someStack[someStack.length] = 'abracadabra';
        
        // good
        someStack.push('abracadabra');
        ```
    
      - When you need to copy an array use Array#slice. [jsPerf](http://jsperf.com/converting-arguments-to-an-array/7)
    
        ```javascript
        var len = items.length;
        var itemsCopy = [];
        var i;
        
        // bad
        for (i = 0; i < len; i++) {
          itemsCopy[i] = items[i];
        }
        
        // good
        itemsCopy = items.slice();
        ```
    
      - To convert an array-like object to an array, use Array#slice.
    
        ```javascript
        function trigger() {
          var args = Array.prototype.slice.call(arguments);
          ...
        }
        ```
    
    **[⬆ back to top](#table-of-contents)**
    
    
    ## Strings
    
      - Use single quotes `''` for strings
    
        ```javascript
        // bad
        var name = "Bob Parr";
        
        // good
        var name = 'Bob Parr';
        
        // good
        var fullName = 'Bob ' + this.lastName;
        
        // bad
        var multiLine = 'multi \
            line';
        
        // good
        var multiLine = 'multi' +
            'line';
        ```
    
    
      - When programmatically building up a string, use Array#join instead of string concatenation. Mostly for IE: [jsPerf](http://jsperf.com/string-vs-array-concat/2).
    
    
    **[⬆ back to top](#table-of-contents)**
    
    
    ## Functions
    
      - Function expressions always use named functions for sandbox purposes.
    
        ```javascript
        // anonymous function expression
        var anonymous = function () {
          return true;
        };
        
        // named function expression
        var named = function named () {
          return true;
        };
        ```
    
    **[⬆ back to top](#table-of-contents)**
    
    
    
    ## Properties
    
      - Use dot notation when accessing properties.
    
        ```javascript
        var luke = {
          jedi: true,
          age: 28
        };
        
        // bad
        var isJedi = luke['jedi'];
        
        // good
        var isJedi = luke.jedi;
        ```
    
    **[⬆ back to top](#table-of-contents)**
    
    
    ## Variables
    
      - Always use `var` to declare variables. Not doing so will result in global variables. We want to avoid polluting the global namespace.
      - Use one `var` declaration per variable.
        It's easier to add new variable declarations this way, and you never have
        to worry about swapping out a `;` for a `,` or introducing punctuation-only
        diffs. 
    
        ```javascript
        // good
        var items = getItems();
        var goSportsTeam = true;
        var dragonball = 'z';
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
    
    ## Reserved Words
    
    * Do not use reserved words ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Reserved_Words)) for naming variables or Object properties.
    
    
    ## Hoisting
    
     - Function declaration hoisting is **good**. This can be called feature that helps readability.
    
     - Variable declaration hoisting is **bad**. 
    
        More links:
      
        - [JavaScript Scoping & Hoisting - Ben Cherry](http://www.adequatelygood.com/2010/2/JavaScript-Scoping-and-Hoisting)
        - [JavaScript Hoisting Explained - Jeffrey Way](http://code.tutsplus.com/tutorials/quick-tip-javascript-hoisting-explained--net-15092)
    
    **[⬆ back to top](#table-of-contents)**
    
    
    
    ## Conditional Expressions & Equality
    
      - Use `===` and `!==` over `==` and `!=`.
    
      - Keep space
    
        ```javascript
        // bad
        apple!== pear;
        
        // good
        apple !== pear
        ```
    
      For more information see [Truth Equality and JavaScript](http://javascriptweblog.wordpress.com/2011/02/07/truth-equality-and-javascript/#more-2108) by Angus Croll
    
    **[⬆ back to top](#table-of-contents)**
    
    
    ## Blocks
    
      - Use One True Brace Style.
        // good
        function () {
          return false;
        }
        ```
    
    **[⬆ back to top](#table-of-contents)**
    
    
    ## Comments
    
      - Use `/** ... */` for multiline comments. Include a description, specify types and values for all parameters and return values.
    
        ```javascript
        // good
        /**
         * make() returns a new element
         * based on the passed in tag name
         * @summary DESCRIPTION HERE
         * @requires ANY REQUIRED ELEMENT LISTED HERE
         * @param {String} tag
         * @return {Element} element
         */
        function make(tag) {
        
          // ...stuff...
        
          return element;
        }
        ```
    
      - Use `//` for single line comments. Place single line comments on a newline above the subject of the comment. Put an empty line before the comment.
    
      - Prefixing your comments with `FIXME` or `TODO` helps other developers quickly understand if you're pointing out a problem that needs to be revisited, or if you're suggesting a solution to the problem that needs to be implemented. These are different than regular comments because they are actionable. The actions are `FIXME -- need to figure this out` or `TODO -- need to implement`.
    
      - Use `// FIXME:` to annotate problems
    
        ```javascript
        function Calculator() {
        
          // FIXME: shouldn't use a global here
          total = 0;
        
          return this;
        }
        ```
    
      - Use `// TODO:` to annotate solutions to problems
    
        ```javascript
        function Calculator() {
        
          // TODO: total should be configurable by an options param
          this.total = 0;
        
          return this;
        }
        ```
    
    **[⬆ back to top](#table-of-contents)**
    
    
    ## Whitespace
    
      - Use soft tabs set to 4 spaces
      - Place 1 space before the leading brace.
      - Place 1 space after the function, before the parens.
      - Set off operators with spaces.
      - Use indentation when making long method chains.
    
        ```javascript
        // bad
        function test(){
          console.log('test');
        }
        
        // good
        function test (User, UserFactory, AuthFactory) {
          console.log('test');
        }
    
        // bad
        var x=y+5;
        
        // good
        var x = y + 5;
    
        // bad
        $('#items').find('.selected').highlight().end().find('.open').updateCount();
        
        // good
        $('#items')
            .find('.selected')
                .highlight()
                .end()
            .find('.open')
                .updateCount();
        
        // bad
        var leds = stage.selectAll('.led').data(data).enter().append('svg:svg').class('led', true)
            .attr('width',  (radius + margin) * 2).append('svg:g')
            .attr('transform', 'translate(' + (radius + margin) + ',' + (radius + margin) + ')')
            .call(tron.led);
        
        // good
        var leds = stage.selectAll('.led')
            .data(data)
          .enter().append('svg:svg')
            .class('led', true)
            .attr('width',  (radius + margin) * 2)
          .append('svg:g')
            .attr('transform', 'translate(' + (radius + margin) + ',' + (radius + margin) + ')')
            .call(tron.led);
        ```
    
    **[⬆ back to top](#table-of-contents)**
    
    ## Commas
    
      - Leading commas: **Nope.**
    
        ```javascript
        // good
        var story = [
          once,
          upon,
          aTime
        ];
        
        // good
        var hero = {
          firstName: 'Bob',
          lastName: 'Parr',
          heroName: 'Mr. Incredible',
          superPower: 'strength'
        };
        ```
    
      - Additional trailing comma: **Nope.** This can cause problems with IE6/7 and IE9 if it's in quirksmode. Also, in some implementations of ES3 would add length to an array if it had an additional trailing comma. This was clarified in ES5 ([source](http://es5.github.io/#D)):
    
    
    **[⬆ back to top](#table-of-contents)**
    
    
    ## Type Casting & Coercion
    
      - Use `parseInt` for Numbers and always with a radix for type casting.
    
        ```javascript
        var inputValue = '4';
        
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
    
    
    ## Naming Conventions
    
      - Avoid single letter names. Be descriptive with your naming.
    
    
      - Use camelCase when naming objects, functions, and instances
    
    
      - Use PascalCase when naming constructors or classes
    
    
      - Use a leading underscore `_` when naming private properties
      - When saving a reference to `this` use `_this`.
    
        ```javascript
        // bad
        function q() {
          // ...stuff...
        }
        
        // good
        function query () {
          // ..stuff..
        }
    
        // good
        this._firstName = 'Panda';
    
        // good
        function User(options) {
          this.name = options.name;
        }
        
        var good = new User({
          name: 'yup'
        });
        
        // bad
        var OBJEcttsssss = {};
        var this_is_my_object = {};
        function c() {}
        var u = new user({
          name: 'Bob Parr'
        });
        
        // good
        var thisIsMyObject = {};
        function thisIsMyFunction() {}
        var user = new User({
          name: 'Bob Parr'
        });
    
        // good
        function() {
          var _this = this;
          return function() {
            console.log(_this);
          };
        }
        ```
    
    
    **[⬆ back to top](#table-of-contents)**
    
    
    ## Accessors
    
      - Accessor functions for properties are not required
      - If you do make accessor functions use getVal() and setVal('hello')
      - If the property is a boolean, use isVal() or hasVal()
    
    **[⬆ back to top](#table-of-contents)**
    
    ## Constructors
    
      - Assign methods to the prototype object, instead of overwriting the prototype with a new object. Overwriting the prototype makes inheritance impossible: by resetting the prototype you'll overwrite the base!
      - Methods can return `this` to help with method chaining.
    
    
    **[⬆ back to top](#table-of-contents)**
    
    
    
    ## Modules
      - Always declare `'use strict';` at the top of the module.
    
    
    **[⬆ back to top](#table-of-contents)**
    
    ## ECMAScript 5 Compatibility
    
      - Refer to [Kangax](https://twitter.com/kangax/)'s ES5 [compatibility table](http://kangax.github.com/es5-compat-table/)
    
    **[⬆ back to top](#table-of-contents)**
    
    
    ## jQuery
    
      - Prefix jQuery object variables with a `$`.
      - Cache jQuery lookups.
      - For DOM queries use Cascading `$('.sidebar ul')` or parent > child `$('.sidebar > ul')`. [jsPerf](http://jsperf.com/jquery-find-vs-context-sel/16)
      - Use `find` with scoped jQuery object queries.
    
        ```javascript
        // bad
        $('ul', '.sidebar').hide();
        
        // bad
        $('.sidebar').find('ul').hide();
        
        // good
        $('.sidebar ul').hide();
        
        // good
        $('.sidebar > ul').hide();
        
        // good
        $sidebar.find('ul').hide();
        ```
    
    **[⬆ back to top](#table-of-contents)**
    
    ## Angular
    
    Angular coding standards are located in separate document
    
    **[⬆ back to top](#table-of-contents)**
    
    
    ## Testing
    
    Follow your project testing strategy. Use case demos DO NOT QUALIFY as "tests".
    
    **[⬆ back to top](#table-of-contents)**
    
    
    ## Contributing
    
    Any changes need to this document (published in official location or shared) need to go through team review
    
    
    **[⬆ back to top](#table-of-contents)**
    
    
---
