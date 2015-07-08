var gulp = require('gulp');
var gulpif = require('gulp-if');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var stringify = require('stringify');
var changed = require('gulp-changed');
var browserSync = require('browser-sync').create();
var src = "./src";
var dest = "./build"
var env = process.argv.slice()[2];
gulp.task('clean', function() {
    del(dest + '/*');
});
gulp.task('html', function() {
    return gulp.src(src + '/*.html').pipe(changed(dest + '/')).pipe(gulp.dest(dest + '/'));
});
gulp.task('img', function() {
    return gulp.src(src + '/img/*').pipe(changed(dest + '/img/')).pipe(gulp.dest(dest + '/img'));
});
gulp.task('script', function() {
    var browserify_opt = {
        transform: [
            stringify({
                extensions: ['.html'],
                minify: true
            }), 'cssify'
        ],
        shim: {
            rt: {
                path: src + '/js/rt.js',
                exports: 'rt'
            }
        }
    };
    return gulp.src(src + '/js/main.js')
        .pipe(gulpif(env === "-r", sourcemaps.init()))
        //.pipe(jshint())
        //.pipe(jshint.reporter('default'))
        .pipe(browserify(browserify_opt))
        .pipe(gulpif(env === "-r", uglify()))
        .pipe(gulpif(env === "-r", sourcemaps.write('./')))
        .pipe(gulp.dest(dest + '/js'));
});
// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: true
        }
    });
});
gulp.task('watch-src', function() {
    gulp.watch(src + '/**/*', ['reload']);
});
gulp.task('reload', ['script', 'html', 'img'], function() {
    browserSync.reload();
});
gulp.task('default', ['browser-sync', 'clean', 'script', 'html', 'img', 'watch-src']);