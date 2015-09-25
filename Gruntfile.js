module.exports = function (grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('ng-mural-styleguide');

    //Initializing Grunt Configuration
    grunt.initConfig({
        //  Read in the Package File
        cfg: grunt.file.readJSON('config.json'),
        styleguide: {
            build: {
                options: {
                    framework: {
                        name: 'styledocco',
                        options: {
                            preprocessor: 'scss'
                        }
                    },
                    name: 'Style Guide'
                },
                files: {
                    '<%= cfg.styles.dest %>': '<%= cfg.styles.assets %>'
                }
            }
        },
        jsdoc: {
            dist: {
                jsdoc: '/usr/local/bin/jsdoc',
                src: [
                    '<%= cfg.jsdoc.src %><%= cfg.jsdoc.sourceFiles %>',
                    './readme.md'
                ],
                options: {
                    destination: '<%= cfg.jsdoc.dest %>',
                    configure: './node_modules/ng-mural-jsdoc/conf.json',
                    template: './node_modules/ng-mural-jsdoc/template'
                }
            }
        }
    });
    grunt.registerTask('default', ['styleguide', 'jsdoc']);
};
