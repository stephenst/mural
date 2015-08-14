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
        callback
    );
});
gulp.task('Mural', [
    // run complete grunt tasks
    'grunt-jsdoc',
    'grunt-styleguide',
    'buildStyleGuide'
]);


/** -----------------------------------------------
 * gulp sass - SASS
 * --------------------------------------------- */
gulp.task('sass', function () {
    return gulp.src(['./src/_mural/_assets/sass/*.scss', '!./src/_mural/**/_*'])
        .pipe(sass({
            sourcemap: true
        }))
        .pipe(gulp.dest(muralConfig.src + muralConfig.css));
});


/** -----------------------------------------------
 * gulp styleguideJsonTree - JSON Tree
 * @summary This reads through the folders of markdown documents in `Patterns` and generates a JSON file with paths
 * --------------------------------------------- */
gulp.task('styleguideJsonTree', function () {
    gulp.src('./src/_mural/components/mural_patterns')
        .pipe(tree({
            patternsPath: './build/mural/patterns/components/mural_patterns/',
            jsonPath: './src/_mural/components/mural_data'
        }))
        .pipe(gulp.dest(muralConfig.src + muralConfig.data));
});


/** -----------------------------------------------
 * gulp injector - INJECT JSON
 * @summary This reads the generated JSON files (from the Tree); and inserts those into the Index.
 * --------------------------------------------- */
gulp.task('injector', ['styleguideJsonTree'], function () {
    gulp.src('./src/_mural/index.html')
        .pipe(prunehtml(['#jsonPath']))
        .pipe(scriptInject({
            path: muralConfig.src + muralConfig.data,
            varname: 'jsonPath'
        }))
        .pipe(gulp.dest(muralConfig.src));
});


/** -----------------------------------------------
 * gulp styleguideJadeIndex - Hack for index file.
 * --------------------------------------------- */
gulp.task('styleguideJadeIndex', function () {
    return gulp.src(['./src/_mural/components/mural_templates/index.jade'])
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(muralConfig.src));

});
/** -----------------------------------------------
 * gulp styleguideMarkdownPatterns - Reads the markdown documents
 * @todo research this module more.
 * --------------------------------------------- */
gulp.task('styleguideMarkdownPatterns', function () {
    return gulp.src(['!./src/_mural/components/mural_templates/**/*.jade', '!./src/_mural/components/mural_templates/templates', './src/_mural/components/mural_patterns'])
        .pipe(jade({
            pretty: true
        }))
        .pipe(rename(function (path) {
            path.extname = ".md"
        }))
        .pipe(gulp.dest(muralConfig.src + muralConfig.patterns));
});
/** -----------------------------------------------
 * gulp styleguideJadeTemplates - Creates html templates cause I much prefer Jade
 * --------------------------------------------- */
gulp.task('styleguideJadeTemplates', function () {
    return gulp.src(['./src/_mural/components/mural_templates/templates/*.jade'])
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(muralConfig.dest + muralConfig.templates));
});

/** -----------------------------------------------
 * gulp clean - Clean scripts
 * --------------------------------------------- */
gulp.task('clean', function (callback) {
    del([
        './src/_mural/index.html',
        './src/_mural/components/**/*.html',
        './build/mural/patterns/**/*.*'
    ], callback);
});


/** -----------------------------------------------
 * gulp copy - Copy the files to the mural/patterns directory.
 * --------------------------------------------- */
gulp.task('copy', [], function () {
    return gulp.src(['./src/_mural/**', '!./src/_mural/components/**/*.jade'])
        .pipe(gulp.dest(muralConfig.dest));
});



