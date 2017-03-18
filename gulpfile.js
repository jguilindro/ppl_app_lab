//https://gist.github.com/sogko/b53d33d4f3b40d3b4b2e
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');

gulp.task('default',['nodemon', 'browser-sync'], function () {
});

gulp.task('browser-sync', [], function() {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
        files: ["app_client/**"],
        browser: "default",
        port: 5000,
	});
});
gulp.task('nodemon', function (cb) {

	var started = false;

	return nodemon({
		script: './bin/www',
    "ignore": [
  		".git",
  	 "node_modules/**/node_modules",
  	 "scripts/**",
  	 "public/bower_components/**",
  	 "gulpfile.js"
  	]
	})
    .on('start', function () {
  		// to avoid nodemon being started multiple times
  		// thanks @matthisk
  		if (!started) {
  			cb();
  			started = true;
  		}
	  }).
    on('crash', function() {

    }).
    on('restart', function() {

    }).
    on('quit', function() {
      
    })
});
