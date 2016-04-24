var gulp = require("gulp");
var browserify = require('browserify');
var watchify = require('watchify');
var buffer = require("vinyl-buffer");
var source = require("vinyl-source-stream");
var sourcemaps = require("gulp-sourcemaps");
var nodemon = require("nodemon");

var b = watchify(browserify({
  entries: [ "src/index.js" ],
  cache: {},
  packageCache: {},
  debug: true,
}));

function bundle() {
  return b.bundle()
    .pipe(source("index.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("public"));
}

b.on("update", bundle)
b.on("log", function(str) {
  console.log(str);
});

gulp.task("build", bundle);

gulp.task("server", [ "build" ], function(done) {
  nodemon({
    script: "index.js",
    ext: "js",
    ignore: [ "node_modules/**/*", "public/**/*", "src/**/*", "gulpfile.js" ]
  }).on("quit", done);
});
