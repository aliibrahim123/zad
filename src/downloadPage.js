//download page compoment

var { createComp, setFun, useStore, setSub } = $comp.func;

var comp = createComp(() => {
	setFun('init', () => {
		var store = useStore();
		store.list = globalObjects.cpacks;
	})
	
	setFun('download', (el, file) => {
		//create popup
		var popup = $el('<div class=popup>بدأ التنزيل')[0];
		document.body.append(popup);
		popup.animate([{opacity: 0}, {opacity:1}], {duration: 500});
		
		//handle message
		var fn = e => {
			var data = e.data, phase = data[0];
			if (phase === 'c-fetched') popup.innerText = 'تم التنزيل';
			if (phase === 'c-extracted') popup.innerText = 'تم فك الضغط';
			if (phase === 'c-process') popup.innerText = `تم تنزيل ${data[3]}/${data[2]}`;
			if (phase === 'c-finished') {
				popup.innerText = `تم الانتهاء`;
				popup.animate([{opacity: 1}, {opacity:0}], {duration: 500, delay: 1000})
				  .finished.then(() => popup.remove());
				navigator.serviceWorker.removeEventListener('message', fn);
			}
		};
		navigator.serviceWorker.addEventListener('message', fn);
		
		//post cache message
		navigator.serviceWorker.controller.postMessage([file])
	})
	
	setSub('item', { $isSub: true, fn: (view, type, [name, file]) => {
		return { el: $el(`<div class=button r:on on(click):call='["download", "${file}"]'>${name}`)[0] }
	} })
	
	return `<span>`
});

$comp.add('download', comp);