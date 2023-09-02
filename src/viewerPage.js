//viewer page component

var { createComp, setFun, use$, useComp, useCall, useStore } = $comp.func;

var { pageToSor, sormap, sorToInd, indToSor } = globalObjects.quranHelpers;

var comp = createComp(() => {
	setFun('init', async () => {
		//get url
		var comp = useComp();
		var url = new URL(location);
		var id = url.searchParams.get('id');
		var title = url.searchParams.get('title');
		var type = url.searchParams.get('type') || 'json';
		
		//fetch content
		$el('#title')[0].innerText = title;
		if (type === 'txt') var content = [await fetch(`../data/${$el('#main')[0].getAttribute('cat')}/${id}.txt`).then(i => i.text())];
		else var content = await fetch(`../data/${$el('#main')[0].getAttribute('cat')}/${id}.json`).then(i => i.json());
		
		//case of multi item content
		$comp.func.push(comp);
		if (Array.isArray(content[0])) {
			let store = useStore();
			store.content = content;
			store.ind = 0;
			$el.chain('#source').hide();
			useCall('updateItems');
		}
		
		//case of uni item content
		else {
			$el.chain('#prev').hide();
			$el.chain('#next').hide();
			if (content[1]) $el('#source')[0].innerText = content[1];
			else $el.chain('#source').hide();
			$el('#sub-content')[0].innerText = content[0];
		}
		$comp.func.pop()
	});
	
	setFun('updateItems', () => {
		var { ind, content } = useStore();
		
		$el('#sub-content')[0].innerText = '\n' + content.slice(ind * 20, (ind +1) * 20).map(
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
		store.ind = Math.min(Math.ceil(store.content.length / 20) -1, store.ind +1);
		useCall('updateItems')
	});
	
	setFun('decFont', () => fontMan.decSize());
	setFun('incFont', () => fontMan.incSize());
	setFun('changeFont', () => fontMan.changeFont());
	
	return `<span>`
}, () => {
	
});

$comp.add('viewer', comp);