//quran viewer page component

var { createComp, setFun, use$, useCall, useStore } = $comp.func;

var { pageToSor, sormap, sorToInd, indToSor } = globalObjects.quranHelpers;

var comp = createComp(() => {
	setFun('update', async (url) => {
		$el('#main')[0].style.backgroundColor = 'rgba(0, 0, 0, 0.87)';
		var store = useStore();
		var page = store.page;
		var soraInd = store.sora;
		var lastClick = store.lastClick;
		var textEl = $el('#sub-content')[0];
		
		store.lastClick = Date.now();
		
		//clone page
		var old = textEl.cloneNode(true);
		
		//get page
		var content = await fetch(`../data/quran/${soraInd}/${page}.txt`).then(r => r.text());
		
		//update page
		textEl.innerText = content;
		
		//update meta
		$el('#sora')[0].innerText = indToSor[soraInd];
		$el('#page')[0].innerText = page;
		$el('#part')[0].innerText = `جزأ: ${page === 1 ? 1 : Math.min(Math.ceil((page -1) / 20), 30)}`;
		
		//handle quick navigation
		if (Date.now() - lastClick < 1500) return;
		//animate old
		old.id = '';
		old.style.top = 0;
		$el('#content')[0].append(old);
		old.animate([{opacity: 1}, {opacity: 0}], {duration: 400}).finished.then(
			() => old.remove()
		);
		
		//animate new
		textEl.animate([{opacity: 0}, {opacity: 0, offset: 0.4}, {opacity: 1}], {duration: 500});
	});
	
	setFun('decFont', () => fontMan.decSize());
	setFun('incFont', () => fontMan.incSize());
	
	setFun('prevPage', () => {
		var store = useStore();
		var page = Math.max(store.page -1, 1);
		if (sormap[indToSor[store.sora]][0] > page) {
			store.page = sormap[indToSor[store.sora -1]][1];
			store.sora = store.sora -1
		}
		else store.page = page;
		useCall('update')
	});
	
	setFun('nextPage', () => {
		var store = useStore();
		var page = Math.min(store.page +1, 604);
		if (sormap[indToSor[store.sora]][1] < page) {
			store.page = sormap[indToSor[store.sora +1]][0];
			store.sora = store.sora +1
		}
		else store.page = page;
		useCall('update')
	});
	
	setFun('prevSora', () => {
		var store = useStore();
		var soraInd = Math.max(store.sora - 1, 1);
		store.sora = soraInd;
		store.page = sormap[indToSor[soraInd]][0];
		useCall('update')
	});
	
	setFun('nextSora', () => {
		var store = useStore();
		var soraInd = Math.min(store.sora + 1, 114);
		store.sora = soraInd;
		store.page = sormap[indToSor[soraInd]][0];
		useCall('update')
	});
	
	setFun('showMarkers', () => {
		$el('#markers')[0].classList.remove('hide');
		$el('#markers')[0].open = true
	});
	setFun('setMarker', (el) => {
		var { page, sora } = useStore();
		globalObjects['قرآن']['علامة'][el.innerText] = sora + '/' + page;
		localStorage.setItem('z-markers', JSON.stringify(globalObjects['قرآن']['علامة']));
		$el('#markers')[0].open = false
	});
	
	setFun('tafseer', () => {
		var { page, sora } = useStore();
		$comp.router.go(`../tafseer/viewer.html?id=${sora}/${page}&title=صفحة (${page})`)
	})
	
	return `<span>`
}, () => {
	//parse url
	var [soraInd, page] = new URL(location).searchParams.get('id').split('/');
	
	//store page and sora
	var store = useStore();
	store.page = Number(page);
	store.sora = Number(soraInd);
	
	//update
	useCall('update')
});

$comp.add('viewer-quran', comp);