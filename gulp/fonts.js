const { src, dest } = require('gulp');
const paths = require('./paths');

function fonts() {
    return src(paths.fonts.src, { base: paths.fonts.base })
        .pipe(dest(paths.fonts.dest));
}

exports.fonts = fonts;