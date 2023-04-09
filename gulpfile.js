const gulp = require('gulp');
const inlinesource = require('gulp-inline-source');
const replace = require('gulp-replace');
 
gulp.task('default', () => {
  return gulp
    .src('./build/*.html')
    .pipe(replace('.js"></script>', '.js" inline></script>'))
    .pipe(replace('rel="stylesheet">', 'rel="stylesheet" inline>'))
    // .pipe(replace('<div id="root"></div>', '<div id="root"></div><!-- NPF_CONFIG_INSERTION_START -->')) // In order to avoid ejecting the app, more convenient to place it here
    .pipe(
      inlinesource({
        compress: false,
        ignore: ['png'],
      })
    )
    .pipe(gulp.dest('./build'));
});