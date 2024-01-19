//quran viewer page component

var { createComp, setFun, useCall, useStore, useRef } = $comp.func;

var { pageToSor, sormap, sorToInd, indToSor } = globalObjects.quranHelpers;

var comp = createComp(() => {
	setFun('init', () => {
		//parse url
		var [soraInd, page] = new URL(location).searchParams.get('id').split('/');
	
		//set init state
		var store = useStore();
		store.page = Number(page);
		store.soraInd = Number(soraInd);
		store.sora = '';
		store.part = 1;
		store.lastClick = 0;
	}) 
	setFun('post-init', () => {
		useCall('update')
	})
	setFun('route', (url) => {
		var [soraInd, page] = new URL(url).searchParams.get('id').split('/');
	
		var store = useStore();
		store.page = Number(page);
		store.soraInd = Number(soraInd);
		
		useCall('update')
	})
	setFun('update', async (url) => {
		var store = useStore();
		var page = store.page;
		var soraInd = store.soraInd;
		var lastClick = store.lastClick;
		store.lastClick = Date.now()
		
		var contentEl = useRef('content')[0];
		
		//get page
		var content = await fetch(`./data/quran/${soraInd}/${page}.txt`).then(r => r.text());
		
		//update meta
		store.sora = indToSor[soraInd];
		store.part = page === 1 ? 1 : Math.min(Math.ceil((page -1) / 20), 30);
		
		//handle quick navigation
		if (Date.now() - lastClick < 750) {
			var el = $el('div')[0];
			el.innerText = content;
			contentEl.replaceChildren(el)
		}
		
		else {
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
			newEl.innerText = content;
			contentEl.append(newEl);
			newEl.animate([{ opacity: 0 }, { opacity: 1 }], {duration: 400});
		}
	});
	
	setFun('decFont', () => fontMan.decSize());
	setFun('incFont', () => fontMan.incSize());
	
	setFun('prevPage', () => {
		var store = useStore();
		var page = Math.max(store.page -1, 1);
		if (sormap[store.sora][0] > page) {
			store.page = sormap[indToSor[store.soraInd -1]][1];
			store.soraInd = store.soraInd -1
		}
		else store.page = page;
		useCall('update')
	});
	
	setFun('nextPage', () => {
		var store = useStore();
		var page = Math.min(store.page +1, 604);
		if (sormap[store.sora][1] < page) {
			store.page = sormap[indToSor[store.soraInd +1]][0];
			store.soraInd = store.soraInd +1
		}
		else store.page = page;
		useCall('update')
	});
	
	setFun('prevSora', () => {
		var store = useStore();
		var soraInd = Math.max(store.soraInd - 1, 1);
		store.soraInd = soraInd;
		store.page = sormap[indToSor[soraInd]][0];
		useCall('update')
	});
	
	setFun('nextSora', () => {
		var store = useStore();
		var soraInd = Math.min(store.soraInd + 1, 114);
		store.soraInd = soraInd;
		store.page = sormap[indToSor[soraInd]][0];
		useCall('update')
	});
	
	setFun('showMarkers', () => {
		$el('#markers')[0].classList.remove('hide');
		$el('#markers')[0].open = true
	});
	setFun('setMarker', (el) => {
		var { page, soraInd } = useStore();
		globalObjects['قرآن']['علامة'][el.innerText] = soraInd + '/' + page;
		localStorage.setItem('z-markers', JSON.stringify(globalObjects['قرآن']['علامة']));
		$el('#markers')[0].open = false
	});
	
	setFun('tafseer', () => {
		var { page, soraInd } = useStore();
		var index = `${soraInd}/${page}`;
		if (index !== new URL(location).searchParams.get('id')) $comp.router.go(`./q-viewer.html?id=${index}#${Math.random()}`);
		setTimeout(() => $comp.router.go(`./viewer.html?cat=تفسير&id=${index}&title=صفحة (${page})`), 500)
	})
	
	return `<span>`
});

$comp.add('viewer-quran', comp);