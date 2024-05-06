//download page compoment

var { createComp, setFun, useStore, useRef, use$ } = $comp.func;

var data = {
	style: {
		backImage: [-1,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39],
		shadowSize: {
			'صغير': 'small',
			'كبير': 'big'
		}
	}
};

var reverse = (obj) => {
	var cloned = {};
	for (let prop in obj) {
		if (typeof obj[prop] !== 'object') cloned[obj[prop]] = prop;
		else cloned[prop] = reverse(obj[prop])
	}
	return cloned
};
data.reverse = reverse(data); 

var byPath = (obj, path) => path.reduce((o,p) => o[p], obj);

var handleDataList = (id, obj) => use$('#' + id)[0].append(
	...Object.keys(obj).map(v => $el('option', { innerText: v })[0])
)

var comp = createComp(() => {
	setFun('init', () => {
		var store = useStore();
		store.ind = 0;
	})
	
	setFun('post-init', () => {
		var container = useRef('fsize-cont')[0];
		for (let i = 1; i < 100; i += 1) {
			let el = $el(`<div class=button style='font-size: ${i / 10}rem'>أهذا الحجم جيد`)[0];
			el.addEventListener('click', () => { fontMan.curSize = i / 10; fontMan.apply() });
			container.append(el)
		}
		
		//generate datalists
		handleDataList('shadow', data.style.shadowSize);
		
		//set inputs
		useRef('inp').forEach(el => {
			var path = el.getAttribute('prop').split('.');
			var value = byPath(setting, path);
			el.value = el.hasAttribute('map') ? byPath(data.reverse, path)[value] : value;
		});
	});
	
	setFun('setSetting', (el, path, value) => {
		path = path.split('.');
		var obj = byPath(setting, path.slice(0, -1));
		obj[path[path.length -1]] = value;
		localStorage.setItem('z-setting', JSON.stringify(setting))
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
	});
	
	setFun('fromInp', (el) => {
		var path = el.getAttribute('prop').split('.');
		var obj = byPath(setting, path.slice(0, -1));
		obj[path[path.length-1]] = el.hasAttribute('map') ? byPath(data, path)[el.value] : el.value;
		localStorage.setItem('z-setting', JSON.stringify(setting))
	});
	
	setFun('updateTheme', (el, fn) =>
		setTimeout(() => styleMan[fn](), 10)
	);
	
	return `<span>`
});

$comp.add('hallo', comp);