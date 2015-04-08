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
    exec = require('child_process').exec,
    rename = require("gulp-rename"),
    tree = require('gulp-tree'),
    scriptInject = require('gulp-script-inject'),
    prunehtml = require('gulp-prune-html'),
    tlr = tinylr(),
    livereload = function (evt, filepath) {

        tlr.changed({
            body: {
                files: path.relative('./src/_mural', filepath)
            }
        });
    };

/** -----------------------------------------------
 * SASS
 * --------------------------------------------- */
gulp.task('sass', function () {
    gulp.src(['./src/_mural/_assets/sass/*.scss', '!./src/_mural/**/_*'])
        .pipe(sass({
            sourcemap: true
        }))
        .pipe(gulp.dest('./src/_mural/_assets/css'));
});


/** -----------------------------------------------
 * JSON Tree
 * --------------------------------------------- */
gulp.task('styleguideJsonTree', function () {
    gulp.src('./src/_mural/components/mural_patterns')
        .pipe(tree({
            patternsPath: './src/_mural/components/mural_patterns/',
            jsonPath: './src/_mural/components/mural_data/'
        }))
        .pipe(gulp.dest('./src/_mural/components/mural_data/'));
});


/** -----------------------------------------------
 * INJECT JSON
 * --------------------------------------------- */
gulp.task('injector', ['styleguideJsonTree'], function () {
    gulp.src('./src/_mural/index.html')
        .pipe(prunehtml(['#jsonPath']))
        .pipe(scriptInject({
            path: './src/_mural/components/mural_data',
            varname: 'jsonPath'
        }))
        .pipe(gulp.dest('./src/_mural'));
});


/** -----------------------------------------------
 * Jade
 * --------------------------------------------- */
gulp.task('styleguideJadeIndex', function () {
    return gulp.src(['./src/_mural/components/mural_templates/index.jade'])
        .pipe(jade({
            pretty : true
        }))
        .pipe(gulp.dest('./src/_mural'));

});
gulp.task('styleguideMarkdownPatterns', function () {
    return gulp.src(['!./src/_mural/components/mural_templates/**/*.jade', '!./src/_mural/components/mural_templates/templates', './src/_mural/components/mural_patterns'])
        .pipe(jade({
            pretty: true
        }))
        .pipe(rename(function (path) {
            path.extname = ".md"
        }))
        .pipe(gulp.dest('./src/_mural/components/mural_patterns'));
});
gulp.task('styleguideJadeTemplates', function () {
    gulp.src(['./src/_mural/components/mural_templates/templates/*.jade'])
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./src/_mural/components/mural_templates/templates'));
});

/** -----------------------------------------------
 * Clean scripts
 * --------------------------------------------- */
gulp.task('clean', function (cb) {
    del([
        './src/_mural/components/mural_data/*.json',
        './src/_mural/components/**/*.html',
        './build/styleguide/**/*.*'
    ], cb);
});


/** -----------------------------------------------
 * Copy
 * --------------------------------------------- */
gulp.task('copy', [], function () {
    gulp.src(['./src/_mural/**', '!./src/_mural/components/**/*.jade'])
        .pipe(gulp.dest('./build/styleguide'))
});

/** -----------------------------------------------
 * Watch Tasks
 * --------------------------------------------- */
gulp.task('watch', function () {

    gulp.watch('src/_mural/_assets/sass/**/*.scss', ['sass']);

    /* Jade patterns */

    gulp.watch('src/_mural/components/mural_app/*.jade', ['styleguidePatterns']);
    gulp.watch('src/_mural/components/mural_patterns/**', ['styleguidePatterns']);
    gulp.watch('src/_mural/components/mural_patterns/**/*', ['styleguidePatterns']);
    gulp.watch(['src/_mural/components/mural_templates/**/*.jade'], ['styleguidePatterns']);
});



