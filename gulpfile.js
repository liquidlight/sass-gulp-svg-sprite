var basePaths = {
	src: 'build/',
	dest: 'html/assets/',
};
var paths = {
	images: {
		src: basePaths.src + 'img/',
		dest: basePaths.dest + 'img/'
	},
	sprite: {
		src: basePaths.src + 'sprite/*',
		svg: 'img/sprite.svg',
		css: '../../' + basePaths.src + 'sass/src/_sprite.scss'
	},
	templates: {
		src: basePaths.src + 'tpl/'
	}
};

/*
	Let the magic begin
*/

var gulp = require('gulp');

var gutil = require('gulp-util');
var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*'],
	replaceString: /\bgulp[\-.]/
});

var changeEvent = function(evt) {
	gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
};

gulp.task('svgSprite', function () {

	return gulp.src(paths.sprite.src)
		.pipe(plugins.svgmin())
		.pipe(plugins.svgSprite({
			"mode": {
				"css": {
					"spacing": {
						"padding": 5
					},
					"dest": "./",
					"layout": "diagonal",
					"sprite": "img/sprite.svg",
					"bust": false,
					"render": {
						"scss": {
							"dest": "css/src/_sprite.scss",
							"template": "build/tpl/sprite-template.scss"
						}
					}
				}
			}
		}))
		.pipe(gulp.dest(basePaths.dest));

});

gulp.task('pngSprite', ['svgSprite'], function() {
	return gulp.src(basePaths.dest + paths.sprite.svg)
		.pipe(plugins.svg2png())
		.pipe(gulp.dest(paths.images.dest));
});

gulp.task('sprite', ['pngSprite']);

gulp.task('watch', function(){
	gulp.watch(paths.sprite.src, ['sprite']).on('change', function(evt) {
		changeEvent(evt);
	});
});

gulp.task('default', ['sprite']);
