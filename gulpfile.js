//node
const fs = require('fs')
const path = require('path')

//gulp
const gulp = require('gulp')
const through = require('through2')
const markdown = require('gulp-markdown-it')
const uglify = require('gulp-uglify')

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
        .pipe(gulp.dest('./dist'))
})

gulp.task('watch', function () {
    return gulp.watch('./src/*.md', gulp.series(['markdown']))
})

gulp.task('default', gulp.series(['markdown', 'watch']))
