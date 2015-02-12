var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var karma = require('karma').server;

gulp.task('lint', function() {
  return gulp
    .src(['gulpfile.js', 'app/scripts/FF*.js', 'tests/specs/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('default', ['test', 'lint'], function() {
  gulp.watch(['app/scripts/FF*.js', 'tests/specs/*.js'], function() {
    gulp.run('test', 'lint');
  });
});
