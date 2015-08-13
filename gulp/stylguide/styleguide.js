/*jslint node: true; */
/*globals require */

'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    del = require('del'),
    path = require('path'),
    tinylr = require('tiny-lr'),
    http = require('http'),
    exec = require('child_process').exec,
    rename = require("gulp-rename"),
    tree = require('ng-mural-patterns-tree'),
    scriptInject = require('ng-mural-patterns-inject'),
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
    return gulp.src(['./src/_mural/_assets/sass/*.scss', '!./src/_mural/**/_*'])
        .pipe(sass({
            sourcemap: true
        }))
        .pipe(gulp.dest('./src/_mural/_assets/css'));
});


/** -----------------------------------------------
 * JSON Tree
 * --------------------------------------------- */
gulp.task('styleguideJsonTree', function () {
    return gulp.src('./src/_mural/components/mural_patterns')
        .pipe(tree({
            patternsPath: './build/mural/patterns/components/mural_patterns/',
            jsonPath: './src/_mural/components/mural_data'
        }))
        .pipe(gulp.dest('./src/_mural/components/mural_data/'));
});


/** -----------------------------------------------
 * INJECT JSON
 * --------------------------------------------- */
gulp.task('injector', ['styleguideJsonTree'], function () {
    return gulp.src('./src/_mural/index.html')
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
    return gulp.src(['./src/_mural/components/mural_templates/templates/*.jade'])
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./build/mural/patterns/components/mural_templates/templates'));
});

/** -----------------------------------------------
 * Clean scripts
 * --------------------------------------------- */
gulp.task('clean', function (callback) {
    del([
        './src/_mural/components/mural_data/*.json',
        './src/_mural/components/**/*.html',
        './build/mural/patterns/**/*.*'
    ], callback);
});


/** -----------------------------------------------
 * Copy
 * --------------------------------------------- */
gulp.task('copy', [], function () {
    return gulp.src(['./src/_mural/**', '!./src/_mural/components/**/*.jade'])
        .pipe(gulp.dest('./build/mural/patterns'))
});

/** -----------------------------------------------
 * Watch Tasks
 * --------------------------------------------- */
gulp.task('watch', function () {
    gulp.watch('src/_mural/_assets/sass/**/*.scss', ['sass', 'copy']);
    gulp.watch('src/_mural/components/mural_app/*.jade', ['styleguidePatterns', 'copy']);
    gulp.watch('src/_mural/components/mural_patterns/**', ['styleguidePatterns', 'copy']);
    gulp.watch('src/_mural/components/mural_patterns/**/*', ['styleguidePatterns', 'copy']);
    gulp.watch(['src/_mural/components/mural_templates/**/*.jade'], ['styleguidePatterns', 'copy']);
});



