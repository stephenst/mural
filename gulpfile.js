/*jslint node: true; */
/*globals gulp, require */

'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    del = require('del'),
    path = require('path'),
    tinylr = require('tiny-lr'),
    http = require('http'),
    ecstatic = require('ecstatic'),
    embedlr = require("gulp-embedlr"),
    exec = require('child_process').exec,
    rename = require("gulp-rename"),
    tree = require('gulp-tree'),
    scriptInject = require('gulp-script-inject'),
    prunehtml = require('gulp-prune-html'),
    tlr = tinylr(),
    livereload = function (evt, filepath) {

    tlr.changed({
        body: {
            files: path.relative('./src', filepath)
        }
    });
};

/** -----------------------------------------------
 * SASS
 * --------------------------------------------- */
gulp.task('sass', function () {
    gulp.src(['./src/_assets/sass/*.scss', '!./src/**/_*'])
        .pipe(sass({
            sourcemap: true
        }))
        .pipe(gulp.dest('./src/_assets/css'));
});


/** -----------------------------------------------
 * JSON Tree
 * --------------------------------------------- */
gulp.task('tree', function () {
    gulp.src('./src/components/mural_patterns')
        .pipe(tree({
            path: './src/components/mural_data/'
        }))
        .pipe(gulp.dest('./src/components/mural_data'));
});


/** -----------------------------------------------
 * INJECT JSON
 * --------------------------------------------- */
gulp.task('injector', ['jade', 'tree'], function () {
    gulp.src('./src/index.html')
        .pipe(prunehtml(['#jsonPath']))
        .pipe(scriptInject({
            json: './src/components/mural_data',
            varname: 'jsonPath'
        }))
        .pipe(gulp.dest('./src'))
});


 /** -----------------------------------------------
 * Jade
 * --------------------------------------------- */
gulp.task('jade', function () {
    return gulp.src(['./src/components/mural_templates/**/*.jade', '!**/_*', '!./src/components/mural_templates/templates/*.jade', '!src/mural_app/'])
        .pipe(jade({
            pretty : true
        }))
        .pipe(embedlr())
        .pipe(gulp.dest('./src/'));

});
gulp.task('patternsJade', function () {
    return gulp.src(['!./src/components/mural_templates/**/*.jade', '!./src/components/mural_templates/templates'])
        .pipe(jade({
            pretty: true
        }))
        .pipe(rename(function (path) {
            path.extname = ".md"
        }))
        .pipe(gulp.dest('./src/components/mural_patterns'));
});
gulp.task('ngtemplatesJade', function () {
    gulp.src(['./src/components/mural_templates/templates/*.jade'])
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./src/components/mural_templates/templates'));
});

/** -----------------------------------------------
 * Clean scripts
 * --------------------------------------------- */
gulp.task('cleanJSON', function (cb) {
    del([
        './src/components/mural_data/*.json'
    ], cb);
});
gulp.task('cleaner', function (cb) {
    del([
        './build'
    ], cb);
});

/** -----------------------------------------------
 * Watch Tasks
 * --------------------------------------------- */
gulp.task('watch', function () {

    gulp.watch(['src/components/mural_templates/**/*.jade'], ['jade', 'injector']);
    gulp.watch('src/_assets/sass/**/*.scss', ['sass']);

    /* Jade patterns */

    gulp.watch('src/components/mural_app/*.jade', ['ngtemplatesJade']);

    gulp.watch('src/components/mural_templates/**', ['patternsJade']);

    gulp.watch('src/components/mural_patterns/**/*', ['injector']);


});


/** -----------------------------------------------
 * Copy
 * --------------------------------------------- */
gulp.task('copy', [], function () {
    gulp.src(['./src/**', '!./src/components/**/*.jade'])
        .pipe(gulp.dest('./build'))
});



/** -----------------------------------------------
 * Main and Build
 * --------------------------------------------- */
gulp.task('patterns', ['cleanJSON', 'injector', 'sass']);
gulp.task('build', ['sass', 'patterns', 'jade', 'ngtemplatesJade']);
