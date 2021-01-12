const { src, dest, series } = require('gulp');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const { readFileSync } = require('fs');
const revdel = require('gulp-rev-delete-original');
const del = require('del');
const paths = require('./paths');

function revision() {
    return src(`${paths.assets.dest}/**/*.{css,js,woff,woff2,jpg,png,svg}`)
        .pipe(rev())
        .pipe(revdel())
        .pipe(dest(paths.assets.dest))
        .pipe(rev.manifest())
        .pipe(dest(paths.assets.dest));
}

function rewrite() {
    const manifest = readFileSync(`${paths.assets.dest}/rev-manifest.json`);

    return src(`${paths.dest}/**/*.{html,css}`)
        .pipe(revRewrite({ manifest }))
        .pipe(dest(paths.dest));
}

function removeManifest() {
    return del([`${paths.assets.dest}/rev-manifest.json`], { force: true });
}

exports.rev = series(revision, rewrite, removeManifest);