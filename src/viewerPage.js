//viewer page component

var { createComp, setFun, useComp, useCall, useStore, useRef } = $comp.func;

//split content of multiple item into pages
var maxLen = 7000;
var maxNb = 25;
var splitContent = (content) => content.reduce((obj, cur, i) => {
	if (i === 0) obj.arrs.push(obj.curArr);
	obj.curArr.push(cur);
	obj.curLen += cur[0].length;
	if (obj.curLen > maxLen || obj.curArr.length === maxNb) { //new page
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
	setFun('init', () => {
		var store = useStore();
		store.source = '';
		store.title = '';
		store.page = 0;
		store.isMulti = false;
	})
	setFun('post-init', async () => {
		var comp = useComp();
		var store = useStore();
		
		//get metadata
		var url = new URL(location);
		var cat = url.searchParams.get('cat');
		var id = url.searchParams.get('id');
		var title = url.searchParams.get('title');
		
		var [vname, folder, type] = globalObjects.vdata[cat];
		
		document.title = 'زاد العباد ليوم المعاد: ' + cat;
		store.title = globalObjects.names[title];
		store.contentType = type;
		
		//fetch content
		if (type === 'obj') var content = globalObjects[folder][id];
		else if (type === 'txt') var content = [await fetch(`./data/${folder}/${id}.txt`).then(i => i.text())];
		else if (type === 'html') var content = [await fetch(`./data/${folder}/${id}.html`).then(i => i.text())];
		else var content = await fetch(`./data/${folder}/${id}.json`).then(i => i.json());
		
		//case of multi item content
		$comp.func.push(comp);
		if (Array.isArray(content[0])) {
			store.isMulti = true;
			store.allContent = splitContent(content);
			store.ind = 0;
			useCall('updateItems');
			return
		}
		
		//case of uni item content
		store.source = content[1];
		store.content = content[0];
		useCall('update')
		
		$comp.func.pop()
	});
	
	setFun('update', () => {
		var { content, contentType } = useStore();
		var contentEl = useRef('content')[0];
		
		//handle old
		[].forEach.call(contentEl.children, child => {
			child.style.position = 'absolute';
			child.style.overflow = 'hidden';
			child.style.height = '75%';
			child.animate([{ opacity: 1 }, { opacity: 0 }], {duration: 400})
			.finished.then(() => child.remove())
		});
		
		//handle new
		var newEl = $el('div')[0];
		if (Array.isArray(content)) newEl.append(...content.map(item => {
			var el = $el(`<div class=item>`)[0];
			if (contentType === 'html' || contentType === 'ihtml') el.innerHTML = item;
			else el.innerText = item;
			return el
		}));
		
		else {
			if (contentType === 'html' || contentType === 'ihtml') newEl.innerHTML = content;
			else newEl.innerText = content;
		}
		contentEl.append(newEl);
		newEl.animate([{ opacity: 0 }, { opacity: 1 }], {duration: 400});
	})
	
	setFun('updateItems', () => {
		var store = useStore();
		store.page = store.ind +1;
		
		store.content = store.allContent[store.ind].map(
			item => item[0] + (item[1] ? '\nمصدر: ' + item[1] : '')
		);
		
		useCall('update')
	});
	
	setFun('prev', () => {
		var store = useStore();
		store.ind = Math.max(0, store.ind -1);
		useCall('updateItems')
	});
	setFun('next', () => {
		var store = useStore();
		store.ind = Math.min(store.allContent.length -1, store.ind +1);
		useCall('updateItems')
	});
	
	setFun('decFont', () => fontMan.decSize());
	setFun('incFont', () => fontMan.incSize());
	setFun('changeFont', () => fontMan.changeFont());
	
	setFun('addToFavorite', async () => {
		var name = await createPrompt('الاسم:');
		globalObjects['المفضلة'][name] = [location.href];
		localStorage.setItem('z-favorite', JSON.stringify(globalObjects['المفضلة']));
	});
	
	return `<span>`
});

$comp.add('viewer', comp);