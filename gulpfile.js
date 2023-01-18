'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');

gulp.task('buildStyles', () => {
  return gulp.src('./src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('icons', () => {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest('./dist/assets/webfonts/'));
});
 
gulp.task('minify-css', () => {
  return gulp.src('./dist/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', () => {
  gulp.watch('./src/scss/**/*.scss', (done) => {
      gulp.series(['buildStyles', 'minify-css'])(done);
  });
});
