//https://gist.github.com/sogko/b53d33d4f3b40d3b4b2e
'use strict';
var os = require('os');
var gulp = require('gulp');
var open = require('gulp-open');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
require('dotenv').config()
gulp.task('default',['set-dev-node-env','nodemon', 'browser-sync'], function () {
});

gulp.task('production-test',['production-t','nodemon'], function () {
});

gulp.task('testing',['test','nodemon'], function () {
});

gulp.task('production',['produc','nodemon'], function () {
});

gulp.task('realtime',['set-dev-node-env','nodemon'], function () {
});

gulp.task('api',['emergencia','nodemon'], function () {
});

gulp.task('uri', function(){
  var options = {
    uri: 'http://localhost:3000',
    app: 'firefox'
  };
  gulp.src(__filename)
  .pipe(open(options));
});

gulp.task('set-dev-node-env', function() {
    return process.env.NODE_ENV = 'development';
});

gulp.task('production-t', function() {
    return process.env.NODE_ENV = 'production-test';
});

gulp.task('test', function() {
    return process.env.NODE_ENV = 'testing';
});

gulp.task('produc', function() {
    return process.env.NODE_ENV = 'production';
});

gulp.task('emergencia', function() {
    return process.env.NODE_ENV = 'api';
});

gulp.task('browser-sync', [], function() {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
    ws: true,
    socket: {
      namespace: '/browser'
    },
        files: ["app_client/**"],
        browser: "default",
        open: false,
        port: 5000,
        ghostMode: {
          links: false
      }
	});
});

gulp.task('nodemon', function (cb) {

	var started = false;

	return nodemon({
		script: 'app.js',
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
