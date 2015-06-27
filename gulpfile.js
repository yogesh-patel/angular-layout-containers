'use strict';
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var stripDebug = require('gulp-strip-debug');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var deploy = require('gulp-gh-pages');

// source directives
var srcJsFiles = 'src/**/*.js';

// lint source javascript files
gulp.task('lint', function() {
  return gulp.src(srcJsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// clean built copies of javascript files
// from dist folder and docs
gulp.task('clean', function() {
  return gulp.src(['dist', 'docs/lib'])
    .pipe(clean({force: true}));
});

// concatenate and minify source javascript files
// and copy into dist folder and docs
gulp.task('build-js', function() {
  return gulp.src([
     'src/directives/viewport.js',
    'src/directives/borderLayout.js',
    'src/directives/contentPanel.js'])
    .pipe(concat('angular-desktop-containers.js'))
    .pipe(gulp.dest('dist'))
    .pipe(gulp.dest('docs/lib'))
    .pipe(stripDebug())
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(rename('angular-desktop-containers.min.js'))
    .pipe(gulp.dest('dist'))
    .on('error', gutil.log);
});

gulp.task('copy-template-files', function () {
  gulp.src('src/directives/templates/**/*.html')
      .pipe(gulp.dest('dist/templates/'))
      .pipe(gulp.dest('docs/lib/templates'));
});

gulp.task('copy-style-files', function () {
  gulp.src('src/style/**/*.css')
      .pipe(gulp.dest('dist/style/'))
      .pipe(gulp.dest('docs/lib/style'));
});

gulp.task('copy-jquery-files', function () {
  gulp.src('bower_components/jquery/dist/jquery.min.js')
      .pipe(gulp.dest('docs/lib/jquery'));
});

gulp.task('copy-angular-files', function () {
  gulp.src('bower_components/angular/angular.min.js')
      .pipe(gulp.dest('docs/lib/angular'));
});

gulp.task('copy-materialize-files', function () {
  gulp.src('bower_components/materialize/dist/css/*.css')
      .pipe(gulp.dest('docs/lib/materialize/css'));
  gulp.src('bower_components/materialize/dist/font/**/*.*')
      .pipe(gulp.dest('docs/lib/materialize/font'));
  gulp.src('bower_components/materialize/dist/js/*.js')
      .pipe(gulp.dest('docs/lib/materialize/js'));
});

// lint then clean and build javascript
gulp.task('build', function(callback) {
  runSequence('lint', 'clean', 'build-js','copy-template-files','copy-style-files', callback);
});

// lint then clean and build javascript
gulp.task('build-example', function(callback) {
  runSequence('lint', 'clean', 'build-js','copy-template-files','copy-style-files', 'copy-jquery-files','copy-materialize-files','copy-angular-files',callback);
});



// serve docs on local web server
// and reload anytime source code or docs are modified
gulp.task('serve', ['build-example'], function() {
  browserSync({
    server: {
      baseDir: ['docs', 'test']
    },
    open: true,
    port: 9002,
    notify: false
  });

  gulp.watch([srcJsFiles,'./docs/**.*.html', './docs/app/**/*.js', './docs/styles/*.css'], ['build-example', browserSync.reload ]);
});

// deploy to github pages
gulp.task('deploy', ['build'], function () {
  return gulp.src('./docs/**/*')
    .pipe(deploy());
});

// deploy to Yogesh's github pages
gulp.task('deploy-prod', ['build-example'], function () {
  return gulp.src('./docs/**/*')
    .pipe(deploy({
      remoteUrl: 'https://github.com/yogesh-patel/angular-desktop-containers.git'
    }));
});

// Default Task
gulp.task('default', ['serve']);
