//스크롤 게이지 설정
const scroll_gage_element = document.querySelector('#scroll-gage')
const html_element = document.querySelector('html')

window.addEventListener('scroll', function(){
    const entrie_height = html_element.offsetHeight - window.innerHeight 
    scroll_gage_element.innerText = `${Math.ceil(window.scrollY / entrie_height * 100) }%`
})