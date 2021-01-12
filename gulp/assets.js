const { src, dest } = require('gulp');
const paths = require('./paths');

function assets() {
    return src(paths.assets.src, { base: paths.assets.base })
        .pipe(dest(paths.assets.dest));
}

exports.assets = assets;