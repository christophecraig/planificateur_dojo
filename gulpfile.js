// grab our gulp packages
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    csso = require('gulp-csso');

// Watches every .scss file in public/sass/
gulp.task('default', function () {
    return gulp.watch('source/sass/**/*.scss', ['scss-compile'])
})

// Compiles scss files in public/sass/
gulp.task('scss-compile', function () {
    return gulp.src('source/sass/**/*.scss').pipe(sass()).pipe(csso({
        restructure: false
    })).pipe(gulp.dest('public/css'))
})