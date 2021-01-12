module.exports = {
    src: "./web",
    dest: "./_site",
    html: {
        src: './web/**/*.html',
        dest: './_site'
    },
    css: {
        src: './web/css/**/*.scss',
        dest: './_site/assets/css'
    },
    ts: {
        src: './web/ts/**/*.ts',
        dest: './_site/assets/js'
    },
    fonts: {
        base: './node_modules/@ibm/plex/',
        src: [
            './node_modules/@ibm/plex/IBM-Plex-{Mono,Sans}/fonts/complete/**/*.woff2',
            './node_modules/@ibm/plex/IBM-Plex-{Mono,Sans}/fonts/split/**/*Latin1.woff2',
        ],
        dest: './_site/assets/fonts/'
    },
    assets: {
        src: './web/assets/**/*',
        dest: './_site/assets'
    },
};
