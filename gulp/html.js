const { src, dest } = require('gulp');
const htmlmin = require('gulp-htmlmin');
const paths = require('./paths');

function minifyHtml() {
    return src(`${paths.dest}/**/*.html`)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest(paths.dest));
}

exports.minifyHtml = minifyHtml;