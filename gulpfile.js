/*jslint node: true; */
/*globals require */

'use strict';
// gulpfile.js
var gulp        = require('gulp'),
    runSequence = require('run-sequence'),
    requireDir  = require('require-dir');

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


/** -----------------------------------------------
 * Style Guide Build
 * --------------------------------------------- */
gulp.task('styleguidePatterns', ['styleguideJadeIndex', 'styleguideJadeTemplates', 'styleguideMarkdownPatterns', 'injector']);
gulp.task('buildStyleGuide2', ['clean', 'styleguideJsonTree', 'styleguideJadeIndex', 'styleguideJadeTemplates', 'styleguideMarkdownPatterns', 'sass', 'injector', 'copy']);
