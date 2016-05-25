var path = require("path");
var gulp = require("gulp");
var nodemon = require("nodemon");
var sourcemaps = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var mustache = require("gulp-mustache");
var htmlmin = require("gulp-htmlmin");
var autoprefixer = require("gulp-autoprefixer");
var uglify = require("gulp-uglify");
var cssmin = require("gulp-cssmin");
var rename = require("gulp-rename");
var gulpIf = require("gulp-if");
var tslint = require("gulp-tslint");
var ghPages = require("gulp-gh-pages");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var lazypipe = require("lazypipe");
var browserify = require("browserify");
var watchify = require("watchify");
var tsify = require("tsify");
var del = require("del");
var karma = require("karma");

var b = browserify({
  entries: [ "./src/index.ts" ],
  debug: (process.env.NODE_ENV != "production"),
  cache: {},
  packageCache: {},
  plugin: [ tsify ],
});

if (process.env.NODE_ENV != "production") {
  b = watchify(b);
}

function bundle() {
  return b.bundle()
    .on("error", function(error) {
      console.log(error);
    })
    .pipe(source("index.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulpIf((process.env.NODE_ENV == "production"), lazypipe()
      .pipe(uglify)
      .pipe(rename, { suffix: ".min" })()))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("public"));
}

gulp.task("default", [ "server" ]);

gulp.task("server", [ "build" ], function(done) {
  nodemon({
    script: "index.js",
    ext: "js",
    ignore: [ "public/**/*" ]
  }).on("quit", done);
});

gulp.task("build", [ "js", "css", "html" ], function() {
  if (process.env.NODE_ENV != "production") {
    b.on("update", bundle);
    b.on("log", function(msg) { console.log(msg); });
    gulp.watch("src/**/*.scss", [ "css" ]);
    gulp.watch("src/**/*.html", [ "html" ]);
    gulp.watch("coverage/istanbul/coverage.json", [ "coverage" ]);
  }
});

gulp.task("js", bundle);

gulp.task("css", function() {
  return gulp.src("src/index.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(gulpIf((process.env.NODE_ENV === "production"), lazypipe()
      .pipe(cssmin)
      .pipe(rename, { suffix: ".min" })()))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("public"));
});

gulp.task("html", function() {
  return gulp.src("src/index.html")
    .pipe(mustache({
      production: (process.env.NODE_ENV === "production")
    }))
    .pipe(gulpIf((process.env.NODE_ENV === "production"), lazypipe()
      .pipe(htmlmin)()))
    .pipe(gulp.dest("public"));
});

gulp.task("test", function(done) {
  new karma.Server({
    configFile: path.join(__dirname, "karma.conf.js"),
  }).start();
});

gulp.task("lint", function() {
  return gulp.src("src/**/*.ts")
    .pipe(tslint())
    .pipe(tslint.report("verbose"));
});

gulp.task("deploy", function() {
  return gulp.src("public/**/*")
    .pipe(ghPages());
});

gulp.task("clean", function() {
  return del([ "public/**/*" ]);
});
