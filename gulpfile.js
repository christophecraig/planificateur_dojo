// grab our gulp packages
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    csso = require('gulp-csso'),
    sassImportOnce = require('gulp-sass-import-once'),
    Confirm = require('prompt-confirm'),
    prompt = new Confirm('material too ?');

// Watches every .scss file in public/sass/
gulp.task('default', function () {
    prompt.run()
    .then(function(answer) {
        if (answer) {
            return gulp.watch('source/sass/**/*.scss', ['scss-compile', 'material-sass-compile'])
        } else {
            return gulp.watch('source/sass/**/*.scss', ['scss-compile'])
        }
    })
})

// Compiles scss files in public/sass/
gulp.task('scss-compile', function () {
    return gulp.src('source/sass/style.scss').pipe(sass()).pipe(gulp.dest('public/css'))
})

gulp.task('material-sass-compile', function() {
    return gulp.src('source/sass/material/material.scss').pipe(sass()).pipe(gulp.dest('public/css'))
})