---
name: Comments
hidecode: true
description: >
  - Use [JSDoc style comments](http://usejsdoc.org/) in your code for robust comments.
  - Use `/** ... */` for multiline comments. Include a description, specify types and values for all parameters and return values.
  
  - We check the following rules via `.jscsrc` in the build process:
    - We validate `@param` names in jsdoc and in function declaration are equal
    - We ensures params in jsdoc contains type
    - Reports redundant params in jsdoc
    - Report statements for functions with no return
    - Reports invalid types for bunch of tags
    - Enforce existence for functions
    - Ensures a param description has a hyphen before it (checks for -)
    - Ensures a doc comment description has padding newline


  ```javascript
    // good
    /**
     * make() returns a new element
     * based on the passed in tag name
     *
     * @ngdoc (overview|modules|service|filter|controller|directive)
     * @name NAME OF FUNCTION OR MODULE
     * @memberof NAME OF PARENT Module
     * @summary DESCRIPTION HERE
     * @param {String} message
     * @param {Number|Object} [line]
     * function method(message, line) {
     * 
     * }
     */
    function make(tag) {
    
      // ...stuff...
    
      return element;
    }
  ```

  - Use `//` for single line comments. Place single line comments on a newline above the subject of the comment. Put an empty line before the comment.
  
  
  - Prefixing your comments with `FIXME` or `TODO` helps other developers quickly understand if you're pointing out a problem that needs to be revisited, or if you're suggesting a solution to the problem that needs to be implemented. These are different than regular comments because they are actionable. The actions are `FIXME -- need to figure this out` or `TODO -- need to implement`.
  
  
  - Assign your name after the `FIXME` or `TODO` so we know who wrote it.
  
  
  - Use `// FIXME:` to annotate problems.


  ```javascript
    function Calculator() {
    
      // FIXME: (@tstephens) - shouldn't use a global here
      total = 0;
    
      return this;
    }
  ```

  - Use `// TODO:` to annotate solutions to problems.


  ```javascript
    function Calculator() {
    
      // TODO:  (@tstephens) - total should be configurable by an options param
      this.total = 0;
    
      return this;
    }
  ```

  **[⬆ back to top](#table-of-contents)**

---
