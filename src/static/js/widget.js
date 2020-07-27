//스크롤 게이지 설정
const scroll_gage_element = document.querySelector('#scroll-gage')
const html_element = document.querySelector('html')

window.addEventListener('scroll', function(){
    const entrie_height = html_element.offsetHeight - window.innerHeight 
    scroll_gage_element.innerText = `${Math.ceil(window.scrollY / entrie_height * 100) }%`
})

//앵커 설정
let root_count = 0
function castToHierarchyTree(tree){
    root_count ++
    if(tree.type == 'folder'){
        return `
            <li id="${root_count == 1 ? 'root' : ''}" class='${tree.type}' >
                ${tree.name}
                <ul>
                    ${tree.children.map(castToHierarchyTree).join('')}
                </ul>
            </li>
        `
    }else{
        return `
            <li class='${tree.type}'> 
                <a href="${tree.path}">${tree.name}</a>
            </li>
        ` 
    }
}

const tree_element = document.querySelector('#search-tree')
tree_element.innerHTML = castToHierarchyTree(JSON.parse(`#tree_json_literal#`))
