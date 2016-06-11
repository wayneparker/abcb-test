/**
 * Gulp Configuration
 *
 * @author
 * Wayne Parker <wayne@wparker.io>
 *
 * @created
 * 5/22/16
 */

'use strict';

//
// ## Imports

// General
var gulp = require('gulp');
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var util = require('gulp-util');

// Templates
var jade = require('gulp-jade');

// Styles
var autoprefixer = require('gulp-autoprefixer');
var cleancss = require('gulp-clean-css');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

// Scripts
//var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var vendorJS = require('gulp-concat-vendor');

// Images
//var imagemin = require('gulp-imagemin');

// Environment
var productionFlag = !!util.env.production; // `gulp --production` flag


//
// ## Paths
var
	src =  'src',
	dev =  'dev',
	prod = 'dist',
	vendor = 'bower_components'
	;
var paths = {
	templates: src + '/templates',
	vendor: {
		styles: [
			vendor + '/normalize-css/normalize.css'//,
			// vendor + '/bootstrap-styles/assets/stylesheets/_bootstrap.scss'
			// etc. add as needed
		],
		scripts: [
			// vendor + '/jquery/dist/jquery.js',
			// vendor + '/bootstrap-styles/assets/javascripts/bootstrap.js'
			// etc. add as needed
		]
	},
	src: {
		root:      src,
		styles: {
			sass: [
				src + '/styles/**/*.sass',
				src + '/styles/**/*.scss'
			]//,
			//less:    src + '/styles/**/*.less'
		},
		css:       src + '/css',
		scripts: {
			js:      src + '/scripts/**/*.js'//,
			//coffee:  src + '/scripts/**/*.coffee'
		},
		js:        src + '/js'//,
		//images:    src + '/images',
		//img:       src + '/img',
		//docs:      src + '/docs',
		//fonts:     src + '/fonts',
		//media:     src + '/media'
	},

	dev: {
		root:      dev,
		css:       dev + '/css',
		js:        dev + '/js'//,
		//img:       dev + '/img',
		//docs:      dev + '/docs',
		//fonts:     dev + '/fonts',
		//media:     dev + '/media'
	},

	prod: {
		root:     prod,
		css:      prod + '/css',
		js:       prod + '/js'//,
		//img:      prod + '/img',
		//docs:     prod + '/docs',
		//fonts:    prod + '/fonts',
		//media:    prod + '/media'
	}
};


//
// ## Task Definitions

// HTML Templates

// This is where we’d compile templates into HTML, if we were rockin’ Jade or whatever
// Soooooo… Why don’t we add Jade?
gulp.task('html', function() {
	// compile Jade templates into HTML file(s)
	return gulp.src([paths.templates + '/**/*.jade', '!**/_*.jade'])
	.pipe(jade({
				pretty: '  '
			})
			.on('error', function (e) {
				console.log(e);
			})
		)
		.pipe(gulp.dest(paths.src.root))//;
		// push compiled HTML to Staging
		.pipe(gulp.dest(productionFlag ? paths.prod.root : paths.dev.root));
});


// Styles

gulp.task('styles-sass', function() {
	// compile sass/scss source and concat into to `styles.CSS`
	return gulp.src(paths.src.styles.sass)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('styles.css'))
		.pipe(autoprefixer(['> 1%', 'last 2 versions', 'Firefox ESR']))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.src.css));
});
// we could do the same for Less source, if that’s your jam

gulp.task('css-app', ['styles-sass'], function() {
	// clean `styles.CSS` to `styles.min.CSS`
	return gulp.src(paths.src.css + '/styles.css')
		.pipe(productionFlag ? util.noop() : sourcemaps.init({loadMaps: true})) // no sourcemaps in Production
		.pipe(concat('styles.min.css')) // not really a concat, just renaming the file
		.pipe(cleancss())
		.pipe(productionFlag ? util.noop() : sourcemaps.write('.'))
		.pipe(gulp.dest(paths.src.css))
		// push `styles.min.css` to Staging or Production
		.pipe(gulp.dest(productionFlag ? paths.prod.css : paths.dev.css));
});

// collect vendor stylesheets into `vendor.CSS`
gulp.task('styles-vendor', function() {
	return gulp.src(paths.vendor.styles)
		.pipe(concat('vendor.css'))
		.pipe(gulp.dest(paths.src.css));
});

// clean `vendor.css` to `vendor.min.CSS`
gulp.task('css-vendor', ['styles-vendor'], function() {
	return gulp.src(paths.src.css + '/vendor.css')
		.pipe(concat('vendor.min.css')) // not really a concat, just renaming the file
		.pipe(cleancss())
		.pipe(gulp.dest(paths.src.css))
		// push `vendor.min.CSS` to Staging or Production
		.pipe(gulp.dest(productionFlag ? paths.prod.css : paths.dev.css));
});

// ALL Style Tasks
gulp.task('styles', ['css-app', 'css-vendor']);


// Scripts

// lint JS source with ESLint
gulp.task('lint', function () {
	return gulp.src([
		paths.src.scripts.js,
		'gulpfile.js' // add any other JS-format config files as needed
	])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

// compile & concat JS / ES6 source to `app.JS` (ES5)
gulp.task('scripts-compile', ['lint'], function() {
	return gulp.src(paths.src.scripts.js)
		.pipe(sourcemaps.init())
		//.pipe(babel({ presets: ['es2015'] })) // not today!
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.src.js));
});

// minify `app.js` to `app.min.JS`
gulp.task('js-app', ['scripts-compile'], function() {
	return gulp.src(paths.src.js + '/app.js')
		.pipe(productionFlag ? util.noop() : sourcemaps.init({loadMaps: true})) // no sourcemaps in Production
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(productionFlag ? util.noop() : sourcemaps.write('.'))
		.pipe(gulp.dest(paths.src.js))
		// push `app.min.JS` to Staging or Production
		.pipe(gulp.dest(productionFlag ? paths.prod.js : paths.dev.js));
});

// collect vendor scripts, AND dependencies, in order, into `vendor.JS`
gulp.task('scripts-vendor', function() {
	return gulp.src(paths.vendor.scripts)
		.pipe(sourcemaps.init())
		.pipe(vendorJS('vendor.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.src.js));
});

// push `vendor.min.JS` to Staging or Production
gulp.task('js-vendor', ['scripts-vendor'], function() {
	return gulp.src(paths.src.js + '/vendor.js')
		.pipe(productionFlag ? util.noop() : sourcemaps.init({loadMaps: true})) // no sourcemaps in Production
		.pipe(concat('vendor.min.js'))
		.pipe(uglify())
		.pipe(productionFlag ? util.noop() : sourcemaps.write('.'))
		.pipe(gulp.dest(paths.src.js))
		.pipe(gulp.dest(productionFlag ? paths.prod.js : paths.dev.js));
});

// ALL Script Tasks
gulp.task('scripts', ['js-app', 'js-vendor']);


// Images

// optimize images that have changed
gulp.task('images-opt', function() {
	return gulp.src(paths.src.images + '/**/*')
		.pipe(changed(paths.src.img, {hasChanged: changed.compareSha1Digest}))
		.pipe(gulp.dest(paths.src.img));
});

// push changed images that to Staging or Production
gulp.task('images', ['images-opt'], function() {
	return gulp.src(paths.src.img + '/**/*')
		.pipe(changed(productionFlag ? paths.prod.img : paths.dev.img, {hasChanged: changed.compareSha1Digest}))
		.pipe(gulp.dest(productionFlag ? paths.prod.img : paths.dev.img));
});

// Static Assets

// Here we would have tasks to push other static assets (docs, fonts, img, media, etc.), but we don’t have any!


//
// ## Watch for Changes

gulp.task('watch', function () {
	gulp.watch(paths.src.root + '/templates/**/*', ['html']);
	gulp.watch(paths.src.styles.sass, ['css-app']);
	gulp.watch(paths.src.scripts.js, ['js-app']);
	//gulp.watch(paths.src.images + '/**/*', ['images']);
});


gulp.task('default', ['html', 'styles', 'scripts'], function() {
	// additional code for any default task here… or not.
});
