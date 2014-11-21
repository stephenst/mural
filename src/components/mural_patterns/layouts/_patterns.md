<!DOCTYPE html>
<html lang="en" ng-app="tapestry" class="no-js tapestry menu__opened">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title ng-bind="'Tapestry - ' + section">Tapestry</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <link rel="stylesheet" href="_assets/bower_components/font-awesome/css/font-awesome.css">
    <link rel="stylesheet" href="_assets/css/app/tapestry.css">
    <link rel="stylesheet" href="_assets/bower_components/prism/themes/prism.css">
    <link href="http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,400,300,600,700" rel="stylesheet">
    <!-- Your CSS File-->
    <link rel="stylesheet" href="external/css/main.css">
    <!-- / Your CSS File-->
    <script src="_assets/bower_components/modernizr/modernizr.js"></script>
  </head>
  <body>
    <!-- Menu-->
    <nav class="tapestry-menu">
      <h3 class="menu__header">Introduction</h3>
      <ul>
        <li ng-class="{active: section=='Overview'}"><a href="#!/">Overview</a></li>
      </ul>
      <div ng-repeat="style in styles">
        <h3 once-text="style.name" class="menu__header"></h3>
        <ul>
          <li ng-repeat="element in style.data" ng-class="{'active': element.slug == sectionSlug}" once-show="element.children.length"><a once-href="'#!/'+style.slug+'/'+element.slug" once-text="element.name"></a></li>
        </ul>
      </div>
    </nav>
    <!-- / Menu-->
    <header ng-controller="headerController" class="tapestry-header">
      <h3 ng-bind="section" class="tapestry__heading"></h3>
      <button ng-click="toggleMenu($event)" class="btn btn--unstyled btn--toggle"><em class="fa fa-bars"></em></button>
      <div action="" class="form-control icon-left">
        <input type="text" ng-model="selected" typeahead="pattern.url as pattern.value for pattern in globalPatterns | filter:$viewValue | limitTo:8" name="section" class="input input-inverted"><em class="fa fa-search fa-lg"></em>
      </div>
    </header>
    <!-- Content-->
    <div class="tapestry-content">
      <div class="container">
        <div class="row">
          <div class="columns ten twelve--tablet column--center">
            <footer class="tapestry__footer">
              <p>Code licensed under MIT, documentation under CC BY 3.0. <br>Version<span tapestry-version></span>. Last Updated on<span last-updated></span>.<a href="#!/changelog">Changelog</a></p>
            </footer>
          </div>
        </div>
      </div>
    </div>
    <!-- jQuery-->
    <!-- script(src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.0/jquery.min.js")-->
    <script src="_assets/bower_components/jquery/jquery.js"></script>
    <!-- jQuery-->
    <!-- Parsers-->
    <script src="_assets/bower_components/js-yaml/js-yaml.js"></script>
    <script src="_assets/bower_components/marked/lib/marked.js"></script>
    <!-- PrismJS code highlighter-->
    <script src="_assets/bower_components/prism/prism.js"></script>
    <!-- Patterns-->
    <script src="_assets/bower_components/angular/angular.min.js"></script>
    <script src="_assets/bower_components/angular-route/angular-route.min.js"></script>
    <script src="_assets/bower_components/angular-once/once.js"></script>
    <script src="_assets/js/app/controllers.js"></script>
    <script src="_assets/js/app/directives.js"></script>
    <script src="_assets/js/app/filters.js"></script>
    <script src="_assets/js/app/services.js"></script>
    <script src="_assets/js/app/app.js"></script>
    <!-- / Patterns-->
    <!-- Autocomplete-->
    <script src="_assets/bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
    <!-- Autocomplete-->
  </body>
</html>