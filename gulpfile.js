var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

const paths = {
  scripts: {
    src: 'src/scripts/*.js',
    dest: 'dist/scripts/'
  }
};

const server = browserSync;

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './'
    }
  });
  done();
}

gulp.task('templates', function(){

	var data = {
		pretty: true,
		year: new Date().getFullYear()
	};

	return gulp.src('src/templates/*.jade')
		.pipe(pug(data))
		.pipe(gulp.dest('./'));
})

gulp.task('images', function(){
	return gulp.src(['src/images/**/*'])
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
})

gulp.task('scripts', function(){
	return gulp.src([paths.scripts.src])
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/scripts'))
})

gulp.task('styles', function(){
	return gulp.src('src/styles/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(minifyCSS())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/css'))
	})

// gulp.task('default', gulp.series('templates', 'scripts', 'styles', 'images'), function(done){
// 		server: './'
// 	});
// 	gulp.watch('src/templates/**/*.jade', ['templates']);
// 	gulp.watch('src/img/**/*', ['images']);
// 	gulp.watch('src/styles/**/*.scss', ['styles']);
// 	gulp.watch(paths.scripts.src, ['scripts']);
// 	done()
// })

const watch = () => gulp.watch(paths.scripts.src, gulp.series('templates', 'scripts', 'styles', 'images', browserSync.reload));

const dev = gulp.series(serve, watch);
exports.dev = dev;