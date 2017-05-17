// Start with Gulp itself
var gulp         = require('gulp');

// Tiny parts of general functionality, added to gulp
var filter       = require('gulp-filter');
var sourcemaps   = require('gulp-sourcemaps');
var useref       = require('gulp-useref');
var sass         = require('gulp-sass');
var gulpif       = require('gulp-if');
var uglify       = require('gulp-uglify');
var cleanCSS     = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var jshint       = require('gulp-jshint');
var clean        = require('gulp-clean');
var runSequence  = require('run-sequence');

// Provide a browsersync session for hot reloading
var browserSync  = require('browser-sync').create();
var wiredep      = require('wiredep').stream;

// Setup Paths and Patterns
var develop      = './app/';
var serve        = './.tmp/';
var production   = './dist/';
var assets       = './assets/';

var paths = {
    develop: {
        html:    develop + '/**/*.html',
        static:  develop + assets + '/**/*',
        sass:    develop + assets + '/sass/**/*.scss',
        js:      develop + assets + '/js/**/*.js',
        modules: [
            develop + '/**/*.js',
            develop + '/**/*.json',
            '!' + develop + assets + '/js/**/*.js'
        ]
    },
    serve: {
        html:    serve + '/**/*.html',
        static:  serve + assets,
        sass:    serve + assets + '/css',
        js:      serve + assets + '/scripts'
    },
    dist: {
        html:   production + '/**/*.html',
        static: production + assets,
        sass:   production + assets + '/css',
        js:     production + assets + '/scripts',
    },
    bower: ['./bower_components','./bower_components/bootstrap-sass/assets/stylesheets']
};

var devAssets = [
    develop + '/**/*.*',
    '!' + paths.develop.js,
    '!' + paths.develop.sass,
    '!' + paths.develop.html,
    '!' + paths.develop.modules
];

// Other config variables used during development tasks
var config = {
    sass: {
        errLogToConsole: true,
        outputStyle: 'expanded',
        includePaths: paths.bower
    },
    autoprefixer: {
        browsers: [
            'last 2 versions',
            '> 5%',
            'Firefox ESR'
        ]
    },
    clean : {
        read: false,
        force: true
    }
}

// Static server
gulp.task('serve', ['dev-sass', 'dev-js', 'dev-html'], function() {
    browserSync.init({
        server: {
            baseDir: serve,
            routes: {
                "/bower_components": "bower_components"
            },
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        }
    });
});

gulp.task('watch', function() {

    gulp
        // Watch the html-files in app for changes,
        // and reload connected browsers when something happens
        .watch(paths.develop.html, ['dev-html','dev-sass'])
        .on('change', function(event){
            console.log('File ' + event.path + ' was ' + event.type + '.');
        });

    gulp
        // Watch the asset/scss folder for change,
        // and run sass task when something happens
        .watch(paths.develop.sass, ['dev-sass'])
        // When there is a change,
        // log a message in the console
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });

    gulp
        // Watch the asset/js folder for change,
        // and run js task when something happens
        .watch([paths.develop.js,paths.develop.modules], ['dev-js','dev-js:modules'])
        // When there is a change,
        // log a message in the console
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });

    gulp
        // Watch for all other files,
        // and run copy-assets task when something happens
        .watch(devAssets, ['dev-copy-assets'])
        // When there is a change,
        // log a message in the console
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });

    return gulp;
});

// Use wiredep to implement used bower components (Experimental...)
gulp.task('bower', function () {
    return gulp
        .src(paths.develop.html)
        .pipe(wiredep())
        .pipe(gulp.dest(serve));
});

gulp.task('dev-clean', function(){
    return gulp
        .src(serve, config.clean)
        .pipe(clean());
});

gulp.task('dev-sass', function () {
    return gulp
        .src(paths.develop.sass)
        .pipe(sourcemaps.init())
        .pipe(sass(config.sass).on('error', sass.logError))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.serve.sass))
        .pipe(browserSync.stream())
        .resume();
});

gulp.task('dev-copy-assets', function(){
    gulp.src(devAssets)
        .pipe(gulp.dest(serve));
});

gulp.task('dev-js:modules', function() {
    return gulp
        .src(paths.develop.modules)
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(serve))
        .pipe(browserSync.stream());
});

gulp.task('dev-js', function() {
    return gulp
        .src(paths.develop.js)
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.serve.js))
        .pipe(browserSync.stream());
});

gulp.task('dev-html', function() {
    return gulp
        .src(paths.develop.html)
        .pipe(gulp.dest(serve))
        .pipe(browserSync.stream());
});

gulp.task('dist-clean', function(){
    return gulp
        .src(production, config.clean)
        .pipe(clean());
});

gulp.task('dist-sass', function () {
    return gulp
        .src(paths.develop.sass)
        .pipe(sass(config.sass).on('error', sass.logError))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(gulp.dest(paths.dist.sass));
});

gulp.task('dist-copy-assets', function(){
    gulp.src([
            paths.develop.static,
            '!' + paths.develop.sass,
            '!' + paths.develop.js,
            '!' + paths.develop.sass + '/**',
            '!' + paths.develop.js + '/**'
        ])
        .pipe(gulp.dest(production));
});

gulp.task('dist-html', function() {
    return gulp
        .src(paths.develop.html)
        .pipe(useref({ searchPath: serve }))
        .pipe(gulpif('*.css', cleanCSS()))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulp.dest(production));
});

// Tasks run in sequence when running 'gulp'
gulp.task('dist', (done)=>{
    runSequence(
        'dev-clean',
        'dev-copy-assets',
        'dev-sass',
        'dev-js',
        'dev-html',
        'dist-clean',
        'dist-copy-assets',
        'dist-html'
    );
    done();
});
gulp.task('development', (done)=>{
    runSequence(
        'dev-clean',
        'dev-copy-assets',
        'dev-sass',
        'dev-js',
        'dev-js:modules',
        'serve',
        'watch'
    );
    done();
});
gulp.task('dev-dry-run', (done)=>{
    runSequence(
        'dev-clean',
        'dev-copy-assets',
        'dev-sass',
        'dev-js',
        'dev-html'
    );
    done();
});
gulp.task('clean',       ['dev-clean','dist-clean']);
gulp.task('default',     ['development'] );
