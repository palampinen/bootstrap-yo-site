// Gulpfile adapted from https://github.com/kriasoft/spa-seed.front-end

// For more information on how to configure Gulp.js build system, please visit:
// https://github.com/gulpjs/gulp/blob/master/docs/API.md

'use strict';

var gulp = require('gulp');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var rimraf = require('rimraf');
var es = require('event-stream');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');

// A cache for Gulp tasks. It is used as a workaround for Gulp's dependency resolution
// limitations. It won't be needed anymore starting with Gulp 4.
var task = {};

// Clean up
gulp.task('clean', function (cb) {
    rimraf('./build', cb);
});

// Copy public/static files
gulp.task('public', task.public = function () {
    return gulp.src('./public/**/*.*')
               .pipe(gulp.dest('./build'))
               .pipe(livereload());
});
gulp.task('public-clean', ['clean'], task.public);

// CSS stylesheets
gulp.task('styles', task.styles = function () {
    return gulp.src('./src/app.scss')
               .pipe(sass())
               .pipe(gulp.dest('./build'))
               .pipe(livereload());
});
gulp.task('styles-clean', ['clean'], task.styles);

gulp.task('views', task.views = function () {
    return gulp.src('./src/**/*.html')
               .pipe(changed('./build'))
               .pipe(gulp.dest('./build'))
               .pipe(livereload());
});
gulp.task('views-clean', ['clean'], task.views);

// Build the app from source code
gulp.task('build', ['public-clean', 'views-clean', 'styles-clean']);

// Launch a lightweight HTTP Server
gulp.task('run', ['build'], function (next) {
    var url = require('url'),
        fileServer = require('ecstatic')({root: './', cache: 'no-cache', showDir: true}),
        port = 8000;
    require('http').createServer()
        .on('request', function (req, res) {
            // For non-existent files output the contents of /index.html page in order to make HTML5 routing work
            var urlPath = url.parse(req.url).pathname;
            if (urlPath === '/') {
                req.url = '/build/index.html';
            } else if (
                ['css', 'html', 'ico', 'scss', 'js', 'png', 'txt', 'xml'].indexOf(urlPath.split('.').pop()) == -1 &&
                ['bower_components', 'fonts', 'images', 'src', 'views'].indexOf(urlPath.split('/')[1]) == -1) {
                req.url = '/build/index.html';
            } else if (['src', 'bower_components'].indexOf(urlPath.split('/')[1]) == -1) {
                req.url = '/build' + req.url;
            }
            fileServer(req, res);
        })
        .listen(port, function () {
            gutil.log('Server is listening on ' + gutil.colors.magenta('http://localhost:' + port + '/'));
            next();
        });
});

// Watch for changes in source files
gulp.task('watch', ['run'], function () {
    livereload.listen();

    // Watch for changes in source files
    gulp.watch('./public/**', ['public']);
    gulp.watch('./src/**/*.html', ['views']);
    gulp.watch('./src/**/*.scss', ['styles']);

    // Watch for changes in 'compiled' files
    gulp.watch('./build/**', function (file) {});
});

// The default task
gulp.task('default', ['watch']);
