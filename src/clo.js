function make() {
	const list = []
	for (let i = 0; i < 10; i++) {
		list.push(function () {
			console.log(i)
		})
		list.pop()()
	}

	return list
}

make()
