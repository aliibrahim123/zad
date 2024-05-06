//fahras page component

var { createComp, setFun, setSub, useCall, useSub, useRef, useStore } = $comp.func;

var search = (obj, name, founded, path) => {
	for (let prop in obj) {
		var value = obj[prop];
		if (prop.includes(name)) founded[path.concat(prop).join('/')] = [value, prop];
		if (typeof value === 'object' && !Array.isArray(value) && !value.$hidden) {
			path.push(prop);
			search(value, name, founded, path);
			path.pop()
		}
	}
}

var comp = createComp(() => {
	setFun('post-init', () => {
		useCall('update', location)
	});
	setFun('route', (url) => {
		useCall('update', url)
	});
	setFun('search', async () => {
		var { list: root, cat } = useStore();
		
		//prompt name
		var name = await createPrompt('الإسم');
		
		//search
		var list = { $name: `نتائج '${name}'` };
		search(root, name, list, []);
		
		//put in search obj
		var searchObj = globalObjects[cat]['بحث'];
		var ind = searchObj.ind++;
		if (ind === 7) searchObj.ind = 0;
		searchObj[ind] = list;
		
		//route
		var url = new URL(location);
		url.hash = encodeURI(`${cat}/بحث/${ind}`);
		$comp.router.go(url.toString())
	});
	
	setFun('update', (url) => {
		//get list
		var path = decodeURI(url.hash).slice(1).split('/');
		var cat = path[0];
		var list = globalObjects.indexes[cat]?.[path[1]];
		if (!list) list = path.reduce((obj, prop) => obj[prop], globalObjects);
		useStore().list = list;
		useStore().cat = cat;
		
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
		//hidden
		if (item.$hidden) var el = $el('<div>')[0];
		
		//button
		else if (item.$isButton)
			var el = $el(`<div class='item hide' onclick='globalObjects.fahrasBtns["${cat}"]["${item.name}"]()'>${name}</div>`)[0];
		
		//[link] link
		else if (item?.length === 1)
			var el = $el(`<div class='item hide'><a href='${item[0]}'>⦁ ${name}</a></div>`)[0];
		
		//[id, name]
		else if (item?.length === 2) var el = $el(`<div class='item hide'>
			<a href='./${vname}?cat=${cat}&id=${item[0]}&title=${globalObjects.nameMap[item[1]]}'>⦁ ${name}</a>
		</div>`)[0];
		
		//group
		else if (typeof item === 'object') 
			var el = $el(`<div class='item cat hide'><a href='#${cat}/${item.$ind}'>${name}</a></div>`)[0];
		
		//item
		else var el = $el(`<div class='item hide'>
			<a href='./${vname}?cat=${cat}&id=${item}&title=${globalObjects.nameMap[name]}'>⦁ ${name}</a>
		</div>`)[0];
		return { el }
	}});
	return `<span>`
});

$comp.add('fahras', comp);