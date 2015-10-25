import autoprefixer from 'gulp-autoprefixer';
import babel from 'babel-core/register';
import babelify from 'babelify';
import browserify from 'browserify';
import cache from 'gulp-cache';
import csso from 'gulp-csso';
import concat from 'gulp-concat';
import del from 'del';
import eslint from 'gulp-eslint';
import flatten from 'gulp-flatten';
import filter from 'gulp-filter';
import gif from 'gulp-if';
import gulp from 'gulp';
import gutil from 'gulp-util';
import imagemin from 'gulp-imagemin';
/*
    We need to import in that way, because there's bug in isparta.
    See: https://github.com/douglasduteil/isparta/pull/60
*/
import { Instrumenter } from 'isparta';
import istanbul  from 'gulp-istanbul';
import livereload from 'gulp-livereload';
import minifyHtml from 'gulp-minify-html';
import mocha from 'gulp-mocha';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import sequence from 'run-sequence';
import size from 'gulp-size';
import tap from 'gulp-tap';
import useref from 'gulp-useref';


/* Default task */
gulp.task('default', function () {
    gulp.start('build');
});


/* Removing whole ./dist directory */
gulp.task('clean', del.bind(null, './dist'));


/* Building HTML */
gulp.task('html', function () {
    var assets = useref.assets({searchPath: '{src}'});
    return gulp.src('./src/*.html')
        .pipe(assets)
        .pipe(gif('*.css', csso()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gif('*.html', minifyHtml({conditionals: true, loose: true})))
        .pipe(gulp.dest('./dist'));
});
/* End of building HTML */


/* Building JS */
gulp.task('js', function () {
    return gulp.src('./src/js/main.js')
        .pipe(plumber())
        .pipe(tap(function(file) {
            var d = require('domain').create();
            d.on('error', function(err) {
                gutil.log(
                    gutil.colors.red("Browserify compile error:"),
                    err.message, "\n\t",
                    gutil.colors.cyan("in file"), file.path
                );
                gutil.beep();
            });
            d.run(function () {
                file.contents = browserify({
                    entries: [file.path],
                    debug: true,
                    standalone: 'Planting',
                    paths: ['./node_modules','./src/js/'],
                    transform: [babelify]
                }).bundle();
            });
        }))
        .pipe(gulp.dest('./dist/js/'));
});
/* End of building JS */


/* Building CSS */
gulp.task('css:main', function () {
    return gulp.src('./src/styles/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({browsers: ['last 1 version']}))
        .pipe(gulp.dest('./dist/styles'));
});

gulp.task('css:vendor', function () {
    return gulp.src([
        './node_modules/jquery-ui/themes/base/jquery-ui.css',
        './node_modules/jquery-ui/themes/base/jquery.ui.dialog.css'
        ])
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('./dist/styles/'));
});

gulp.task('css', ['css:vendor', 'css:main']);
/* End of building CSS */


/* Building fonts */
gulp.task('fonts', function () {
    return gulp.src('./src/fonts/**/*')
        .pipe(filter('**/*.{eot,svg,ttf,woff}'))
        .pipe(flatten())
        .pipe(gulp.dest('./dist/fonts'));
});
/* End of building fonts */


/* Building extras */
gulp.task('extras', function () {
    gulp.src('./src/objects/**/*').pipe(gulp.dest('./dist/objects'));
    return gulp.src([
        './src/*.*',
        '!./src/*.html'
    ], {
        dot: true
    }).pipe(gulp.dest('./dist'));
});
/* End of building extras */


/* Building whole library */
gulp.task('build', function () {
    return sequence(
        'clean',
        ['html', 'js', 'css', 'fonts', 'extras'],
        'buildsize'
    )
});
/* End of building whole library */


/* Showing size of build */
gulp.task('buildsize', function () {
    return gulp.src('./dist/**/*').pipe(size({title: 'build', gzip: true}));
});


/* Running ESLint on source */
gulp.task('lint', function() {
    return gulp.src(['./src/js/**/*.js'])
    .pipe(eslint({
        ecmaFeatures: {modules: true},
        env: {
            es6: true,
            browser: true,
            node: true
        },
        parser: 'babel-eslint',
        rules: {
            "no-debugger": 2
        }
    }))
    .pipe(eslint.format());
});
/* End of running ESLint on source */


/* Running unittests with coverage */
gulp.task('test:setup', function () {
    return gulp.src(['src/**/*.js'])
    .pipe(istanbul({instrumenter: Instrumenter, includeUntested: true}))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['test:setup'], function () {
    return gulp.src(['test/*.js'])
    .pipe(mocha({compilers: {js: babel}}))
    .pipe(istanbul.writeReports());
});
/* End of running unittests with coverage */



gulp.task('connect', function () {
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var app = require('connect')()
        .use(require('connect-livereload')({port: 35729}))
        .use(serveStatic('dist'))
        .use(serveStatic('src'))
        .use('/node_modules', serveStatic('node_modules'))
        .use(serveIndex('src'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['build', 'connect', 'watch'], function () {
    require('opn')('http://localhost:9000');
});


gulp.task('watch', ['css:main', 'connect'], function () {
    livereload.listen();

    // watch for changes
    gulp.watch([
        'dist/**/*.js',
        'dist/**/*.css',
        'src/images/**/*',
        'src/objects/**/*',
    ]).on('change', livereload.changed);

    gulp.watch('src/**/*.js', ['js']);
    gulp.watch('src/styles/**/*.scss', ['css:main']);
});




