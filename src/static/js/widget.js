//스크롤 게이지 설정
const scroll_gage_element = document.querySelector('#scroll-gage')
const html_element = document.querySelector('html')

window.addEventListener('scroll', function () {
	const entrie_height = html_element.offsetHeight - window.innerHeight
	scroll_gage_element.innerText = `${Math.ceil((window.scrollY / entrie_height) * 100)}%`
})

const scroll_stack = []
function consumeScrollStack() {
	while (scroll_stack.length) {
		const distance = scroll_stack.shift()
		scrollTo(0, window.scrollY + distance)
	}
}

window.addEventListener('mousewheel', function (e) {
	if (!document.querySelector('#root').classList.contains('expanded')) {
		new Array(10).fill('').forEach(() => {
			scroll_stack.push(-e.wheelDeltaY / 10)
		})
		consumeScrollStack()
	}
})

window.addEventListener('touchstart', function (e) {})

//앵커 설정
let root_count = 0
function castToHierarchyTree(tree) {
	root_count++
	if (tree.type == 'folder') {
		return `
            <li id="${root_count == 1 ? 'root' : ''}" class='${tree.type}' >
                <label>${tree.name}</label>
                <ul>
                    ${tree.children.map(castToHierarchyTree).join('')}
                </ul>
            </li>
        `
	} else {
		return `
            <li class='${tree.type}'> 
                <a href="${tree.path}">${tree.name}</a>
            </li>
        `
	}
}

//트리 아카이브 설정
const tree_element = document.querySelector('#search-tree')
tree_element.innerHTML = castToHierarchyTree(JSON.parse(`#tree_json_literal#`))
;[document.getElementById('search-tree')].forEach((element) =>
	element.addEventListener('mousewheel', function (e) {
		const search_tree_element = document.getElementById('search-tree')
		const marginTop = parseInt(String(search_tree_element.style.marginTop || 0).match(/-?\d+/)[0])
		search_tree_element.style.marginTop = marginTop + e.wheelDeltaY / 5
	})
)

document.querySelector('#search-tree>#root>label').addEventListener('click', async function (e) {
	const class_name = 'expanded'
	const root_element = e.target.parentNode

	//pending
	root_element.classList.toggle('pending')
	if (root_element.classList.contains('pending')) await delay(300)
	root_element.classList.toggle(class_name)
	;(function expandElement(children) {
		if (children) {
			for (let child of children) {
				child.classList.toggle(class_name)
				expandElement(child.children)
			}
		}
	})([e.target.parentNode.children[1]])

	//백그라운드 컬러 조정
	document.querySelector('#background').classList.toggle(class_name)

	//main 태크 마진 맞추기
	const main_element = document.querySelector('main')
	const is_expanded = e.target.parentNode.classList.contains(class_name)
	const default_margin_top = '7em'
	main_element.style.marginTop = is_expanded ? `calc( ${window.scrollY}px + ${default_margin_top} + ${root_element.offsetHeight}px` : default_margin_top

	const html_element = document.querySelector('html')
	html_element.classList.toggle(class_name)
})
// document.querySelector('#search-tree>#root>label').click()

//라벨 설정
const label_element_list = [...document.querySelectorAll('#search-tree>#root li.folder>label')]
label_element_list.forEach((label_element) => {
	//클릭 이벤트
	label_element.addEventListener('click', function (e) {
		const unordered_element_list = [...e.target.parentNode.children]
		unordered_element_list.shift()

		for (const unordered_element of unordered_element_list) {
			const class_name = 'expanded'
			unordered_element.classList.toggle(class_name)

			const list_element_list = unordered_element.children
			for (const list_element of list_element_list) {
				list_element.classList.toggle(class_name)
				const anchor_element_list = list_element.children
				for (const anchor_element of anchor_element_list) {
					if (anchor_element.tagName == 'A') anchor_element.classList.toggle(class_name)
				}
			}
		}

		//main 태크 마진 맞추기
		const root_element = document.querySelector('#root')
		const main_element = document.querySelector('main')
		const default_margin_top = '7em'
		main_element.style.marginTop = `calc( ${window.scrollY}px + ${default_margin_top} + ${root_element.offsetHeight}px`
	})
})

//드래그방지
const tree_element_list = [...document.querySelectorAll('#search-tree, #search-tree *'), document.querySelector('#background')]
tree_element_list.forEach((tree_element) => {
	//드래그 방지
	tree_element.addEventListener('mousedown', function (event) {
		console.log('start')
		event.preventDefault()
		mouseDown = true
	})
	tree_element.addEventListener('touchstart', function (event) {
		console.log('start')
		event.preventDefault()
		mouseDown = true
	})
})

//async util
function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
}
