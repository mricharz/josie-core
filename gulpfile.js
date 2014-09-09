var argv = require('yargs').argv, 
	gulp = require('gulp'),
	uglify = require('gulp-uglifyjs'),
	clean = require('gulp-rimraf'),
	foreach = require('gulp-foreach'),
	sSrc = 'src/**/*.*',
	sTarget = 'target';

gulp.task('default',['clean'], function(){
	var oSrc = gulp.src(sSrc),
		oUglifyOptions = {
			compress: {
				warnings: true,
				// Development-Mode -dev
				drop_debugger: argv.dev ? false : true
			},
			outSourceMap: true
		};
	
	return oSrc.pipe(foreach(function(stream, file) {
			return stream.pipe(uglify(oUglifyOptions));
		}))
		.pipe(gulp.dest(sTarget));
});

gulp.task('clean', function(){
	return gulp.src(sTarget)
		.pipe(clean());
});