'use strict';

module.exports = function(grunt) {
  // Unified Watch Object
  var watchFiles = {
    clientViews: ['**/*.html'],
    clientJS: ['public/js/*.js'],
    clientCSS: ['css/**/*.css'],
    clientSASS: ['css/less/**/*.scss']
  };

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      clientViews: {
        files: watchFiles.clientViews,
        options: {
          livereload: true,
        }
      },
      clientJS: {
        files: watchFiles.clientJS,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
    /*  clientCSS: {
        files: watchFiles.clientCSS,
        tasks: ['csslint'],
        options: {
          livereload: true
        }
      },*/
      clientSASS: {
        files: watchFiles.clientSASS,
        tasks: ['less'],
        options: {
          livereload: true,
        }
      }
    },
  /*  jshint: {
      option: {
        reporter: require('jshint-stylish')
      },
      all: {
        src: watchFiles.clientJS.concat(watchFiles.serverJS),
        options: {
          jshintrc: true
        }
      }
    },
    csslint: {
    	options: {
    		csslintrc: '.csslintrc',
    	},
    	all: {
    		src: watchFiles.clientCSS
    	}
    },
    uglify: {
    	production: {
    		options: {
    			mangle: false
    		},
    		files: {
    			'public/dist/application.min.js': 'public/dist/application.js'
    		}
    	}
    },
    cssmin: {
    	combine: {
    		files: {
    			'public/dist/application.min.css': '<%= applicationCSSFiles %>',
    			'public/lib/bootstrap/dist/bootstrap.min.css': 'public/lib/bootstrap/dist/css/bootstrap.css'
    		}
    	}
    },*/

    mochaTest: {
      src: watchFiles.mochaTests,
      options: {
        reporter: 'spec',
        require: 'server.js'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    less: {
      development: {
        options: {
          paths: ['public/lib/bootstrap']
        },
        files: {
          'public/lib/bootstrap/dist/css/bootstrap.css': 'public/lib/bootstrap/less/bootstrap.less'
        }
      }
    },
    mongobackup: {
      options: {
        host: 'localhost',
        port: '27017',
        db: 'thal-dev',
        dump: {
          out: './dump',
        },
        restore: {
          path: './dump/thal-dev',
          drop: true
        }
      }
    },
    sass: { // Task
      dist: {
        files: { // Dictionary of files
          'css/style.css': 'css/sass/style.scss',
          'css/bootstrap.css':'css/sass/bootstrap/bootstrap.scss',
          'css/test.css':'css/sass/test.scss' // 'destination': 'source'
        }
      }
    }

  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt);

  // Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  // A Task for loading the configuration object
  grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
    var init = require('./config/init')();
    var config = require('./config/config');

    grunt.config.set('applicationJavaScriptFiles', config.assets.js);
    grunt.config.set('applicationCSSFiles', config.assets.css);
  });

  // Default task(s).
  grunt.registerTask('default', [ 'sass']);

  // Debug task.
  grunt.registerTask('debug', ['lint', 'concurrent:debug']);

  // Secure task(s).
  grunt.registerTask('secure', ['env:secure', 'lint', 'concurrent:default']);

  // Lint task(s).
  grunt.registerTask('lint', ['jshint', 'csslint']);

  // Build task(s).
  //	grunt.registerTask('build', ['lint', 'loadConfig', 'ngAnnotate', 'uglify', 'cssmin','csslint','less']);
  grunt.registerTask('build', ['loadConfig', 'ngAnnotate', 'uglify', 'cssmin', 'less']);

  // Test task.
  grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
  grunt.loadNpmTasks('grunt-mongo-backup');
  grunt.loadNpmTasks('grunt-contrib-sass');

};
