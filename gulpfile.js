//node
const fs = require('fs')
const path = require('path')
const WebSocketServer = require('ws').Server
const shell = require('shelljs')
const merge = require('merge-stream')

//gulp
const gulp = require('gulp')
const through = require('through2')
const markdown = require('gulp-markdown')
const scss = require('gulp-sass')
const concat = require('gulp-concat')
const inlineFonts = require('gulp-inline-fonts');
    //minify
    const uglify  = require('gulp-uglify-es').default
    const htmlmin = require('gulp-htmlmin')
    const minify  = require('gulp-minify')

const css_base64 = require('gulp-base64')
const html_base64 = require('gulp-inline-image-html')
const GulpClient = require('gulp')

//path
const Path = {}
Path.src = path.join(__dirname, 'src')
Path.dist = path.join(__dirname, 'dist')
Path.temp = path.join(__dirname, 'temp')
Path.bundle = path.join(__dirname, 'bundle')

Path.js  = path.join(__dirname, 'src', 'static', 'js')
Path.css = path.join(__dirname, 'src', 'static', 'css')
Path.html = path.join(__dirname, 'src', 'static', 'html')

//static files
const code_syntax_js  = gulp.src(path.join(Path.js, 'highlight.pack.js'))
const code_syntax_css = gulp.src(path.join(Path.css, 'styles', 'a11y-dark.css'))

const markdown_default_css = toStyle(fs.readFileSync(path.join(Path.css, 'styles', 'splendor.css')))

    //static html
    const meta_tag_html = fs.readFileSync(path.join(Path.html, 'meta_tag.html'))


function toScript(js){
    return `<script>${js}</script>`
}
function toStyle(css){
    return `<style>${css}</style>`
}

function wrapContents(contents_buffer){
    return Buffer.concat([
        Buffer.from(`<main>`),
        contents_buffer,
        Buffer.from('</main>'),
    ])
}

function readFile(path, options){
    return new Promise((resolve,error)=>{
        fs.readFile(path, options, function(err, buffer){
            err && error()
            resolve(buffer.toString())
        })
    })
}



const server = new WebSocketServer({ port: 3212 });
let web_socket; 

server.on("connection", function(webSocket) {
    web_socket = webSocket
});

/* Task */

gulp.task('scss', function(){
    const code_syntax_css = gulp.src(path.join(Path.css, 'styles', 'a11y-dark.css'))
    const fonts_css = gulp.src(path.join(Path.css, 'fonts.css'))

    return gulp.src('./src/**/*.scss')
        .pipe(scss().on('error', scss.logError))
        // .pipe(fonts_css)
        .pipe(code_syntax_css)
        .pipe(concat('app.css'))
        .pipe(css_base64({
            baseDir: './src/static',
            debug: true
        }).on('error', _=>_))
        .pipe(minify())
        .pipe(gulp.dest(Path.temp))
})  

/* Fonts */

gulp.task('fonts', function() {
    // create an accumulated stream
    var fontStream = merge();
  
    fontStream.add(gulp.src(path.join(Path.css, 'fonts', 'maplestory', 'Maplestory_Light.ttf'))
                    .pipe(inlineFonts({ name: 'Maplestory', weight: 400, formats: ['ttf'] })));

    // an italic version
    fontStream.add(gulp.src(path.join(Path.css, 'fonts', 'maplestory', 'Maplestory_Bold.ttf'))
                    .pipe(inlineFonts({ name: 'Maplestory', weight: 700, formats: ['ttf']  })));


    return fontStream.pipe(concat('fonts.css')).pipe(gulp.dest(Path.css));
  });


gulp.task('js', function(){
    return code_syntax_js
        .pipe(gulp.src('./src/**/*.js'))
        .pipe(concat('app.js'))
        .pipe(minify()) 
        .pipe(gulp.dest(Path.temp))
}) 
 
gulp.task('markdown', function () {
    return gulp.src('./src/markdown/**/*.md')
        .pipe(markdown())
        .pipe(through.obj(async function(file, encoding, push){
            const extra_css = toStyle(await readFile(path.join(Path.temp, 'app.css')))
            const extra_js  = toScript(await readFile(path.join(Path.temp, 'app.js')))
            
            file.contents = Buffer.concat([
                //header
                Buffer.from(meta_tag_html),
                Buffer.from(extra_css),
                wrapContents(file.contents),
                Buffer.from(extra_js),
            ])
            push(null, file)
            
        }))
        .pipe(html_base64('./src/static/img'))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'))
})

gulp.task('reload', function(){
    return new Promise(resolve=>{
        setTimeout(_=>{
            web_socket && web_socket.send('reload')
            resolve()
        }, 10)
    })
})
 
 
gulp.task('watch', function () {
    gulp.watch(['./src/**/*.md'], gulp.series(['markdown', 'reload']))
    gulp.watch(['./src/**/*.scss'], gulp.series(['scss', 'markdown', 'reload']))
    gulp.watch(['./src/**/*.js'], gulp.series(['js','markdown', 'reload']))
})

gulp.task('default', gulp.series(['scss','js','markdown', 'watch']))


process.on('SIGINT', function() {
    server.close()
    shell.rm('-r', Path.temp)
})