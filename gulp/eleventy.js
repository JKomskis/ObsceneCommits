var spawn = require('child_process').spawn;

function buildEleventy(done) {
    const buildProc = spawn('npx', ['eleventy'], { stdio: 'inherit' });
    buildProc.on('exit', function (code) {
        done(code);
    });
}

function watchEleventy(done) {
    const watchProc = spawn('npx', ['eleventy', '--watch'], { stdio: 'inherit' });
    watchProc.on('exit', function (code) {
        done(code);
    });
}

exports.eleventy = buildEleventy;
exports.watch = watchEleventy;