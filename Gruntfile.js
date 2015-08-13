
module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);

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
                    '<%= cfg.dirs.docs %>/styles': '<%= cfg.dirs.dev.source %>styles/main.scss'
                }
            }
        },
        jsdoc: {
            dist: {
                jsdoc: '/usr/local/bin/jsdoc',
                src: [
                    '<%= cfg.jsdoc.src %>/components/mural_app/*.js',
                    './readme.md'
                ],
                options: {
                    destination: '<%= cfg.jsdoc.dest %>/api',
                    configure: './node_modules/angular-jsdoc/conf.json',
                    template: './node_modules/angular-jsdoc/template'
                }
            }
        }
    });
    grunt.registerTask('default', ['docs']);
    grunt.registerTask('docs', ['clean:docs','styleguide', 'ftp_push:html','ftp_push:images']);
};
