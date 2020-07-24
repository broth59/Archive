//Syntax Highlight 적용
document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('pre code').forEach((block) => {
        block.setAttribute('data-lang', block.className.split('-').pop())
        hljs.highlightBlock(block)
    })          
    
})          
