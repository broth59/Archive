//node
const fs = require('fs')
const path = require('path')
const axios = require('axios').default
const WebSocketServer = require('ws').Server
const shell = require('shelljs')
const merge = require('merge-stream')

//gulp
const gulp = require('gulp')
const through = require('through2')
const markdown = require('gulp-markdown')
const scss = require('gulp-sass')
const concat = require('gulp-concat')
const replace = require('gulp-replace')
const inlineFonts = require('gulp-inline-fonts')
//minify
const uglify = require('gulp-uglify-es').default
const htmlmin = require('gulp-htmlmin')
const minify = require('gulp-minify')

const css_base64 = require('gulp-base64')
const html_base64 = require('gulp-inline-image-html')
const GulpClient = require('gulp')

//path
const Path = {}
Path.src = path.join(__dirname, 'src')
Path.dist = path.join(__dirname, 'dist')
Path.temp = path.join(__dirname, 'temp')
Path.bundle = path.join(__dirname, 'bundle')

Path.static = path.join(__dirname, 'src', 'static')
Path.js = path.join(__dirname, 'src', 'static', 'js')
Path.css = path.join(__dirname, 'src', 'static', 'css')
Path.img = path.join(__dirname, 'src', 'static', 'img')
Path.html = path.join(__dirname, 'src', 'static', 'html')

//static files
const code_syntax_js = gulp.src(path.join(Path.js, 'highlight.pack.js'))
const code_syntax_css = gulp.src(path.join(Path.css, 'styles', 'a11y-dark.css'))

const markdown_default_css = toStyle(fs.readFileSync(path.join(Path.css, 'styles', 'splendor.css')))

//static html
const meta_tag_html = fs.readFileSync(path.join(Path.html, 'meta_tag.html'))

function toScript(js) {
	return `<script>${js}</script>`
}
function toStyle(css) {
	return `<style>${css}</style>`
}

function wrapContents(contents_buffer) {
	return Buffer.concat([
		Buffer.from(`
        <section id='background'></section>
        <ul id='search-tree'></ul>
        <aside id='scroll-gage'>0%</aside>
        <main>
        `),
		contents_buffer,
		Buffer.from('</main>'),
	])
}

/* File System Manipulation */

function readFile(path, options) {
	return new Promise((resolve, error) => {
		fs.readFile(path, options, function (err, buffer) {
			err && error()
			resolve(buffer.toString())
		})
	})
}

function readHierarchy(file_path, criteria_path) {
	const stats = fs.lstatSync(file_path)

	const file_name = path.basename(file_path, '.html')
	let info = {
		path: path.relative(criteria_path, file_path).replace(/..(?:\\|\/)/, ''),
		name: file_name == 'dist' ? 'Open Archive' : file_name,
	}

	if (stats.isDirectory()) {
		info.type = 'folder'
		info.children = fs
			.readdirSync(file_path, { withFileTypes: true })
			.sort((file_alpha, file_beta) => {
				if (file_alpha.isDirectory() && file_beta.isDirectory()) return 0
				if (file_alpha.isDirectory()) return -1
				return 1
			})
			.map((file) => file.name)
			.map((child_path) => readHierarchy(path.join(file_path, child_path), criteria_path))
	} else {
		info.type = 'file'
	}

	return info
}

const server = new WebSocketServer({ port: 3212 })
let web_socket

server.on('connection', function (webSocket) {
	web_socket = webSocket
})

/* Task */

gulp.task('scss', function () {
	const src_fonts_css = gulp.src(path.join(Path.css, 'src_fonts.css'))

	return gulp
		.src('./src/**/*.scss')
		.pipe(scss().on('error', scss.logError))
		.pipe(
			replace(/url\((?:"|')(.+)(?:"|')\)/g, function (full_text, url) {
				if (url.startsWith('http')) return full_text
				const static_file_path = path.join(Path.static, url).replace(/\\/g, '/')
				return `url('${static_file_path}')`
			})
		)
		.pipe(src_fonts_css)
		.pipe(concat('app.css'))
		.pipe(gulp.dest(Path.temp))
})

gulp.task('scss::build', function () {
	const fonts_css = gulp.src(path.join(Path.css, 'fonts.css'))

	return gulp
		.src('./src/**/*.scss')
		.pipe(scss().on('error', scss.logError))
		.pipe(fonts_css)
		.pipe(
			css_base64({
				baseDir: './src/static',
				debug: false,
			}).on('error', (_) => _)
		)
		.pipe(concat('app.css'))
		.pipe(minify())
		.pipe(gulp.dest(Path.temp))
})

/* Fonts */

gulp.task('fonts', function () {
	// create an accumulated stream
	var fontStream = merge()

	fontStream.add(gulp.src(path.join(Path.css, 'fonts', 'maplestory', 'Maplestory_Light.ttf')).pipe(inlineFonts({ name: 'Maplestory', weight: 400, formats: ['ttf'] })))

	// an italic version
	fontStream.add(gulp.src(path.join(Path.css, 'fonts', 'maplestory', 'Maplestory_Bold.ttf')).pipe(inlineFonts({ name: 'Maplestory', weight: 700, formats: ['ttf'] })))

	return fontStream.pipe(concat('fonts.css')).pipe(gulp.dest(Path.css))
})

gulp.task('js', function () {
	return code_syntax_js.pipe(gulp.src('./src/**/*.js')).pipe(concat('app.js')).pipe(minify()).pipe(gulp.dest(Path.temp))
})

gulp.task('js::build', function () {
	return code_syntax_js
		.pipe(gulp.src(['./src/**/*.js', '!./src/**/hot_reload.js']))
		.pipe(concat('app.js'))
		.pipe(minify())
		.pipe(gulp.dest(Path.temp))
})

gulp.task('markdown', function () {
	return gulp
		.src('./src/markdown/**/*.md')
		.pipe(markdown())
		.pipe(
			through.obj(async function (file, encoding, push) {
				const extra_css = toStyle(await readFile(path.join(Path.temp, 'app.css')))
				const extra_js = toScript(await readFile(path.join(Path.temp, 'app.js')))

				file.contents = Buffer.concat([
					//header
					Buffer.from(meta_tag_html),
					Buffer.from(extra_css),
					wrapContents(file.contents),
					Buffer.from(extra_js),
				])
				push(null, file)
			})
		)
		.pipe(html_base64('./src/static/img'))
		.pipe(gulp.dest('./dist'))
		.pipe(
			through.obj(async function (file, encoding, push) {
				const dist_html_path = file.history[file.history.length - 1]
				const fs_hierarchy_literal = JSON.stringify(readHierarchy(Path.dist, dist_html_path)).replace(/\\\\/g, '/')
				const content = file.contents.toString()
				file.contents = Buffer.from(
					content.replace('#tree_json_literal#', () => fs_hierarchy_literal),
					encoding
				)

				push(null, file)
			})
		)
		.pipe(gulp.dest('./dist'))
})

gulp.task('markdown::build', function () {
	return gulp
		.src('./src/markdown/**/*.md')
		.pipe(markdown())
		.pipe(
			through.obj(async function (file, encoding, push) {
				const extra_css = toStyle(await readFile(path.join(Path.temp, 'app.css')))
				const extra_js = toScript(await readFile(path.join(Path.temp, 'app.js')))

				file.contents = Buffer.concat([
					//header
					Buffer.from(meta_tag_html),
					Buffer.from(extra_css),
					wrapContents(file.contents),
					Buffer.from(extra_js),
				])
				push(null, file)
			})
		)
		.pipe(html_base64('./src/static/img'))
		.pipe(gulp.dest('./dist'))
		.pipe(
			through.obj(async function (file, encoding, push) {
				const dist_html_path = file.history[file.history.length - 1]
				const fs_hierarchy_literal = JSON.stringify(readHierarchy(Path.dist, dist_html_path)).replace(/\\\\/g, '/')
				const content = file.contents.toString()
				file.contents = Buffer.from(
					content.replace('#tree_json_literal#', () => fs_hierarchy_literal),
					encoding
				)

				push(null, file)
			})
		)
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('./dist'))
})

gulp.task('reload', function () {
	return new Promise((resolve) => {
		setTimeout((_) => {
			web_socket && web_socket.send('reload')
			resolve()
		}, 10)
	})
})

let watch_stream_list = []

gulp.task('watch', function () {
	watch_stream_list = watch_stream_list.concat(gulp.watch(['./src/**/*.md'], gulp.series(['markdown', 'reload'])), gulp.watch(['./src/**/*.scss'], gulp.series(['scss', 'markdown', 'reload'])), gulp.watch(['./src/**/*.js'], gulp.series(['js', 'markdown', 'reload'])))
})

gulp.task('default', gulp.series(['scss', 'js', 'markdown', 'watch']))

gulp.task('build', function () {
	return gulp.series(['scss::build', 'js::build', 'markdown::build'])()
	// server.close()
	// shell.rm('-r', Path.temp)
})

process.on('SIGINT', function () {
	server.close()
	shell.rm('-r', Path.temp)
	watch_stream_list.forEach((watch_stream) => {
		watch_stream.close()
	})
})
