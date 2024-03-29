//fahras page component

var { createComp, setFun, setSub, useCall, useSub, useRef } = $comp.func;

var comp = createComp(() => {
	setFun('post-init', () => {
		useCall('update', location)
	});
	setFun('route', (url) => {
		useCall('update', url)
	})
	setFun('update', (url) => {
		//get list
		var path = decodeURI(url.hash).slice(1).split('/');
		var cat = path[0];
		var list = globalObjects.indexes[cat]?.[path[1]];
		if(!list) list = path.reduce((obj, prop) => obj[prop], globalObjects);
		
		document.title = 'زاد العباد ليوم المعاد: ' + cat;
		var vname = globalObjects.vdata[cat]?.[0];
		
		var itemList = useRef('item-list')[0];
		
		//animate old
		[].forEach.call(itemList.children, 
			el => el.animate(
				[{opacity: 1}, {opacity: 0}],
				{duration: 250}
			).finished.then(() => el.remove())
		)
		
		//handle title
		var titleEl = useRef('title')[0];
		//old title, center and lay over
		if (titleEl.children.length) [].forEach.call(titleEl.children, child => {
			child.style.position = 'absolute';
			child.style.left = '50%';
			child.style.transform = 'translateX(-50%)';
			child.animate([{ opacity: 1 }, {opacity: 0}], {duration: 400})
			  .finished.then(() => child.remove());
		})
		
		//new title
		var newTitle = $el('<div>' + list.$name)[0];
		titleEl.append(newTitle);
		newTitle.animate(
			[{ opacity: 0 }, {opacity: 1}], 
			{duration: 400, delay: 100, fill: 'both'}
		);
		
		
		//generate list
		var items = Object.keys(list).filter(k => k !== '$name' && k !== '$ind').map(
			item => useSub('item', list[item], item, cat, vname)
		);
		itemList.prepend(...items);
		
		items.forEach((el, i) => setTimeout(() => {
			el.classList.remove('hide')
			el.animate([
				{ opacity: 0, transform: 'translateY(40px)' }, 
				{ opacity: 1, transform: 'translateY(0px)' }
			], { duration: 700, easing: 'ease-out', fill: 'both' })
		}, 300 + Math.min(i, 30) * 50));
		
		$comp.router.attachToDom();
	});
	
	setSub('item', {$isSub: true, fn: (view, type, item, name, cat, vname) => {
		if (item.$isButton)
			var el = $el(`<div class='item hide' onclick='globalObjects.fahrasBtns["${cat}"]["${item.name}"]()'>${name}</div>`)[0];
		else if (Array.isArray(item))
			var el = $el(`<div class='item hide'><a href='${item[0]}'>⦁ ${name}</a></div>`)[0];
		else if (typeof item === 'object') 
			var el = $el(`<div class='item cat hide'><a href='#${cat}/${item.$ind}'>${name}</a></div>`)[0];
		else var el = $el(`<div class='item hide'>
			<a href='./${vname}?cat=${cat}&id=${item}&title=${globalObjects.nameMap[name]}'>⦁ ${name}</a>
		</div>`)[0];
		return { el }
	}});
	return `<span>`
});

$comp.add('fahras', comp);