var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var babel = require('gulp-babel');

gulp.task('sass', function () {
		return gulp.src('app/sass/**/*.sass')
				.pipe(sass().on('error', sass.logError))
				.pipe(gulp.dest('app/css'));
});
gulp.task('browserSync', function () {
		browserSync({
				server: {
						baseDir: 'app'
				}
		});
});
gulp.task('babel', function () {
		return gulp.src('app/es6/**/*.es6')
				.pipe(babel({
						presets: ['es2015']
				}))
				.pipe(gulp.dest('app/js'))
})
gulp.task('watch', ['browserSync','sass'], function () {
		gulp.watch('./sass/**/*.scss', ['sass'])
		gulp.watch('app/*.html', browserSync.reload)
		gulp.watch('app/js/**/*.js', browserSync.reload);
});
gulp.task('webserver', function () {
		connect.server({
				livereload: true
		});
});
gulp.task('serve', ['webserver', 'sass', 'babel', 'watch']);
