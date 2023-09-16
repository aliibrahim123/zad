//mosabaha page component

var { createComp, setFun, useCall, useComp } = $comp.func;

globalThis.mosabaha = JSON.parse(localStorage.getItem('mosabaha')) || {};
var comp = createComp(() => {
	setFun('update', () => {
		$el('#items')[0].replaceChildren(...Object.keys(mosabaha).map(name => 
			$el(`<div id=item>
				${name}: ${mosabaha[name]}
				<span class=button use:on on(click):call='["inc", "${name}"]'>زد</span>
				<span class=button use:on on(click):call='["dec", "${name}"]'>أنقص</span>
				<span class=button use:on on(click):call='["remove", "${name}"]'>حذف</span>
			</div>`)[0]
		));
		useComp().walk();
	});
	setFun('add', () => {
		var name = prompt('إسم');
		mosabaha[name] = 0;
		localStorage.setItem('mosabaha', JSON.stringify(mosabaha));
		useCall('update')
	})
	setFun('inc', (el, name) => {
		mosabaha[name]++;
		localStorage.setItem('mosabaha', JSON.stringify(mosabaha));
		useCall('update')
	});
	setFun('dec', (el, name) => {
		mosabaha[name]--;
		localStorage.setItem('mosabaha', JSON.stringify(mosabaha));
		useCall('update')
	});
	setFun('remove', (el, name) => {
		delete mosabaha[name];
		localStorage.setItem('mosabaha', JSON.stringify(mosabaha));
		useCall('update')
	});
	
	return `<span>`
}, () => {
	useCall('update')
});

$comp.add('mosabaha', comp);