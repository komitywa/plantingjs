import babel from 'babel-core/register';
import babelify from 'babelify';
import browserify from 'browserify';
import concat from 'gulp-concat';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import gutil from 'gulp-util';
/*
    We need to import in that way, because there's bug in isparta.
    See: https://github.com/douglasduteil/isparta/pull/60
*/
import { Instrumenter } from 'isparta';
import istanbul  from 'gulp-istanbul';
import mocha from 'gulp-mocha';
import plumber from 'gulp-plumber';
import sequence from 'gulp-sequence';
import tap from 'gulp-tap';

// TODO: get rid off gulp-load-plugins as it doesn't work that well
var $ = require('gulp-load-plugins')();


gulp.task('sass', function() {
    return gulp.src('src/styles/**/*.scss')
        .pipe($.sass())
        .pipe($.autoprefixer({browsers: ['last 1 version']}))
        .pipe(gulp.dest('./dist/styles'));
});

gulp.task('browserify', function() {
    return gulp.src('./src/js/main.js')
        .pipe(plumber())
        .pipe(tap(function(file) {
            var d = require('domain').create();
            d.on('error', function(err) {
                gutil.log(gutil.colors.red("Browserify compile error:"), err.message, "\n\t", gutil.colors.cyan("in file"), file.path);
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

gulp.task('lint', function() {
    return gulp.src(['src/js/**/*.js'])
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

gulp.task('html', function () {
    var assets = $.useref.assets({searchPath: '{.tmp,src}'});

    return gulp.src('src/*.html')
        .pipe(assets)
        .pipe($.if('*.css', $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
    return gulp.src('src/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
    return gulp.src('src/fonts/**/*')
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
    gulp.src([
        'src/objects/**/*'
    ]).pipe(gulp.dest('dist/objects'));

    return gulp.src([
        'src/*.*',
        '!src/*.html',
        'node_modules/apache-server-configs/dist/.htaccess'
    ], {
        dot: true
    }).pipe(gulp.dest('dist'));
});

gulp.task('clean:tmp', require('del').bind(null, ['.tmp']));
gulp.task('clean:dist', require('del').bind(null, ['dist']));

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


gulp.task('watch', ['sass', 'connect'], function () {
    $.livereload.listen();

    // watch for changes
    gulp.watch([
        'dist/**/*.js',
        'dist/**/*.css',
        'src/images/**/*',
        'src/objects/**/*',
    ]).on('change', $.livereload.changed);

    gulp.watch('src/**/*.js', ['browserify']);
    gulp.watch('src/styles/**/*.scss', ['sass']);
});

gulp.task('css:vendor', function() {
    
    return gulp.src([
        './node_modules/jquery-ui/themes/base/jquery-ui.css',
        './node_modules/jquery-ui/themes/base/jquery.ui.dialog.css'
        ])
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('./dist/styles/'));
});

gulp.task('build', sequence(
    'clean:dist',
    ['html', 'images', 'fonts', 'extras', 'browserify', 'css:vendor', 'sass'],
    function () {
        return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
    }
));

gulp.task('default', ['clean:dist'], function () {
    gulp.start('build');
});



gulp.task('pre-test', function () {
  return gulp.src(['src/**/*.js'])
    // Covering files
    .pipe(istanbul({instrumenter: Instrumenter, includeUntested: true}))
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
  return gulp.src(['test/*.js'])
    .pipe(mocha({compilers: {js: babel}}))
    // Creating the reports after tests ran
    .pipe(istanbul.writeReports());
});
