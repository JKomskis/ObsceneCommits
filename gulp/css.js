const { series, src, dest } = require('gulp');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const Fiber = require('fibers');
sass.compiler = require('sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const gulpStylelint = require('gulp-stylelint');
const paths = require('./paths');


function lintCss() {
    return src(paths.css.src)
        .pipe(gulpStylelint({
            reporters: [
                { formatter: 'string', console: true }
            ]
        }))
}

function compileCss() {
    const postCssPlugins = [
        autoprefixer()
    ];
    return src(paths.css.src)
        .pipe(sourcemaps.init())
        .pipe(sass({ fiber: Fiber }).on('error', sass.logError))
        .pipe(postcss(postCssPlugins))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.css.dest));
}

function minifyCss() {
    // minify .css files, but not .min.css files
    return src([`${paths.css.dest}/**/*.css`, `!${paths.css.dest}/**/*.min.css`])
        .pipe(sourcemaps.init())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(postcss([
            cssnano()
        ]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.css.dest));
}

exports.css = series(lintCss, compileCss, minifyCss);
exports.lintCss = lintCss;