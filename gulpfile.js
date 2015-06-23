var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cssMin = require('gulp-cssmin');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var rename = require('gulp-rename');

// We store the files we want to watch in an object for easy reference
var paths = {
  scripts: [
    './client/lib/angular/angular.min.js',
    './client/lib/angular-route/angular-route.min.js',
    './client/app/home/home.js',
    './client/app/grid/grid.js',
    './client/app/deck/deck.js',
    './client/app/meeple/meeple.js',
    './client/app/app.js'
  ],
  stylesheets: [
    './client/assets/css/grid-reset.css',
    './client/assets/css/grid.css',
    './client/assets/css/deck.css',
    './client/assets/css/meeple.css',
    './client/assets/css/home.css'
  ],
  sass: [
    './client/assets/sass/*.scss'
  ]
};

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(concat('main.js'))
    .pipe(sourcemaps.write())
    // Output to app/dist
    // TODO: UGLIFY AND RENAME FILE FOR MINIFY VERSION
    .pipe(gulp.dest('./client/app/dist'));
});

gulp.task('stylesheets', function() {
  return gulp.src(paths.sass)
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./client/assets/css'))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./client/assets/dist'))
          .pipe(cssMin())
          .pipe(rename('main.min.css'))
          .pipe(sourcemaps.write())
          .pipe(gulp.dest('./client/assets/dist'));
});

gulp.task('test', function() {
  return gulp.src([
    './client/app/**/*.js',
    './server/**/*.js'
  ]).pipe(jshint())
    .pipe(jshint.reporter('default'));
});


gulp.task('deploy', function() {
  // TODO
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.sass, ['stylesheets']);
});

gulp.task('develop', function() {
  nodemon({
    script: 'app.js',
    ext: 'html js css scss',
    tasks: ['scripts', 'stylesheets']
  }).on('restart', function() {
    console.log('restarted nodemon');
  });
});

gulp.task('default', ['develop', 'watch']);