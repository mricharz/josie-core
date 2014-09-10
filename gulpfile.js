var argv = require('yargs').argv, 
	gulp = require('gulp'),
	uglify = require('gulp-uglifyjs'),
	clean = require('gulp-rimraf'),
	foreach = require('gulp-foreach'),
	tar = require('gulp-tar'),
	gzip = require('gulp-gzip'),
	run = require('run-sequence'),
	sSrc = './src/**/*.*',
	sTarget = './target',
	sPackageName = 'josie-core.tar';

/**
 * Uglify Source and move into Target-Directory
 */
gulp.task('uglify', function(){
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
		.pipe(gulp.dest(sTarget+'/src'));
});

/**
 * Clean Target-Directory
 */
gulp.task('clean', function(){
	return gulp.src(sTarget)
		.pipe(clean());
});

/**
 * Package all files
 */
gulp.task('package', function() {
	var oGzipOptions = {
		append: true,
		gzipOptions: {
			level: 9
		}
	};
	
	return gulp.src(sTarget+'/src/**/*.*')
		.pipe(tar(sPackageName))
		.pipe(gzip(oGzipOptions))
		.pipe(gulp.dest(sTarget));
});

/**
 * Install task (just uglify into target; good for development)
 */
gulp.task('install', function(cb) {
	 run(
	 	'clean',
	 	'uglify',
      	cb
	 );

});

/**
 * Default Build Task
 */
gulp.task('default', function(cb) {
	 run(
		'clean',
	 	'uglify',
     	'package',
      	cb
	 );

});