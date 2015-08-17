---
name: How To
description: |
  ### Use when
  # Mural - API
    The Mural API is built based on JS-Doc comments in the code of the application.  To deal with Angular; we also use the NG-Doc aspect of JS-Doc.
    
    ### It uses JS-Doc
    What it JS-Doc?  The [jsdoc website](http://usejsdoc.org/) is an excellent resource. 
    
    We also use an extension for JS-doc called ng-doc.
    
    ### The @ngdoc Directive
    
    This directive helps to specify the template used to render the item being documented. For instance, a directive would have different properties to a filter and so would be documented differently. The commonly used types are:
    
    overview - Give an overview of the file/module being documented
    interface - Describe the interface of an object or service, specified by the @name directive. (abstract: use @object or @service instead)
    service - Describe an AngularJS service, such as $compile or $http, for instance.
    object - Describe a well defined object (often exposed as a service)
    function - Describe a function that will be available to other methods (such as a helper function within the ng module)
    method - Describe a method on an object/service
    property - Describe a property on an object/service
    event - Describe an AngularJS event that will propagate through the $scope tree.
    directive - Describe an AngularJS directive
    filter - Describe an AngularJS filter
    inputType - Describe a specific type of AngularJS input directive (such as text, email or checkbox)
    error - Describe a minErr error message
    
---
/**
 * @ngdoc (overview | interface | service | object | directive | filter...)
 * @name NAME OF MODULE
 *
 * @classdesc
 *  THE DESCRIPTION
 *
 * @summary
 *  A LONGER DESCRIPTION.  PUT BOTH IN AND SEE WHERE THEY GENERATE.
 *
 * @requires ANY DEPENDENCY HERE FOR THE MODULE
 *
 * @param {PARAM TYPE) PARAM NAME - PARAM DESCRIPTION
 */
