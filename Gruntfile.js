/* jslint node: true */
"use strict";

module.exports = function (grunt) {

  grunt.initConfig({
    jshint: {
      files: ["Gruntfile.js", "app/js/*.js", "*.js"],
      options: {
        jshintrc: ".jshintrc"
      }
    },
    watch: {
      files: ["<%= jshint.files %>"],
      tasks: ["jshint"]
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["jshint"]);

  grunt.registerTask("test", ["jshint"]);

};