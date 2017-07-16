var gulp = require('gulp'),
    // pngquant = require('imagemin-pngquant'), // 深度压缩
    // plugins = require('gulp-load-plugins')();
htmlclean = require('gulp-htmlclean'),
htmlmin = require('gulp-htmlmin'),       // 压缩 HTML
csscomb = require('gulp-csscomb'),       // CSS 格式化
cleancss = require('gulp-clean-css'),    // 压缩 CSS
uglify = require('gulp-uglify'),         // 压缩 JS
cache = require('gulp-cache'),           // 缓存
imagemin = require('gulp-imagemin'),     // 压缩 图片
pngquant = require('imagemin-pngquant'), // 深度压缩
concat = require('gulp-concat');
// 压缩 html
gulp.task('minify-html', function () {
    return gulp.src('./public/**/*.html')
        .pipe(htmlclean())
        .pipe(htmlmin({
            removeComments: true,                // 清除 HTML 注释
            collapseWhitespace: true,            // 压缩 HTML
            collapseBooleanAttributes: true,     // 省略布尔属性的值 <input checked="true"/> ==> <input checked />
            removeEmptyAttributes: true,         // 删除所有空格作属性值 <input id="" /> ==> <input />
            removeRedundantAttributes: true,     // 当值是默认时删除属性
            removeScriptTypeAttributes: true,    // 删除 <script> 的 type="text/javascript"
            removeStyleLinkTypeAttributes: true, // 删除 <style> 和 <link> 的 type="text/css"
            minifyJS: true,                      // 压缩页面 JS
            minifyCSS: true,                     // 压缩页面 CSS
            minifyURLs: true,                    // Minify URLs in various attributes (uses relateurl)
            useShortDoctype: true                // Replaces the doctype with the short (HTML5) doctype
        }))
        .on('error', function (err) {
            console.log('html Error!', err.message);
            this.end();
        })
        .pipe(gulp.dest('./public'))
});
// 压缩 css
gulp.task('minify-css', function () {
    return gulp.src(["public/**/*.css", "!public/**/*.min.css"])
        .pipe(csscomb())
        .pipe(cleancss({
            advanced: false,         // 类型：Boolean 默认：true [是否开启高级优化(合并选择器等)]
            keepSpecialComments: '1' // 保留所有特殊前缀 当你用 autoprefixer 生成的浏览器前缀, 如果不加这个参数, 有可能将会删除你的部分前缀
        }))
        .pipe(gulp.dest('./public'));
});
// 压缩 js
gulp.task('minify-js', function () {
    return gulp.src(['./public/js/**/*.js', '!public/js/**/*.min.js'])
        .pipe(uglify({
            mangle: true,  // 类型：Boolean 默认：true 是否修改变量名
            compress: true // 类型：Boolean 默认：true 是否完全压缩
        }))
        // .pipe(concat('all.js')) //合并后的文件名
        // .pipe(gulp.dest('./public/js'));
        .pipe(gulp.dest('./public/js'));
});
//压缩 图片
gulp.task('minify-image', function () {
    return gulp.src('./public/**/*.{png,jpg,gif,ico}')
        // 只压缩修改的图片。压缩图片时比较耗时, 在很多情况下我们只修改了某些图片, 没有必要压缩所有图片, 使用"gulp-cache"只压缩修改的图片, 没有修改的图片直接从缓存文件读取(%TMP%\gulp-cache)。
        .pipe(cache(imagemin({
            progressive: true,    // 类型：Boolean 默认：false 无损压缩 jpg 图片
            optimizationLevel: 5, // 类型：Number 默认：3 取值范围：0-7(优化等级)
            interlaced: true,     // 类型：Boolean 默认：false 隔行扫描 gif 进行渲染
            multipass: true,      // 类型：Boolean 默认：false 多次优化 svg 直到完全优化
            svgoPlugins: [{ removeViewBox: false }], // 不要移除 svg 的 viewbox 属性
            use: [pngquant()]                      // 使用 pngquant 深度压缩 png 图片的 imagemin 插件
        })))
        .pipe(gulp.dest('./public'));
});
// 默认任务
gulp.task('default', [
    'minify-html', 'minify-css', 'minify-js', 'minify-image'
]);