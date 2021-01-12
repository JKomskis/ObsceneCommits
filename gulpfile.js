const { series, parallel } = require('gulp');
const { assets } = require('./gulp/assets');
const { clean } = require('./gulp/clean');
const { css, lintCss } = require('./gulp/css');
const { eleventy } = require('./gulp/eleventy');
const { fonts } = require('./gulp/fonts');
const { rev } = require('./gulp/rev');
const { serve } = require('./gulp/serve');
const { minifyHtml } = require('./gulp/html');
const { lintTs, ts } = require('./gulp/ts');

exports.clean = clean;

exports.lint = parallel(
    lintCss,
    lintTs
);

exports.build = series(
    clean,
    parallel(assets, css, fonts, eleventy, ts)
);

exports.serve = series(exports.build, serve);

exports.buildProd = series(
    exports.build,
    rev,
    minifyHtml
);

exports.default = exports.build;