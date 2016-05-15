module.exports = function(config) {
  config.set({
    logLevel: "warn",
    singleRun: (process.env.NODE_ENV === "production"),
    frameworks: [
      "browserify",
      "mocha",
      "sinon",
      "sinon-chai",
      "chai-immutable",
      "chai",
    ],
    browsers: [ "PhantomJS" ],
    files: [ "test/**/*.spec.ts" ],
    preprocessors: { "test/**/*.ts": [ "browserify", "coverage" ] },
    reporters: [ "progress", "coverage" ],
    browserify: {
      debug: true,
      plugin: [ require("tsify") ],
      transform: [
        require("browserify-istanbul"),
      ]
    },
    coverageReporter: {
      dir: "coverage",
      reporters: [
        { type: "text-summary" },
        { type: "lcovonly", subdir: ".", file: "lcov" },
        { type: "json", subdir: ".", file: "coverage.json" },
      ],
    }
  });
};
