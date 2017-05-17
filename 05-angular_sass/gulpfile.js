// Start with Gulp itself
var gulp         = require('gulp');

// Tiny parts of general functionality, added to gulp
var clean        = require('gulp-clean');
var sourcemaps   = require('gulp-sourcemaps');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

// Other config variables used during development tasks
var config = {
    sass: {
        errLogToConsole: true,
        outputStyle: 'expanded'
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

gulp.task('clean', function(){
    return gulp
        .src('./css/style.css', config.clean)
        .pipe(clean());
});

gulp.task('sass', ['clean'], function () {
    return gulp
        .src('./sass/global.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(config.sass).on('error', sass.logError))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css/'))
        .resume();
});

gulp.task('default', ['sass'] );
