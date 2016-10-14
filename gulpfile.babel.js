import autoprefixer from 'gulp-autoprefixer';
import babelRegister from 'babel-register';
import babelify from 'babelify';
import browserify from 'browserify';
import browserifyShim from 'browserify-shim';
import compileHandlebars from 'gulp-compile-handlebars';
import concat from 'gulp-concat';
import connect from 'connect';
import connectLivereload from 'connect-livereload';
import csso from 'gulp-csso';
import del from 'del';
import domain from 'domain';
import eslint from 'gulp-eslint';
import { existsSync, readFileSync } from 'fs';
import flatten from 'gulp-flatten';
import filter from 'gulp-filter';
import gif from 'gulp-if';
import gulp from 'gulp';
import gutil from 'gulp-util';
import hbsfy from 'hbsfy';
import http from 'http';
/*
    We need to import in that way, because there's bug in isparta.
    See: https://github.com/douglasduteil/isparta/pull/60
*/
import { Instrumenter } from 'isparta';
import istanbul from 'gulp-istanbul';
import livereload from 'gulp-livereload';
import minifyHtml from 'gulp-minify-html';
import mocha from 'gulp-mocha';
import opn from 'opn';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import sequence from 'run-sequence';
import serveStatic from 'serve-static';
import serveIndex from 'serve-index';
import size from 'gulp-size';
import tap from 'gulp-tap';
import useref from 'gulp-useref';

const SETTINGS_PATH = './settings.json';
const settings = existsSync(SETTINGS_PATH) ?
  JSON.parse(readFileSync(SETTINGS_PATH, 'utf-8')) : {};

const DEFAULT_SETTINGS = {
  googleApiKey: 'You need to specify Google API Key'
};

/* Default task */
gulp.task('default', function() {
  gulp.start('build');
});


/* Removing whole ./dist directory */
gulp.task('clean', del.bind(null, './dist'));


/* Building HTML */
gulp.task('html', function() {
  const assets = useref.assets({searchPath: '{src}'});
  return gulp.src('./src/*.html')
    .pipe(compileHandlebars(Object.assign({}, DEFAULT_SETTINGS, settings)))
    .pipe(assets)
    .pipe(gif('*.css', csso()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gif('*.html', minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('./dist'));
});
/* End of building HTML */


/* Building JS */
gulp.task('js', function() {
  return gulp.src('./src/js/main.js')
    .pipe(plumber())
    .pipe(tap(function(file) {
      const dom = domain.create();
      dom.on('error', function(err) {
        gutil.log(
          gutil.colors.red('Browserify compile error:'),
          err.message, '\n\t',
          gutil.colors.cyan('in file'), file.path
        );
        gutil.beep();
      });
      dom.run(function() {
        file.contents = browserify({
          entries: [file.path],
          debug: true,
          standalone: 'Planting',
          transform: [hbsfy, babelify.configure({
            ignore: /src\/vendor/,
          }), browserifyShim],
        }).bundle();
      });
    }))
    .pipe(gulp.dest('./dist/js/'));
});
/* End of building JS */


/* Building CSS */
gulp.task('css:main', function() {
  return gulp.src('./src/styles/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({browsers: ['last 1 version']}))
    .pipe(gulp.dest('./dist/styles'));
});

gulp.task('css:vendor', function() {
  return gulp.src([
    './node_modules/jquery-ui/themes/base/jquery-ui.css',
    './node_modules/jquery-ui/themes/base/jquery.ui.dialog.css',
  ])
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./dist/styles/'));
});

gulp.task('css', ['css:vendor', 'css:main']);
/* End of building CSS */


/* Building fonts */
gulp.task('fonts', function() {
  return gulp.src('./src/fonts/**/*')
    .pipe(filter('**/*.{eot,svg,ttf,woff}'))
    .pipe(flatten())
    .pipe(gulp.dest('./dist/fonts'));
});
/* End of building fonts */


/* Building extras */
gulp.task('extras', function() {
  gulp.src('./src/objects/**/*').pipe(gulp.dest('./dist/objects'));
  return gulp.src([
    './src/*.*',
    '!./src/*.html',
  ], {
    dot: true,
  }).pipe(gulp.dest('./dist'));
});
/* End of building extras */


/* Building whole library */
gulp.task('build', function(cb) {
  return sequence(
    'clean',
    ['html', 'js', 'css', 'fonts', 'extras'],
    'buildsize',
    cb
  );
});
/* End of building whole library */


/* Showing size of build */
gulp.task('buildsize', function() {
  return gulp.src('./dist/**/*').pipe(size({title: 'build', gzip: true}));
});


/* Serving assets using development webserver */
gulp.task('connect', function() {
  const app = connect()
    .use(connectLivereload({port: 35729}))
    .use(serveStatic('./dist'))
    .use(serveStatic('./src'))
    .use('/node_modules', serveStatic('./node_modules'))
    .use(serveIndex('./src'));

  http.createServer(app)
    .listen(9000)
    .on('listening', function() {
      console.log('Started connect web server on http://localhost:9000');
    });
});
/* End of serving assets using development webserver */


/* Watching for changes in sources */
gulp.task('watch', function() {
  livereload.listen();
  return gulp.watch('./src/**/*', ['reserve']);
});
/* End of watching for changes in sources */


/* Opening browser pointing to library */
gulp.task('openbrowser:planting', function() {
  opn('http://localhost:9000/planting.html');
});

gulp.task('openbrowser:campaign', function() {
  opn('http://localhost:9000/campaign.html');
});

gulp.task('openbrowser:viewer', function() {
  opn('http://localhost:9000/viewer.html');
});

/* Refreshing opened browser with new code */
gulp.task('refreshbrowser', function() { return livereload.changed(); });

/* Continous serving new version of library with watching for changes */
gulp.task('serve:planting', function(cb) {
  return sequence('build', 'connect', 'watch', 'openbrowser:planting', cb);
});

gulp.task('serve:campaign', function(cb) {
  return sequence('build', 'connect', 'watch', 'openbrowser:campaign', cb);
});

gulp.task('serve:viewer', function(cb) {
  return sequence('build', 'connect', 'watch', 'openbrowser:viewer', cb);
});

gulp.task('serve', function(cb) {
  return sequence('build', 'connect', 'watch', ['openbrowser:planting',
    'openbrowser:campaign', 'openbrowser:viewer'], cb);
});

gulp.task('reserve', function(cb) {
  return sequence('build', 'refreshbrowser', cb);
});

/* Running ESLint on source */
gulp.task('lint', function() {
  return gulp.src(['./src/js/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
/* End of running ESLint on source */


/* Running unittests with coverage */
gulp.task('test:setup', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(istanbul({instrumenter: Instrumenter, includeUntested: true}))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['test:setup'], function() {
  return gulp.src(['test/*.js', '!test/env'])
    .pipe(mocha({compilers: {js: babelRegister}}))
    .pipe(istanbul.writeReports());
});
/* End of running unittests with coverage */
