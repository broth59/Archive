//node
const fs = require('fs')
const path = require('path')
const WebSocketServer = require('ws').Server

//gulp
const gulp = require('gulp')
const through = require('through2')
const markdown = require('gulp-markdown-it')
const uglify = require('gulp-uglify')
const htmlmin = require('gulp-htmlmin')
const livereload = require('gulp-livereload')

//path
const Path = {}
Path.src = path.join(__dirname, 'src')
Path.dist = path.join(__dirname, 'dist')

Path.js  = path.join(__dirname, 'src', 'static', 'js')
Path.css = path.join(__dirname, 'src', 'static', 'css')

//static files
const code_syntax_js  = toScript(fs.readFileSync(path.join(Path.js, 'highlight.pack.js')))
const code_syntax_css = toStyle(fs.readFileSync(path.join(Path.css, 'styles', 'a11y-dark.css')))

const markdown_default_css = toStyle(fs.readFileSync(path.join(Path.css, 'styles', 'splendor.css')))

function toScript(js){
    return `<script>${js}</script>`
}
function toStyle(css){
    return `<style>${css}</style>`
}

function readFile(path, options){
    return new Promise((resolve,error)=>{
        fs.readFile(path, options, function(err, buffer){
            err && error()
            resolve(buffer.toString())
        })
    })
}

const server = new WebSocketServer({ port: 3211 });
let web_socket; 

server.on("connection", function(webSocket) {
    web_socket = webSocket
});

gulp.task('markdown', function () {
    return gulp.src('./src/**/*.md')
        .pipe(markdown())
        .pipe(through.obj(async function(file, encoding, push){    
            //extra js / css
            const extra_js  = toScript(await readFile(path.join(Path.js,  'apply.js'), { encoding: 'utf8' }))
            const extra_css = toStyle(await readFile(path.join(Path.css, 'apply.css'), { encoding: 'utf8' }))

            file.contents = Buffer.concat([
                Buffer.from(code_syntax_js),
                Buffer.from(code_syntax_css),
                Buffer.from(markdown_default_css),
                file.contents, 
                Buffer.from(extra_js),
                Buffer.from(extra_css),
            ])
            
            push(null, file)
        }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'))
        .pipe(livereload())
})

gulp.task('reload', function(){
    console.log('reload')
    return new Promise(resolve=>{
        resolve()
        if(web_socket) web_socket.send('hi')
    })
})

gulp.task('watch', function () {
    gulp.watch(['./src/**/*.md', './src/**/*.js','./src/**/*.scss',], gulp.series(['markdown', 'reload']))
})

gulp.task('default', gulp.series(['markdown', 'watch']))

