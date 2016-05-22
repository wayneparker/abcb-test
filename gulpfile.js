/**
 * Gulp Configuration
 *
 * Created by wayne on 5/22/16
 */

//
//## Module init

var gulp =         require('gulp');

// General
var changed =      require('gulp-changed');
var concat =       require('gulp-concat');
var flatten =      require('gulp-flatten');
var git =          require('gulp-git');
var notify =       require('gulp-notify');
var rimraf =       require('gulp-rimraf');

// Styles
var autoprefixer = require('gulp-autoprefixer');
var minifycss =    require('gulp-minify-css');
var sass =         require('gulp-sass');

// Scripts
var jshint =       require('gulp-jshint');
var sourcemaps =   require('gulp-sourcemaps');
var uglify =       require('gulp-uglify');

//
//## Paths

var sourcePath = 'src/';
var vendorPath = 'bower_components/';
var devPath =    'dev/';
var filePath =   'files/';
var fontPath =   'fonts/';
var imagePath =  'img/';
var scriptPath = 'js/';
var stylePath =  'css/';
var distPath =   'dist/';


//
//## Gulp tasks
// Run 'gulp -T' for a task summary


//## Git Add
// 'gulp git-add' - Adds any newly generated files to the git repo
gulp.task('git-add', function () {
	return gulp.src(devPath)
		.pipe(git.add());
});


//
//## Static Assets

// Files - Copies binary file assets to dev folder
gulp.task('files', function () {
	return gulp.src(sourcePath + filePath + '**/*')
		.pipe(changed(devPath))
		//.pipe(flatten()) // Disable for this project
		.pipe(gulp.dest(devPath + filePath))
		.pipe(notify({message: 'Files Updated'}));
});


// Fonts - Copies web font assets to dev folder
gulp.task('fonts', function () {
	return gulp.src(sourcePath + fontPath + '**/*')
		//.pipe(flatten()) // Disable for this project
		.pipe(gulp.dest(devPath + fontPath))
		.pipe(notify({message: 'Fonts Updated'}));
});


// Images - Copies image assets to dev folder
gulp.task('images', function () {
	return gulp.src(sourcePath + imagePath + '**/*')
		//.pipe(flatten()) // Disable for this project
		.pipe(gulp.dest(devPath + imagePath))
		.pipe(notify({message: 'Images Updated'}));
});


// Pages - Copies HTML pages to dev folder
gulp.task('pages', function () {
	return gulp.src(sourcePath + '**/*.html')
		//.pipe(flatten()) // Disable for this project
		.pipe(gulp.dest(devPath))
		.pipe(notify({message: 'Pages Updated'}));
});


// Static - Copy all static assets to dev folder
gulp.task('static', ['files', 'fonts', 'images', 'pages'], function () {
	return;
});


//## Scripts

// Script Clean - Clean out old script build files
gulp.task('scripts-clean', function() {
	return gulp.src([
		devPath + scriptPath + '**/*.js',
		devPath + scriptPath + '**/*.js.map'
	])
		.pipe(rimraf())
		.pipe(notify({message: 'Scripts Cleaned'}));
});

// JSHint - Lints configuration JSON and project JS.
gulp.task('jshint', function () {
	return gulp.src([
		'bower.json',
		'gulpfile.js',
		sourcePath + scriptPath + '**/*.js'
	])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

// Vendor scripts - Concat vendors scripts
gulp.task('scripts-vendor', function () {
	return gulp.src(vendorPath + '**/*.js')
		.pipe(sourcemaps.init())
		//.pipe(uglify()) // Disable for development
		.pipe(concat('vendor.min.js'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(devPath + scriptPath));
});

// App scripts - Concat and deploy project scripts to development
gulp.task('scripts', ['jshint', 'scripts-clean', 'scripts-vendor'], function () {
	return gulp.src( sourcePath + scriptPath + '**/*.js' )
		.pipe(sourcemaps.init())
		//.pipe(uglify()) // Disable for development
		.pipe(concat('app.min.js'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(devPath + scriptPath))
		.pipe(notify({message: 'App Scripts Updated'}));
});


//## Styles

// Clean Styles - Clean out old styles build files
gulp.task('styles-clean', function() {
	return gulp.src([
		devPath + stylePath + '**/*.css',
		devPath + stylePath + '**/*.css.map'
	])
		.pipe(rimraf())
		.pipe(notify({message: 'Styles Cleaned'}));
});

// Build Styles - Compiles, combines, and optimizes Bower CSS and project CSS.
gulp.task('styles', ['styles-clean'], function () {
	return gulp.src([
		sourcePath + 'sass/**/*.sass',
		sourcePath + 'sass/**/*.scss'
	])
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('styles.min.css'))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(devPath + stylePath))
		.pipe(notify({message: 'Styles Updated'}));
});


//
//## Dist - Build site to dist folder for deployment

// Publish Static Assets
gulp.task('dist-static', function () {
	return gulp.src([
		devPath + '**/*.html',
		devPath + filePath +  '**/*',
		devPath + fontPath +  '**/*',
		devPath + imagePath + '**/*'
	])
		.pipe(gulp.dest(distPath))
		.pipe(notify({message: 'Static Assets Published'}));
});

// Publish Scripts
gulp.task('dist-scripts', function () {
	return gulp.src([
		devPath + scriptPath + 'vendor.min.js',
		devPath + scriptPath + 'app.min.js'
	])
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(distPath + scriptPath))
		.pipe(notify({message: 'Scripts Published'}));
});

// Publish Styles
gulp.task('dist-styles', function () {
	return gulp.src([
		devPath + stylePath + 'styles.min.css'
	])
		.pipe(sourcemaps.init())
		.pipe(minifycss())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(distPath + stylePath))
		.pipe(notify({message: 'Styles Published'}));
});

//## Publish All to Dist
gulp.task('dist', ['dist-static', 'dist-scripts', 'dist-styles'], function () {
	return;
});


//## Watch - Run gulp tasks as source files are changed
gulp.task('watch', function () {
	gulp.watch([sourcePath +              '**/*.html'], ['pages']);
	gulp.watch([sourcePath + filePath +   '**/*'],      ['files']);
	gulp.watch([sourcePath + fontPath +   '**/*'],      ['fonts']);
	gulp.watch([sourcePath + imagePath +  '**/*'],      ['images']);
	gulp.watch([sourcePath + stylePath +  '**/*'],      ['styles']);
	gulp.watch([sourcePath + scriptPath + '**/*'],      ['scripts']);
});

gulp.task('default', ['pages', 'files', 'images', 'styles', 'scripts']);
