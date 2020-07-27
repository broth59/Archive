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
                <label>${tree.name}</label>
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

document.querySelector('#search-tree>#root>label').addEventListener('click', function(e){
    const class_name = 'expanded'; 
    const root_element = e.target.parentNode
    root_element.classList.toggle(class_name);
  
    (function expandElement(children){
        if(children){
            for(let child of children){
                child.classList.toggle(class_name)
                expandElement(child.children)
            }
        }
    })([ e.target.parentNode.children[1] ])

    //백그라운드 컬러 조정
    // document.querySelector('#background').classList.toggle(class_name);
    
    //main 태크 마진 맞추기
    const main_element = document.querySelector('main')
    const is_expanded = e.target.parentNode.classList.contains(class_name)
    const default_margin_top = '7em'
    main_element.style.marginTop = is_expanded ? `calc( ${window.scrollY}px + ${default_margin_top} + ${root_element.offsetHeight}px` : default_margin_top 

})
// document.querySelector('#search-tree>#root>label').click()

const label_element_list = [ ...document.querySelectorAll('#search-tree>#root li.folder>label') ]
label_element_list.forEach(label_element=>{
    label_element.addEventListener('click', function(e){
        const unordered_element_list = [ ...e.target.parentNode.children ]    
        unordered_element_list.shift()
    
        for(const unordered_element of unordered_element_list){
            const class_name = 'expanded'
            unordered_element.classList.toggle(class_name)
            
            const list_element_list = unordered_element.children
            for(const list_element of list_element_list){
                list_element.classList.toggle(class_name)
                const anchor_element_list = list_element.children
                for(const anchor_element of anchor_element_list){
                    if(anchor_element.tagName == 'A')anchor_element.classList.toggle(class_name)
                }
            }    
        }
    })
})
