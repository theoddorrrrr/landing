const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

// Server
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload)
});


//Pug
gulp.task('template:compile', buildHTML => {
    return gulp.src('src/template/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
})

//Styles
gulp.task('sass', () => {
    return gulp.src('src/style/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/css'))
})

//Sprites  
gulp.task('sprite', function(cb) {
    const spriteData = gulp.src('src/img/icons/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../img/sprite.png',
      cssName: 'sprite.scss'
    }));
  
    spriteData.img.pipe(gulp.dest('build/img/'));
    spriteData.css.pipe(gulp.dest('src/style/global/'));
    cb();
  });

  //Delete 
gulp.task('clean', function del(cb) {
    return rimraf('build', cb);
});
  
//Copy fonts
gulp.task('copy:font', function() {
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('build/font'));
});

//Copy images
gulp.task('copy:img', function() {
    return gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest('build/img'));
});

//Copy
gulp.task('copy', gulp.parallel('copy:font', 'copy:img'));

//Autoprefixer
gulp.task ('autoprefixer', () => (
	gulp.src('./build/css/main.css')
        .pipe(sourcemaps.init())
		.pipe(autoprefixer({
			cascade: false
		}))
        .pipe(sourcemaps.write())
		.pipe(gulp.dest('build/css'))
    )
);

//Watchers
gulp.task('watch', function() {
    gulp.watch('src/template/**/*.pug', gulp.series('template:compile'));
    gulp.watch('src/style/**/*.scss', gulp.series('sass'));
  });
  
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('template:compile', 'sass', 'sprite', 'copy'),
    gulp.task('autoprefixer'),
    gulp.parallel('watch', 'server')
    )
);

