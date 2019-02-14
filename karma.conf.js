module.exports = function (config) {
    var options = {
        plugins: [
            "karma-browserify",
            "karma-chrome-launcher",
            "karma-firefox-launcher",
            "karma-ie-launcher",
            "karma-opera-launcher",
            "karma-phantomjs-launcher",
            "karma-mocha"
        ],
        frameworks: ["browserify", "mocha"],
        files: [
            "index.js",
            "lib/**/*.js",
            {pattern: "lib/**/!(*.js)", included: false},
            "test/**/*.js",
            {pattern: "test/**/!(*.js)", included: false}
        ],
        preprocessors: {
            "index.js": ["browserify"],
            "lib/**/*.js": ["browserify"],
            "test/**/*.js": ["browserify"]
        },
        client: {
            mocha: {
                reporter: "html",
                ui: "bdd"
            }
        },
        browserify: {
            debug: true
        },
        browsers: [
            "CH",
            "FF",
            "IE10",
            "IE11",
            "OP",
            "PH"
        ],
        customLaunchers: {
            CH: {
                base: "Chrome"
            },
            FF: {
                base: "Firefox"
            },
            IE10: {
                base: "IE",
                'x-ua-compatible': 'IE=EmulateIE10',
                flags: ["-extoff"] // Win7 requires it
            },
            IE11: {
                base: "IE",
                'x-ua-compatible': 'IE=EmulateIE11',
                flags: ["-extoff"] // Win7 requires it
            },
            OP: {
                base: "Opera",
                flags: ["--ran-launcher"] // Win7 requires it
            },
            PH: {
                base: "PhantomJS"
            }
        },
        reporters: ["progress"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        captureTimeout: 15000,
        singleRun: true
    };

    if (process.env.TRAVIS) {
        options.customLaunchers.CH.flags = ['--no-sandbox']; // Travis requires it, but would create debug.log on Win7
        options.browsers = [
            "CH",
            "FF",
            //"IE10", // not supported by Travis
            //"IE11", // not supported by Travis
            //"OP", // not supported by Travis
            "PH"
        ];
    }

    config.set(options);
};