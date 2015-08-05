/*jslint node: true; */
/*globals require */

'use strict';
// gulpfile.js
var gulp        = require('gulp'),
    runSequence = require('run-sequence'),
    requireDir  = require('require-dir'),
    serve       = require('browser-sync');

// Require all tasks.
requireDir( './gulp', { recurse: true } );

// Commonly used tasks defined here.
gulp.task( 'buildStyleGuide', function(  )
{
    runSequence(
        'clean',
        'styleguideJsonTree',
        'styleguideJadeIndex',
        'styleguideJadeTemplates',
        'styleguideMarkdownPatterns',
        'sass',
        'injector',
        'copy'
    );
} );


gulp.task('serve', function () {
    serve.create().init({
        port: 3000,
        open: false,
        server: {
            baseDir: 'build/styleguide',
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
            // serve our jspm dependencies with the client folder
            //  routes: {
            //      '/underscore.js': './_assets/vendor/underscore.js',
            //  }
        },
        notify: false
    });
    serve.create().init({
        port: 4000,
        open: false,
        server: {
            baseDir: './build/api',
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
            // serve our jspm dependencies with the client folder
            //  routes: {
            //      '/underscore.js': './_assets/vendor/underscore.js',
            //  }
        },
        notify: false
    });
});

/** -----------------------------------------------
 * Style Guide Build
 * --------------------------------------------- */
gulp.task('styleguidePatterns', ['styleguideJadeIndex', 'styleguideJadeTemplates', 'styleguideMarkdownPatterns', 'injector']);
gulp.task('buildStyleGuide2', ['clean', 'styleguideJsonTree', 'styleguideJadeIndex', 'styleguideJadeTemplates', 'styleguideMarkdownPatterns', 'sass', 'injector', 'copy']);
