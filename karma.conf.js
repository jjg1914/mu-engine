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
    preprocessors: { "test/**/*.ts": [ "browserify" ] },
    reporters: [ "progress" ],
    browserify: {
      debug: true,
      plugin: [ require("tsify") ],
    }
  });
};
