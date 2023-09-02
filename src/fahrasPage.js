//fahras page component

var { createComp, setFun, useState, useCall, useComp, useEl } = $comp.func;

var comp = createComp(() => {
	setFun('update', () => {
		//get list
		var [path] = useState('path');
		var list = path.reduce((curObj, path) => curObj[path], globalObjects);
		
		//generate list
		var items = Object.keys(list).map(
			item => $el(`<div class=item use:on on(click):call='["change", "${item}"]'>${item}`)[0]
		);
		items.unshift(
			$el(`<div id=title>${path[path.length -1]}`)[0],
			$el(`<div id=back class=item use:on on(click):call='["back"]'>رجوع`)[0]
		);
		$el('#content')[0].replaceChildren(...items);
		
		//walk throught elements
		useComp().walk()
	});
	
	setFun('back', () => {
		var [path] = useState('path');
		if (path.length === 1) return;
		path.pop();
		useCall('update')
	});
	
	setFun('change', (el, item) => {
		var [path] = useState('path');
		path.push(item);
		var list = path.reduce((curObj, path) => curObj[path], globalObjects);
		if (typeof list === 'object') return useCall('update');
		$comp.router.go('./' + useState('v-name')[0] + 'viewer.html?id=' + list + '&title=' + item + 
			(useEl().getAttribute('v-type') ? '&type=' + useEl().getAttribute('v-type') : '')
		);
	})
	
	return `<span>`
}, () => {
	var [path] = useState('path', []);
	path.push($el('#main')[0].getAttribute('cat'));
	useState('v-name', $el('#main')[0].getAttribute('v-name') || '');
		
	useCall('update')
});

$comp.add('fahras', comp);