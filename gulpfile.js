// grab our gulp packages
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    csso = require('gulp-csso'),
    sassImportOnce = require('gulp-sass-import-once');


// Watches every .scss file in public/sass/
gulp.task('default', function () {
    return gulp.watch('source/sass/**/*.scss', ['scss-compile'])
})

// Compiles scss files in public/sass/
gulp.task('scss-compile', function () {
    return gulp.src('source/sass/style.scss').pipe(sass()).pipe(gulp.dest('public/css'))
})