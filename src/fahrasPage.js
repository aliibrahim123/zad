//fahras page component

var { createComp, setFun, useState, useCall, useComp, useEl } = $comp.func;

var comp = createComp(() => {
	setFun('update', () => {
		//get list
		var [path] = useState('path');
		var list = path.reduce((curObj, path) => curObj[path], globalObjects);
		lastFahrasPath = path.concat();
		
		//generate list
		var items = Object.keys(list).map(
			item => $el(`<div class='item hide ${typeof list[item] === 'object' ? 'cat' : ''}' use:on on(click):call='["change", "${item}"]'>
				${typeof list[item] === 'object' ? '' : '⦁ '}${item}`)[0]
		);
		items.unshift(
			$el(`<div id=title class=hide>${path[path.length -1]}`)[0],
			$el(`<div id=back class='item hide' use:on on(click):call='["back"]'>رجوع`)[0]
		);
		
		//animate old
		Array.from($el('#content')[0].children).forEach(
			el => el.animate(
			  [{opacity: '1'}, {opacity: '0'}]
			, {duration: 250})
			  .finished.then(() => el.remove())
		)
		
		//animate new
		$el('#content')[0].append(...items);
		items.forEach((el, i) => setTimeout(
			() => {
				el.animate(
					[{opacity: '0', transform: 'translateY(40px)'}, {transform: 'translateY(0px)'}], 
					{duration: 700, easing: 'ease-out'}
				);
				el.classList.remove('hide')
			}, Math.min(i * 50, 1000) + 250)
		)
		
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
		
		//get list
		var list = path.reduce((curObj, path) => curObj[path], globalObjects);
		
		//case link
		if (Array.isArray(list)) return $comp.router.go(list[0]);
		
		//case category
		if (typeof list === 'object') return useCall('update');
		
		//case item
		$comp.router.go(`./${useState('v-name')[0]}viewer.html?id=${list}&title=${item}`);
	})
	
	return `<span>`
}, () => {
	var [path] = useState('path', []);
	var catname = $el('#main')[0].getAttribute('cat');
	
	var pathUrlSearch = new URL(location).searchParams.get('path');
	
	if (lastFahrasPath[0] === catname) path.push(...lastFahrasPath);
	else if (pathUrlSearch) path.push(catname, ...pathUrlSearch.split('/'));
	else path.push(catname);
	
	useState('v-name', $el('#main')[0].getAttribute('v-name') || '');
		
	useCall('update')
});

$comp.add('fahras', comp);