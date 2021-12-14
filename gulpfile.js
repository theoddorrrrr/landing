const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

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
        .pipe(sourcemaps.init())
        .pipe(sass()
            .on('error', sass.logError))
		.pipe(autoprefixer({
			cascade: false
		}))
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/css'))
})

//JS
gulp.task('js', function() {
    return gulp.src([
            'src/js/init.js',
            'src/js/validation.js',
            'src/js/form.js',
            'src/js/navigation.js',
            'src/js/main.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'));
});

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
        .pipe(gulp.dest('build/fonts'));
});

//Copy images
gulp.task('copy:img', function() {
    return gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest('build/img'));
});

//Copy
gulp.task('copy', gulp.parallel('copy:font', 'copy:img'));

//Watchers
gulp.task('watch', function() {
    gulp.watch('src/template/**/*.pug', gulp.series('template:compile'));
    gulp.watch('src/style/**/*.scss', gulp.series('sass'));
    gulp.watch('src/js/**/*.js', gulp.series('js'));
  });
  
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('template:compile', 'sass', 'js', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
    )
);

