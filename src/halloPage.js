//download page compoment

var { createComp, setFun, useStore, useRef } = $comp.func;

var comp = createComp(() => {
	setFun('init', () => {
		var store = useStore();
		store.ind = 0;
	})
	
	setFun('post-init', () => {
		var container = useRef('fsize-cont')[0];
		for (let i = 10; i < 100; i += 1) {
			let el = $el(`<div class=button style='font-size: ${i}px'>أهذا الحجم جيد`)[0];
			el.addEventListener('click', () => { fontMan.curSize = i; fontMan.apply() });
			container.append(el)
		}
	});
	
	setFun('next', () => {
		var store = useStore();
		var ind = store.ind;
		var sections = useRef('section');
		if (ind < (sections.length -1)) {
			sections[ind].animate({ width: ['100%', '0%'] }, {duration: 500, fill: 'both' });
			sections[ind +1].animate({ width: ['0%', '100%'] }, {duration: 500, fill: 'both' });
			store.ind = ind +1
		}
		else $comp.router.go('../index.html');
	})
	
	return `<span>`
});

$comp.add('hallo', comp);