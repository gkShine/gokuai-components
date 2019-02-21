'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var imagemin = require('gulp-imagemin');

gulp.task('compile', function() {
  return gulp.src('./src/*.scss')
    .pipe(sass.sync())
    .pipe(autoprefixer({
      browsers: ['ie > 9', 'last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(gulp.dest('./lib'));
});

gulp.task('copyfont', function() {
  return gulp.src('./src/fonts/**')
    .pipe(cssmin())
    .pipe(gulp.dest('./lib/fonts'));
});

gulp.task('copyicon', function() {
  return gulp.src('./src/icons/**')
    .pipe(imagemin())
    .pipe(gulp.dest('./lib/icons'));
});

gulp.task('copyimage', function() {
  return gulp.src('./src/images/**')
    .pipe(imagemin())
    .pipe(gulp.dest('./lib/images'));
});

gulp.task('build', ['compile', 'copyfont', 'copyicon', 'copyimage']);