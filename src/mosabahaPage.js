//mosabaha page component

var { createComp, setFun, useCall, useStore, setSub, useComp } = $comp.func;

globalThis.mosabaha = JSON.parse(localStorage.getItem('mosabaha') || '{}');
var comp = createComp(() => {
	setFun('post-init', () => {
		useStore().list = Object.entries(mosabaha);
	})
	setFun('save', () => {
		localStorage.setItem('mosabaha', JSON.stringify(mosabaha));
		useStore().list = Object.entries(mosabaha);
	})
	setFun('add', async () => {
		var comp = useComp();
		var name = await createPrompt('إسم');
		mosabaha[name] = 0;
		comp.call('save')
	})
	setFun('inc', (el, name) => {
		mosabaha[name]++;
		useCall('save')
	});
	setFun('dec', (el, name) => {
		mosabaha[name]--;
		useCall('save')
	});
	setFun('remove', (el, name) => {
		delete mosabaha[name];
		useCall('save')
	});
	
	setSub('item', {$isSub: true, fn: (view, type, [name, nb]) => { return {
		el: $el(`<div id=item>
			${name}: ${nb}
			<span class=button r:on on(click):call='["inc", "${name}"]'>زد</span>
			<span class=button r:on on(click):call='["dec", "${name}"]'>أنقص</span>
			<span class=button r:on on(click):call='["remove", "${name}"]'>حذف</span>
		</div>`)[0]
	}}})
	
	return `<span>`
});

$comp.add('mosabaha', comp);