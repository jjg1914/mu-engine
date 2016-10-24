var es = require("event-stream");
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var tslint = require("gulp-tslint");
var typescript = require("gulp-typescript");
var del = require("del");

gulp.task("default", [ "build" ]);

gulp.task("build", [ "js" ]);

gulp.task("watch", [ "js" ], function() {
  gulp.watch("src/**/*.ts", [ "js" ]);
});

gulp.task("js", function() {
  var s = gulp.src("src/**/*.ts")
    .pipe(typescript({
      declaration: true,
    }));

  return es.merge([ s.js, s.dts ])
    .pipe(gulp.dest("lib"));
});

gulp.task("lint", function() {
  return gulp.src("src/**/*.ts")
    .pipe(tslint())
    .pipe(tslint.report("verbose"));
});

gulp.task("clean", function() {
  return del([ "lib/**/*" ]);
});
