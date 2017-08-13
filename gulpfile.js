var 
  gulp         = require('gulp'),
  del          = require('del'),
  nodemon      = require('gulp-nodemon'),
  browserSync  = require('browser-sync').create(),
  reload       = browserSync.reload
;

// CLEAN
gulp.task('clean', function() {
  return del('dist');
});

// VIEWS
gulp.task('dev:views', function() {
  return gulp
    .src('src/views/**/*.ejs')
    //Process views
    .pipe(gulp.dest('dist/views'))
})
gulp.task('watch:views', function(done) {
  gulp.watch('src/views/**/*.ejs', gulp.series('dev:views'));
  done();
})

//STYLES
gulp.task('dev:styles', function() {
  return gulp
    .src('src/css/**/*.css')
    //Process styles
    .pipe(gulp.dest('dist/public/css'))
})
gulp.task('watch:styles', function(done) {
  gulp.watch('src/css/**/*.css', gulp.series('dev:styles'));
  done();
})

//SCRIPTS
gulp.task('dev:scripts', function() {
  return gulp
    .src('src/js/**/*.js')
    //Process Script
    .pipe(gulp.dest('dist/public/js'))
})
gulp.task('watch:scripts', function(done) {
  gulp.watch('src/js/**/*.js', gulp.series('dev:scripts'));
  done();
})

//SERVER
gulp.task('server', function (cb) {
  var called = false;
  return nodemon({
    script: 'app.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    console.log('restart')
     setTimeout(function () {
      reload({ stream: false })
    }, 1000) 
  })
});

// BROWSER-SYNC

function browserSyncInit(done) {
  browserSync.init({
    proxy: "localhost:5000",
    port: 3000, 
    files: [ 'dist/**/*.*' ],
    //browser: 'google chrome',
    notify: false
  })

  done();
}

gulp.task('browser-sync', browserSyncInit);

//DEV
gulp.task('dev', gulp.parallel('dev:styles', 'dev:scripts', 'dev:views'));

//WATCH
gulp.task('watch', gulp.parallel('watch:styles', 'watch:scripts', 'watch:views'));

//DEFAULT
gulp.task('default', gulp.series('clean', 'dev', 'server', gulp.parallel('watch','browser-sync')));

