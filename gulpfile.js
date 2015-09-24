/*jslint node: true; */
/*globals require */

'use strict';

var gulp = require('gulp'),
    runSequence = require('run-sequence').use(gulp),
    fs = require('fs'),
    gutil = require('gulp-util'),
    serve = require('browser-sync'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    del = require('del'),
    path = require('path'),
    http = require('http'),
    exec = require('child_process').exec,
    rename = require('gulp-rename'),
    tree = require('ng-mural-patterns-tree'),
    scriptInject = require('ng-mural-patterns-inject'),
    prunehtml = require('gulp-prune-html'),
    muralConfig = JSON.parse(fs.readFileSync('./config.json')),
    gruntGulp = require('gulp-grunt')(gulp);  // add all the gruntfile tasks to gulp


/** -----------------------------------------------
 * gulp serve - Start Local Server
 * --------------------------------------------- */
gulp.task('serve', function () {
    serve({
        port: 3000,
        open: false,
        server: {
            baseDir: 'build/',
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        },
        notify: false
    });
});

/** -----------------------------------------------
 * gulp buildStyleGuide - Style Guide Build
 * --------------------------------------------- */
gulp.task('buildStyleGuide', function (callback) {
    runSequence(
        'clean',
        'styleguideJsonTree',
        'styleguideJadeIndex',
        'styleguideJadeTemplates',
        'styleguideMarkdownPatterns',
        'injector',
        'sass',
        'copy',
        'injector',
        callback
    );
});
gulp.task('Mural', [
    // run complete grunt tasks
    'grunt-docs',
    'buildStyleGuide'
]);


/** -----------------------------------------------
 * gulp sass - SASS
 * @todo Remove this task; it's not needed as we use grunt-contrib-sass to build the sass; as the main Sentinal app uses Bourbon to compile (and gulp-sass would need node-bourbon, and grunt-contrib-sass uses Ruby)
 * --------------------------------------------- */
gulp.task('sass', function () {
    // return gulp.src(['./src/_mural/_assets/sass/*.scss', '!./src/_mural/**/_*'])
    return gulp.src(muralConfig.patterns.src + muralConfig.patterns.sass + '*.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest(muralConfig.patterns.src + muralConfig.patterns.css));
});


/** -----------------------------------------------
 * gulp styleguideJsonTree - JSON Tree
 * @summary This reads through the folders of markdown documents in `Patterns` and generates a JSON file with paths
 * @todo Fix config.json so the paths aren't goofy when read in. Suspect a JSON parsing issue??
 * --------------------------------------------- */
gulp.task('styleguideJsonTree', ['copy'], function () {
    gulp.src(muralConfig.patterns.src + muralConfig.patterns.patterns)
        .pipe(tree({
            patternsPath: muralConfig.patterns.dest + muralConfig.patterns.patterns,
            jsonPath: muralConfig.patterns.src + muralConfig.patterns.patterns
        }))
        .pipe(gulp.dest(muralConfig.src + muralConfig.patterns.json));
});
gulp.task('readmeJsonTree', [], function () {
    gulp.src(muralConfig.readme.src + muralConfig.readme.markdown)
        .pipe(tree({
            patternsPath: muralConfig.readme.dest + muralConfig.readme.markdown,
            jsonPath: muralConfig.readme.src + muralConfig.readme.markdown
        }))
        .pipe(gulp.dest(muralConfig.readme.src + muralConfig.readme.json));
});


/** -----------------------------------------------
 * gulp injector - INJECT JSON
 * @summary This reads the generated JSON files (from the Tree); and inserts those into the Index.
 * --------------------------------------------- */
gulp.task('injector', ['styleguideJsonTree', 'readmeInjector'], function () {
    gulp.src(muralConfig.patterns.src + '/index.html')
        .pipe(prunehtml(['#jsonPath']))
        .pipe(scriptInject({
            jsonPath: muralConfig.patterns.src + muralConfig.patterns.json,
            jsonPathToTrim: 'components/mural_data/',
            jsonVar: 'jsonPath'
        }))
        .pipe(gulp.dest(muralConfig.patterns.dest));
});
gulp.task('readmeInjector', ['readmeJsonTree'], function () {
    gulp.src(muralConfig.patterns.src + '/index.html')
        .pipe(prunehtml(['#readmePath']))
        .pipe(scriptInject({
            jsonPath: muralConfig.patterns.src + muralConfig.readme.json,
            jsonPathToTrim: '_assets/data/readmes/',
            jsonVar: 'readmePath'
        }))
        .pipe(gulp.dest(muralConfig.src));
});



/** -----------------------------------------------
 * gulp styleguideJadeIndex - Hack for index file.
 * --------------------------------------------- */
gulp.task('styleguideJadeIndex', function () {
    return gulp.src(['./js/angular-apps/_mural/components/mural_templates/index.jade'])
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(muralConfig.src));

});
/** -----------------------------------------------
 * gulp styleguideMarkdownPatterns - Reads the markdown documents
 * @todo research this module more. Maybe just converts Jade to Markdown?
 * --------------------------------------------- */
gulp.task('styleguideMarkdownPatterns', function () {
    /*
     return gulp.src('./js/angular-apps/_mural/components/mural_patterns/')
     .pipe(jade({
     pretty: true
     }))
     .pipe(rename(function (path) {
     path.extname = ".md"
     }))
     .pipe(gulp.dest(muralConfig.src + muralConfig.patterns.patterns));
     */
});
/** -----------------------------------------------
 * gulp styleguideJadeTemplates - Creates html templates cause I much prefer Jade
 * --------------------------------------------- */
gulp.task('styleguideJadeTemplates', function () {
    return gulp.src([muralConfig.patterns.src + muralConfig.patterns.templates + '/**/*.jade'])
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(muralConfig.patterns.dest + muralConfig.patterns.templates));
});

/** -----------------------------------------------
 * gulp clean - Clean scripts
 * --------------------------------------------- */
gulp.task('clean', function (callback) {
    del([
        './js/angular-apps/_mural/index.html',
        './js/angular-apps/_mural/components/**/*.html',
        './build/mural/patterns/**/*.*'
    ], callback);
});


/** -----------------------------------------------
 * gulp copy - Copy the files to the mural/patterns directory.  also for images.
 * --------------------------------------------- */
gulp.task('copy', ['copy-patterns-readme', 'copy-api-readme', 'copy-styles-readme', 'copy-styles-images', 'copy-styles'], function () {
    return gulp.src([muralConfig.src + '**', '!' + muralConfig.src + 'components/**/*.jade'])
        .pipe(gulp.dest(muralConfig.patterns.dest));
});
gulp.task('copy-patterns-readme', [], function () {
    return gulp.src('./Readme.md')
        .pipe(gulp.dest(muralConfig.patterns.dest));
});
gulp.task('copy-api-readme', [], function () {
    return gulp.src('./node_modules/ng-mural-jsdoc/Readme.md')
        .pipe(gulp.dest(muralConfig.jsdoc.dest));
});
gulp.task('copy-styles-readme', [], function () {
    return gulp.src('./node_modules/ng-mural-styledocco/Readme.md')
        .pipe(gulp.dest(muralConfig.styles.dest));
});
gulp.task('copy-styles-images', [], function () {
    return gulp.src('./images/**')
        .pipe(gulp.dest(muralConfig.styles.images));
});
gulp.task('copy-styles', [], function () {
    return gulp.src('./styles/main.css')
        .pipe(gulp.dest(muralConfig.styles.css));
});



