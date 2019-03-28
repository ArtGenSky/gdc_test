var gulp = require('gulp'),
  pug = require('gulp-pug'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  browserSync = require('browser-sync'),
  plumber = require('gulp-plumber');

var paths = {
    styles: {
      main: [
        './src/styles/main.{sass,scss}'
      ],
      src: './src/styles/**/*.{sass,scss}',
      dest: './src/css'
    },
    css: {
      src: './src/css/**/*.css',
      dest: './dist/css',
      libsSrc: [
        './node_modules/normalize.css/normalize.css'
      ],
      libsDest: './src/css'
    },
    html: {
      src: './src/*.html',
      dest: './dist'
    },
    pug: {
      pages: './src/pug/pages/*.pug',
      src: './src/pug/**/*.pug',
      pagesDest: './src'
    },
    js: {
      src: './src/js/**/*.js',
      dest: './dist/js',
      libsSrc: [
        './node_modules/jquery/dist/jquery.min.js'
      ],
      libsDest : './src/js'
    },
    fonts: {
      src: './src/fonts/**/*',
      dest: './dist/fonts'
    },
    img: {
      src: './src/img/**/*',
      dest: './dist/img'
    }
};

gulp.task('pug', function() {
  return gulp.src(paths.pug.pages, {since: gulp.lastRun( 'pug' )})
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.pug.pagesDest));
});

var postCSSplugins = [
  autoprefixer({browsers: ['last 5 versions', 'ie 11']})
];

gulp.task('styles', function() {
  return gulp.src( paths.styles.main, {since: gulp.lastRun( 'styles' )} )
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded',
      errLogToConsole: false,
          onError: function(err) {
              return notify().write(err);
          }
    }))
    .pipe(gulp.dest(paths.styles.dest));
});

gulp.task('copy-libs-css', function() {
  return gulp.src(paths.css.libsSrc)
    .pipe(gulp.dest(paths.css.libsDest));
});
gulp.task('copy-libs-js', function() {
  return gulp.src(paths.js.libsSrc)
    .pipe(gulp.dest(paths.js.libsDest));
});
gulp.task('copy-libs', gulp.parallel('copy-libs-css', 'copy-libs-js'));

gulp.task('dist-html', function() {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest));
});
gulp.task('dist-styles', function() {
  return gulp.src(paths.css.src)
    .pipe(postcss(postCSSplugins))
    .pipe(gulp.dest(paths.css.dest));
});
gulp.task('dist-scripts', function() {
  return gulp.src(paths.js.src)
    .pipe(gulp.dest(paths.js.dest));
});
gulp.task('dist-fonts', function() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest));
});
gulp.task('dist-img', function() {
  return gulp.src(paths.img.src)
    .pipe(gulp.dest(paths.img.dest));
});

gulp.task('build', gulp.series(
  gulp.parallel('pug', 'styles', 'copy-libs'),
  gulp.parallel(
    'dist-html',
    'dist-styles',
    'dist-scripts',
    'dist-fonts',
    'dist-img'
  )
));

gulp.task('watch:styles', function() {
  return gulp.watch(paths.styles.src, gulp.series('styles'));
});
gulp.task('watch:pug', function() {
  return gulp.watch(paths.pug.src, gulp.series('pug'));
});

gulp.task('watch', gulp.parallel(
  'watch:styles',
  'watch:pug'
));

var browserSyncConfig = {
    server: {
        baseDir: './src/'
    },
    files: [
        paths.html.src,
        paths.css.src,
        paths.js.src
    ],
    notify: false
};

gulp.task('browserSync', function() {
    browserSync.init(browserSyncConfig);
});

gulp.task('serve', gulp.series(
  gulp.parallel('pug', 'styles', 'copy-libs'),
  gulp.parallel('watch', 'browserSync')
));