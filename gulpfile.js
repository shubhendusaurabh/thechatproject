var gulp = require('gulp');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var nodemon = require('gulp-nodemon');
var nib = require('nib');

gulp.task('css', function() {
  return gulp.src('public/css/*.styl')
          .pipe(stylus({ use: nib(), whitespace: true }))
          .pipe(gulp.dest('public/css/'))
});

gulp.task('nodemon', function(cb) {
  var started = false;
  return nodemon({
    script: 'index.js'
  }).on('start', function() {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('watch', function() {
  gulp.watch('public/css/*.styl', ['css']);
  gulp.watch('*.js', ['nodemon'])
});

gulp.task('default', ['css', 'nodemon', 'watch']);
