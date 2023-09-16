//viewer page component

var { createComp, setFun, use$, useComp, useCall, useStore } = $comp.func;

var { pageToSor, sormap, sorToInd, indToSor } = globalObjects.quranHelpers;

var splitContent = (content) => content.reduce((obj, cur, i) => {
	if (i === 0) obj.arrs.push(obj.curArr);
	obj.curArr.push(cur);
	obj.curLen += cur[0].length;
	if (obj.curLen > 3000 || obj.curArr.length === 20) {
		obj.curArr = [];
		obj.arrs.push(obj.curArr);
		obj.curLen = 0
	}
	return obj
}, {
	arrs: [],
	curArr: [],
	curLen: 0
}).arrs.filter(v => v.length)

var comp = createComp(() => {
	setFun('init', async () => {
		//get url
		var comp = useComp();
		var url = new URL(location);
		var id = url.searchParams.get('id');
		var title = url.searchParams.get('title');
		var cat = $el('#main')[0].getAttribute('cat');
		var type = $el('#main')[0].getAttribute('v-type') || 'json';
		
		//fetch content
		$el('#title')[0].innerText = title;
		if (type === 'obj') var content = globalObjects[cat][id];
		else if (type === 'txt') var content = [await fetch(`../data/${cat}/${id}.txt`).then(i => i.text())];
		else if (type === 'html') var content = [await fetch(`../data/${cat}/${id}.html`).then(i => i.text())];
		else var content = await fetch(`../data/${cat}/${id}.json`).then(i => i.json());
		
		//case of multi item content
		$comp.func.push(comp);
		if (Array.isArray(content[0])) {
			let store = useStore();
			store.content = splitContent(content);
			store.ind = 0;
			$el.chain('#source').hide();
			useCall('updateItems');
		}
		
		//case of uni item content
		else {
			$el.chain('#prev').hide();
			$el.chain('#next').hide();
			if (content[1]) $el('#source')[0].innerText = 'مصدر: ' + content[1];
			else $el.chain('#source').hide();
			if (type === 'html' || type === 'ihtml') $el('#sub-content')[0].innerHTML = content[0];
			else $el('#sub-content')[0].innerText = content[0];
		}
		
		//animate
		$el('#sub-content')[0].animate(
			[{opacity: '0', transform: 'translateY(40px)'}, {transform: 'translateY(0px)'}]
		, {duration: 700})
		$comp.func.pop()
	});
	
	setFun('updateItems', () => {
		var { ind, content } = useStore();
				
		$el('#sub-content')[0].innerText = '\n' + content[ind].map(
			i => i[0] + (i[1] ? '\nمصدر: ' + i[1] : '')
		).join('\n----------------------\n\n')
	});
	
	setFun('prev', () => {
		var store = useStore();
		store.ind = Math.max(0, store.ind -1);
		useCall('updateItems')
	});
	setFun('next', () => {
		var store = useStore();
		store.ind = Math.min(store.content.length -1, store.ind +1);
		useCall('updateItems')
	});
	
	setFun('decFont', () => fontMan.decSize());
	setFun('incFont', () => fontMan.incSize());
	setFun('changeFont', () => fontMan.changeFont());
	
	return `<span>`
}, () => {
	
});

$comp.add('viewer', comp);