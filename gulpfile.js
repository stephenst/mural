"use strict";

var gulp = require("gulp");
var runSequence = require("run-sequence").use(gulp);
var fs = require("fs");
var gutil = require("gulp-util");
var serve = require("browser-sync");
var jade = require("gulp-jade");
var sass = require("gulp-sass");
var del = require("del");
var path = require("path");
var http = require("http");
var exec = require("child_process").exec;
var rename = require("gulp-rename");
var tree = require("ng-mural-patterns-tree");
var scriptInject = require("ng-mural-patterns-inject");
var prunehtml = require("gulp-prune-html");
var muralConfig = JSON.parse(fs.readFileSync("./config.json"));
var gruntGulp = require("gulp-grunt")(gulp);  // add all the gruntfile tasks to gulp
var sassLint = require("gulp-sass-lint");

/** -----------------------------------------------
 * gulp serve - Start Local Server
 * --------------------------------------------- */
gulp.task("serve", function() {
    serve({
        port: 3000,
        open: false,
        server: {
            baseDir: "build/",
            middleware: function(req, res, next) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                next();
            }
        },
        notify: false
    });
});

/** -----------------------------------------------
 * gulp buildStyleGuide - Style Guide Build
 * --------------------------------------------- */
gulp.task("buildStyleGuide", function(callback) {
    runSequence(
        "clean",
        "styleguideJsonTree",
        "styleguideJadeIndex",
        "styleguideJadeTemplates",
        "injector",
        "sassLint",
        "sass",
        "copy",
        "injector",
        callback
    );
});
gulp.task("Mural", [
    // run complete grunt tasks
    "grunt-default",
    "buildStyleGuide"
]);

/** -----------------------------------------------
 * gulp sass - SASS
 * @todo (@tstephens) Remove this task; it's not needed as we use grunt-contrib-sass to build the sass; as the main Sentinal app uses Bourbon to compile (and gulp-sass would need node-bourbon, and grunt-contrib-sass uses Ruby)
 * --------------------------------------------- */
gulp.task("sass", function() {
    return gulp.src(muralConfig.patterns.src + muralConfig.patterns.sass + "*.scss")
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest(muralConfig.patterns.src + muralConfig.patterns.css));
});

/** -----------------------------------------------
 * gulp sassLint - Validating the source SASS
 * --------------------------------------------- */
gulp.task("sassLint", function () {
    gulp.src(muralConfig.patterns.src + muralConfig.patterns.sass + "/*.s+(a|c)ss")
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});

/** -----------------------------------------------
 * gulp styleguideJsonTree - JSON Tree
 * @summary This reads through the folders of markdown documents in `Patterns` and generates a JSON file with paths
 * @todo (@tstephens) Fix config.json so the paths aren't goofy when read in. Suspect a JSON parsing issue??
 * --------------------------------------------- */
gulp.task("styleguideJsonTree", ["copy"], function() {
    gulp.src(muralConfig.patterns.rootPath)
        .pipe(tree({
            patternsPath: muralConfig.patterns.rootPath,
            jsonPath: muralConfig.patterns.src + muralConfig.patterns.json,
            pathToTrim: muralConfig.patterns.src
        }))
        .pipe(gulp.dest(muralConfig.src + muralConfig.patterns.json));
});
gulp.task("readmeJsonTree", [], function () {
    gulp.src(muralConfig.readme.rootPath)
        .pipe(tree({
            patternsPath: muralConfig.readme.rootPath,
            jsonPath: muralConfig.readme.src + muralConfig.readme.json,
            pathToTrim: muralConfig.patterns.src
        }))
        .pipe(gulp.dest(muralConfig.readme.src + muralConfig.readme.json));
});

/** -----------------------------------------------
 * gulp injector - INJECT JSON
 * @summary This reads the generated JSON files (from the Tree); and inserts those into the Index.
 * --------------------------------------------- */
gulp.task("injector", ["styleguideJsonTree", "readmeInjector"], function() {
    gulp.src(muralConfig.patterns.dest + "index.html")
        .pipe(prunehtml(["#jsonPath"]))
        .pipe(scriptInject({
            jsonPath: muralConfig.patterns.src + muralConfig.patterns.json,
            jsonPathToTrim: muralConfig.patterns.json,
            jsonVar: "jsonPath"
        }))
        .pipe(gulp.dest(muralConfig.patterns.dest));
});
gulp.task("readmeInjector", ["readmeJsonTree"], function() {
    gulp.src(muralConfig.patterns.src + "index.html")
        .pipe(prunehtml(["#readmePath"]))
        .pipe(scriptInject({
            jsonPath: muralConfig.readme.dest + muralConfig.readme.json,
            jsonPathToTrim: muralConfig.readme.json,
            jsonVar: "readmePath"
        }))
        .pipe(gulp.dest(muralConfig.patterns.src));
});

/** -----------------------------------------------
 * gulp styleguideJadeIndex - Hack for index file.
 * --------------------------------------------- */
gulp.task("styleguideJadeIndex", function() {
    return gulp.src([muralConfig.patterns.src + muralConfig.patterns.templates + "index.jade"])
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(muralConfig.patterns.src));

});

/** -----------------------------------------------
 * gulp styleguideJadeTemplates - Creates html templates cause I much prefer Jade
 * --------------------------------------------- */
gulp.task("styleguideJadeTemplates", function() {
    return gulp.src([muralConfig.patterns.src + muralConfig.patterns.templates + "/**/*.jade"])
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(muralConfig.patterns.dest + muralConfig.patterns.templates));
});

/** -----------------------------------------------
 * gulp clean - Clean scripts
 * --------------------------------------------- */
gulp.task("clean", function(callback) {
    del(muralConfig.mural.clean, callback);
});

/** -----------------------------------------------
 * gulp copy - Copy the files to the mural/patterns directory.  also for images.
 * --------------------------------------------- */
gulp.task("copy", ["copy-patterns-readme", "copy-api-readme", "copy-styles-readme"], function() {
    return gulp.src([muralConfig.patterns.src + "**", "!" + muralConfig.patterns.src + "components/**/*.jade"])
        .pipe(gulp.dest(muralConfig.patterns.dest));
});
gulp.task("copy-patterns-readme", [], function() {
    return gulp.src("./Readme.md")
        .pipe(gulp.dest(muralConfig.patterns.dest));
});
gulp.task("copy-api-readme", [], function() {
    return gulp.src("./node_modules/ng-mural-jsdoc/Readme.md")
        .pipe(gulp.dest(muralConfig.jsdoc.dest));
});
gulp.task("copy-styles-readme", [], function() {
    return gulp.src("./node_modules/ng-mural-styledocco/Readme.md")
        .pipe(gulp.dest(muralConfig.styles.dest));
});

