/*global module:false, require:true, console:true */
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-dox');

  var banner = [
        '/*! <%= pkg.name %> - v<%= pkg.version %> - ',
        '<%= grunt.template.today("yyyy-mm-dd") %> - <%= pkg.homepage %> */\n'
      ].join('');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      standardTarget: {
        options: {
          banner: banner
        },
        src: [
          'src/intro.js',
          'src/template.js',
          'src/init.js',
          'src/outro.js'
        ],
        dest: 'dist/jquery.cubelet.js'
      }
    },
    uglify: {
      standardTarget: {
        files: {
          'dist/jquery.cubelet.min.js': ['dist/jquery.cubelet.js']
        }
      },
      options: {
        banner: banner
      }
    },
    jshint: {
      all_files: [
        'grunt.js',
        'src/!(intro|outro)*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    dox: {
      options: {
        title: 'jQuery Cubelet'
      },
      files: {
        src: [
          'src/init.js'
        ],
        dest: 'dist/doc'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit']);
  grunt.registerTask('build', [
      'concat:standardTarget',
      'uglify:standardTarget',
      'dox']);

};
