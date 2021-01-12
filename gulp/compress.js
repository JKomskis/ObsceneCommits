const { src, dest } = require('gulp');
const gulpBrotli = require('gulp-brotli');
const zlib = require('zlib');

function compressBrotli() {
    return src('_site/**/*.{html,css,js,svg}')
        .pipe(gulpBrotli({
            params: {
                [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
            },
        }))
        .pipe(dest('dist'));
}

exports.compress = compressBrotli;