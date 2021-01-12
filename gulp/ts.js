const { src, dest, series } = require('gulp');
const rollup = require('@rollup/stream');
const replace = require('@rollup/plugin-replace');
const rollupTypescript = require('@rollup/plugin-typescript');
const nodeResolve = require('@rollup/plugin-node-resolve');
const filesize = require('rollup-plugin-filesize');
const alias = require('@rollup/plugin-alias');
const commonjs = require('@rollup/plugin-commonjs');
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const eslint = require('gulp-eslint');
const paths = require('./paths');

function lintTs() {
    return src(paths.ts.src)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

// declare the cache variable outside of task scopes
let cache;

function compileTs() {
    return rollup({
        input: './web/ts/main.ts',
        output: {
            sourcemap: true,
            format: 'es'
        },
        plugins: [
            rollupTypescript(),
            nodeResolve.nodeResolve({ browser: true }),
            commonjs({
                include: '**'
            }),
            filesize(),
        ],
        cache: cache
    })
        .on('bundle', (bundle) => {
            // update the cache after every new bundle is created
            cache = bundle;
        })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(terser({
            compress: {
                ecma: 2015
            },
            output: {
                ecma: 2015
            },
            module: true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.ts.dest));
}

exports.ts = series(lintTs, compileTs);
exports.lintTs = lintTs