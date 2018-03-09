var gulp = require('gulp');
var closureDeps = require('gulp-closure-deps');

var browserify = require('gulp-browserify');

gulp.task('default', function() {
	gulp.src('game/loader.js')
		.pipe(browserify({
			insertGlobals : false,
			debug: false
		}))
		.pipe(gulp.dest('./public/javascripts'))
});

//gulp.task('default', function() {
//	gulp.src([
//			'public/closure-library/**/*.js',
//			'public/javascripts/**/*.js'
//		])
//	.pipe(closureDeps({
//			fileName: 'deps.js',
//			prefix: '',
//			baseDir: 'public/'
//		}))
//	.pipe(gulp.dest('public'));
//});