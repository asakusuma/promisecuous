var path = require('path');
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    includereplace: {
      amd: {
        src: 'promisecuous.js',
        dest: 'build',
        expand: true,
        cwd: 'source/'
      },
      global: {
        src: 'promisecuous-global.js',
        dest: 'build',
        expand: true,
        cwd: 'source/'
      },
      dist: {
        src: 'main.js',
        dest: '',
        expand: true,
        cwd: 'source/'
      }
    },
    jshint: {
      all: {
        files: {
          src: [
            './source/components/*.js'
          ]
        },
        jshintrc: './.jshintrc'
      }
    },
    shell: {
      test: {
        command: 'venus run -t testing/specs/ -n',
        options: {
          stdout: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-include-replace');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', [
    'jshint:all',
    'includereplace:amd',
    'includereplace:global',
    'includereplace:dist'
  ]);

  grunt.registerTask('test', ['shell:test']);
};