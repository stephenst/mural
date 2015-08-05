/*jslint node: true; */
/*globals require */

'use strict';

var gulp = require('gulp'),
    Dgeni = require('dgeni'),
    packages = [require('../config/dgeni/dgeni-conf')],
    dgeni = new Dgeni(packages);


/** -----------------------------------------------
 * Copy
 * --------------------------------------------- */
gulp.task('api-copy', [], function () {
    gulp.src(['./src/_mural/_assets/**'])
        .pipe(gulp.dest('./build/api/_assets/'))
});


gulp.task('api', function () {
    try {
        var dgeni = new Dgeni([require('../config/dgeni/dgeni-conf')]);
        return dgeni.generate().then(function (response) {
            console.log(response.length, 'docs generated');
        });
    } catch(x) {
        console.log(x.stack);
        throw x;
    }
});
