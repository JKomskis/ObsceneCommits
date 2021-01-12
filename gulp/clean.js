const del = require('del');
const paths = require('./paths');

function clean() {
    // delete the contents of the build folder but not the folder itself
    return del([`${paths.dest}/**`, `!${paths.dest}`], { force: true });
}

exports.clean = clean;