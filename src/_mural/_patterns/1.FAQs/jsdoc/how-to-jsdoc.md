---
name: Mural - API
hidecode: true
description: |
  The Mural API is built based on JS-Doc comments in the code of the application.  To deal with Angular; we also use the NG-Doc aspect of JS-Doc.
  
  #### A NPM module?
  This aspect of the Mural app is contained in an NPM module, ng-mural-jsdoc.
  JSDoc 3 Template for AngularJS; customized for the Mural app.
  A JSDoc plugin and template for AngularJS, nothing else.
  
  #### Features
  * Common Template TOC, table of contents,  for navigation by Directives, Services, Controllers, etc
  * Read and process @ngdoc tag
  
  #### Read More about JS-Doc and Ng-Doc
  * [Writing AngularJS Documentation - by Angular](https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation).
  * [Writing JsDoc Documentation](http://usejsdoc.org/)
  
  #### See live examples.
  Many of the /common/ components have been marked up with the ng/js-doc comments.  You can use those as a starting point.
  
  #### Setting up your IDE for JS-Docs
  Sublime Text has a [sublime-jsdocs](https://github.com/spadgos/sublime-jsdocs) package.
  To set up an [IntelliJ IDE, follow these instructions](https://www.jetbrains.com/idea/help/creating-jsdoc-comments.html).
  
  #### AngularJS specific ngdoc directives
  In addition to the standard jsdoc directives, there are a number that are specific to the Angular code-base:
  * @ngdoc - specifies the type of thing being documented. See below for more detail.
  * @scope - specifies that the documented directive will create a new scope
  * @priority - specifies the documented directive's priority
  * @animations - specifies the animations that the documented directive supports
  * @restrict - specifies how directives should be shown in the usage section. For example, for [E]lement, [A]ttribute, and [C]lass, use @restrict ECA
  * @methodOf type - links a method to the object/service where it is defined
  * @propertyOf type - links a property to the object/service where it is defined
  * @eventOf type - links a method to the object/service where it is defined
  * @eventType emit|broadcast - specifies whether the event is emitted or broadcast
  
  #### The @ngdoc Directive
  This directive helps to specify the template used to render the item being documented. For instance, a directive would have different properties to a filter and so would be documented differently. The commonly used types are:
  
  * overview - Give an overview of the file/module being documented
  * interface - Describe the interface of an object or service, specified by the @name directive. (abstract: use @object or @service instead)
  * service - Describe an AngularJS service, such as $compile or $http, for instance.
  * object - Describe a well defined object (often exposed as a service)
  * function - Describe a function that will be available to other methods (such as a helper function within the ng module)
  * method - Describe a method on an object/service
  * property - Describe a property on an object/service
  * event - Describe an AngularJS event that will propagate through the $scope tree.
  * directive - Describe an AngularJS directive
  * filter - Describe an AngularJS filter
  * inputType - Describe a specific type of AngularJS input directive (such as text, email or checkbox)
  * error - Describe a minErr error message
  
  #### Usage Examples
  
  ```
    /**
    * @ngdoc directive
    * @name NAME OF MODULE
    * @memberof NAME OF PARENT
    * @ctrl NAME OF CONTROLLER (if one)
    *
    * @classdesc
    *
    * @summary
    *   SUMMARY HERE
    *
    *   Restrict To:
    *     Element
    *
    * @example
    * Usage:
    *   NEED HTML EXAMPLE HERE
    *
    *
    * @requires {@Link LINKED NAME} 
    *
    * @param {LINK TO MOCKED OBJECT} PARAM NAME - PARAM DESCRIPTION.
    */
  ```
---
<script>
    /**
    * @ngdoc directive
    * @name NAME OF MODULE
    * @memberof NAME OF PARENT
    * @ctrl NAME OF CONTROLLER (if one)
    *
    * @classdesc
    *
    * @summary
    *   SUMMARY HERE
    *
    *   Restrict To:
    *     Element
    *
    * @example
    * Usage:
    *   NEED HTML EXAMPLE HERE
    *
    *
    * @requires {@Link LINKED NAME} 
    *
    * @param {LINK TO MOCKED OBJECT} PARAM NAME - PARAM DESCRIPTION.
    */
</script>
