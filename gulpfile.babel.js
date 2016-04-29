import gulp from 'gulp'
import connect from 'gulp-connect'
import open from 'gulp-open';
import concat from 'gulp-concat';
import source from 'vinyl-source-stream';
import browserify from 'browserify';
import babelify from 'babelify';
import lint  from 'gulp-eslint';

const config = {
    indexJs: './src/index.js',
    js: './src/**/*.js',
    css: [
        'src/css/bootstrap/css/bootstrap.min.css',
        'src/css/bootstrap/css/bootstrap-theme.min.css',
        './src/css/*.css'
    ],
    html: './*.html',
    dist: './App',
    devBaseUrl: 'http://localhost',
    port: 8888


}

gulp.task('open', ['connect'], () => {
    gulp.src('App/index.html')
        .pipe(open({uri: config.devBaseUrl + ':' + config.port + '/'}))
})

gulp.task('connect', ['html'], () => {
    connect.server({
        root: 'App',
        port: config.port,
        livereload: true
    })
})

gulp.task('html', () => {
    gulp.src(config.html)
        .pipe(gulp.dest(config.dist))
        .pipe(connect.reload())
})

gulp.task('js', () => {
    browserify(config.indexJs)
        .transform(babelify, {presets: ["es2015", "react"]})
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.dist + '/scripts'))
        .pipe(connect.reload());
});

gulp.task('css', () => {
    gulp.src(config.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.dist + '/css'))
        .pipe(connect.reload());
});

gulp.task('watch', () => {
    gulp.watch([config.html], ['html'])
    gulp.watch([config.js], ['js', 'lint'])
    gulp.watch([config.indexJs], ['js', 'lint'])
    gulp.watch([config.css], ['css'])
})

gulp.task('lint', () => {
    return gulp.src(config.js).pipe(lint({
            'rules':{
                'quotes': [1, 'single'],
                'semi': [1, 'never']
            }
        }))
        .pipe(lint.format())
        // Brick on failure to be super strict
        .pipe(lint.failOnError());
});


gulp.task('default', ['open', 'watch', 'css', 'js', 'lint'])