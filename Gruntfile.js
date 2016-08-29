var excludedModules = [
    'jquery'
];

// create unique time-based hash for cache-busting
// keep the prefix so it is coerced to a string.
var cacheDate = '-' + (new Date()).getTime();

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-sass');

    grunt.initConfig({
        sass : {
            options: {
                sourceMap: true,
                sourceMapContents: true,
                outputStyle : 'compressed'
            },
            dist: {
                files:
                    [{
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'www/stylesheets/scss/',      // Src matches are relative to this path.
                        src: ['*.scss', '**/*.scss'], // Actual pattern(s) to match.
                        dest: 'www/stylesheets/css/',   // Destination path prefix.
                        ext: '.css',   // Dest filepaths will have this extension.
                    }],
            }
        },
        autoprefixer: {
            options       : {
                // Task-specific options go here.
            },
            multiple_files: {
                src: 'www/stylesheets/css/*.css'
            }
        },
        watch       : {
            scripts: {
                files: ['www/js/src/**/*.js', 'www/js/src/**/*.html', 'www/viewer/*.js'],
                tasks: ['requirejs:dev', 'uglify', 'sass'],
                options: {
                    spawn: false
                }
            },
            scss: {
                files: [ 'www/stylesheets/scss/**/*.scss' ],
                tasks: [ 'sass', 'autoprefixer' ]
            }
        },
        requirejs   : {
            options: {
                baseUrl            : 'www/js/src',
                mainConfigFile     : 'www/js/src/require/require-config.js',
                dir                : 'www/js/build/',
                optimize           : 'none',
                skipModuleInsertion: true,
                skipDirOptimize    : true,
                paths              : {
                    jquery  : 'empty:',
                    vendor  : 'empty:',
                    citeproc: 'empty:',
                    sharethis: 'empty:',
                    viewer  : 'empty:',
                }
            },
            dev    : {
                options: {
                    optimize: 'none'
                }
            },
            prod   : {
                options: {
                    skipModuleInsertion: false,
                    removeCombined     : true,
                    findNestedDependencies: true,
                    optimize           : 'uglify',
                    dir                : 'www/js/build/',
                    keepBuildDir          : false,
                    paths              : {
                        jquery  : 'empty:',
                        vendor  : 'empty:',
                        citeproc: 'empty:',
                        sharethis: 'empty:',
                    },
                    modules            : [
                        {
                            name   : 'require/search',
                            exclude: excludedModules
                        }
                    ]
                }
            }
        },
        uglify      : {
            options : {
                ASCIIOnly      : true,
                beautify       : false,
                mangle         : true,
                expand         : true,
            },
            
            embed: {
                files: {
                    'www/js/build/embed/search.js': ['www/js/build/embed/search.js']
                }
            },
            
            jq: {
                files: [{
                    expand: true,
                    cwd: 'www/js/build/jq/',
                    src: ['*.js'],
                    dest: 'www/js/build/jq/',
                    ext: '.js'
                }]
            }
        },
        copy        : {
            js: {
                expand: true,
                cwd   : "./www/js/src",
                src   : "*",
                dest  : "./www/js/build/"
            }
        },
        ngAnnotate  : {
            app: {
                files: [ {
                    expand: true,
                    src   : [ 'www/js/src/ng/app/**/*.js' ]
                } ]
            }
        },

        // run both 'cacheBust' and 'replace:prod' to bust cached files and update references. Use 'clean' to cleanup extraneous files.
        // note: caching tasks are not run by default in driad-discovery-ui. Add them to the dev/prod tasks to use them.
        cacheBust : {
            options: {
                hash : cacheDate,
                assets: ['./www/js/build/**', './www/stylesheets/css/*.css'],
                encoding: 'utf8',
                separator: '',
                jsonOutput: true
            },
            src: ['./www/js/build/**/*.html', './src/ca/ubc/lsit/framework/framework_web/view/_templates/dl-base.twig']
        },
        replace: {
            // set cache_date to cacheDate in index.php
            prod: {
                src: ['www/index.php'],
                overwrite: true,
                replacements: [{
                    from: /'cache_date',.*(?=\);)/g,
                    to: "'cache_date', '" + cacheDate + "'"
                }, {
                    from: /'currently_updating',\strue/g,
                    to: "'currently_updating', false"
                }]
            },
            // set cache_date to empty string: no cacheDate prefix on files for dev
            dev: {
                src: ['www/index.php'],
                overwrite: true,
                replacements: [{
                    from: /'cache_date',.*(?=\);)/g,
                    to: "'cache_date', ''"
                }]
            }
        },
        // CAREFUL! clean wipes all matching files. Use only to clean up files that are automatically recreated (CSS, build JS)
        clean : {
            css : ['./www/stylesheets/css/*.css'],
            js : ['./www/js/build/']
        }
    });

    grunt.registerTask('default', function(){ grunt.warn('NO TASKS RUN. \n\nPlease specify one of the following tasks: \n grunt dev (create dev assets) \n grunt prod (create prod assets) \n grunt uat (create uat assets) \n grunt watch (watch js/css files for changes; run dev task on change).\n\n');});
    grunt.registerTask('annotate', [ 'ngAnnotate' ]);
    grunt.registerTask('dev', [ 'sass', 'autoprefixer', 'annotate', 'requirejs:dev']);
    grunt.registerTask('uat',  ['clean', 'sass', 'autoprefixer', 'requirejs:prod', 'uglify']);
    grunt.registerTask('prod', ['clean', 'sass', 'autoprefixer', 'requirejs:prod', 'uglify']);

};
