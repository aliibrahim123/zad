import { Component, create, query, registry, View } from "./libs.ts";
import type { Satisfies, BaseMap, CompOptions } from "./libs.ts";
import type { SectionOptions, Sections, Bab } from './base.ts';
import { $is, addToFavorites, getFahras, getRandomInd, prompt, searchHistory, sections } from "./base.ts";
import template from './templates/fahras.neo.html';

type TypeMap = Satisfies<BaseMap, {
	childmap: {},
	props: {
		title: string,
		bab: Bab,
		section: Sections,
		options: SectionOptions,
		button1Text: string,
		button2Text: string,
		button3Text: string
	},
	refs: {
		title: HTMLElement,
		path: HTMLElement,
		list: HTMLElement,
		toolbar: HTMLElement,
		'search-btn': HTMLElement,
		'download-btn': HTMLElement,
		'favorite-btn': HTMLElement,
		'button-1': HTMLElement,
		'button-2': HTMLElement,
		'button-3': HTMLElement,
	}
}>;

function prepareForSearch (str: string) {
	//remove harakat and normalize hamza
	return str
		.trim()
		.replaceAll(/[\u0617-\u061A\u064B-\u0652]/g, '')
		.replaceAll(/[ئءؤإأآ]/g, 'ا')
		.split(' ')
}
function testString (string: string, match: string[]) {
	//prepare text
	const text = prepareForSearch(string);

	//loop through text
	let matchInd = 0, curPart = match[0];
	for (const word of text) {
		//if matches
		if (word.includes(curPart)) {
			matchInd++;
			curPart = match[matchInd];
			if (matchInd === match.length) return true;
		}
	}
	return false
}

class Fahras extends Component<TypeMap> {
	static override defaults: CompOptions = {
		...Component.defaults,
		view: { 
			template: template.fahras,
			insertMode: View.insertMode.into,
			into: '#inner-container'
		}
	};
	override init() {
		this.store.add('title');
		this.store.add('bab');
		this.store.add('section');
		this.store.add('options');
		this.store.add('button1Text');
		this.store.add('button2Text');
		this.store.add('button3Text');

		this.initDom();

		this.update(location.hash.slice(1));

		this.fireInit();
	}
	onRoute (url: URL) {
		const animationSpeed = settings.style.core.animationSpeed;
		if (animationSpeed) {
			const container = this.query('#inner-container')[0].children[0];
			const oldShadow = container.cloneNode(true) as HTMLElement;
			oldShadow.classList.add('oldShadow');
			container.after(oldShadow);
			oldShadow.animate({ opacity: [1, 0] }, { duration: 300 * animationSpeed })
			  .finished.then(() => oldShadow.remove());

			container.animate({ opacity: [0, 1] }, { duration: 300 * animationSpeed });
		}

		this.update(url.hash.slice(1));
	}
	async update (id: string) {
		//parse id: section/bab
		const sep = id.indexOf('/');
		const section = id.slice(0, sep) as Sections;
		const options = sections[section];
		const babId = Number(id.slice(sep + 1));

		//get bab
		const fahras = await getFahras(section);
		const bab = fahras.get(babId) as Bab;
		this.set('bab', bab);
		this.set('section', section);
		this.set('options', options);
		this.set('title', bab.$name);
		
		//get path
		let path: Bab[] = [bab], curBab = bab;
		while (curBab.$parent) {
			curBab = curBab.$parent;
			path.push(curBab);
		}
		path.reverse();

		//update path element
		const pathEl = this.refs['path'][0];
		pathEl.replaceChildren();
		for (let ind = 0; ind < path.length; ind++) {
			const bab = path[ind];
			if (ind !== 0) pathEl.append('/');
			pathEl.append(create('a', { href: `#${section}/${bab.$ind}` }, bab.$name))
		}
		
		this.updateToolbar();
		
		//update list
		const animationSpeed = settings.style.core.animationSpeed;
		const list = this.refs['list'][0];
		list.replaceChildren();
		let ind = 0;
		for (const name in bab) if (name[0] !== '$') {
			const item = bab[name];
			let el: HTMLElement;
			
			//bab
			if ($is<Bab>(item) && item.$name)
				el = create('li', '.bab-item', create('a', name, { href: `#${section}/${item.$ind}` }));
			//link
			else if ($is<{link: string}>(item) && item.link)
				el = create('li', '.link-item', create('a', name, { href: item.link }));
			//scripted
			else if (typeof(item) === 'function') 
				el = create('li', '.item', name, { events: { click () { item(bab) } } });
			//item
			else el = create('li', '.item', create('a', name, 
				{ href: `./${options.viewer}.html#${options.dataFolder}/${item}` }
			));
			
			list.append(el);

			if (animationSpeed) el.animate([{
				opacity: 0,
				transform: 'translateY(1em)'
			}, {
				opacity: 1
			}], { 
				fill: 'backwards', easing: 'ease-out', 
				duration: 350 * animationSpeed,
				delay: (150 + Math.min(ind++, 30) * 75) * animationSpeed, 
				
			})
		}
	}
	updateToolbar () {
		const bab = this.get('bab');
		const section = this.get('section');
		const options = this.get('options');
		const toolbar = this.refs['toolbar'][0];

		//set button text
		if (options.fahrasBattons) {
			this.set('button1Text', options.fahrasBattons[0]?.name);
			this.set('button2Text', options.fahrasBattons[1]?.name);
			this.set('button3Text', options.fahrasBattons[2]?.name);
		}
		
		//toggle bottons visibility
		const hideDloadBtn = 
			options.contentPack === '' || bab.$meta?.downloadble === false;
		this.refs['download-btn'][0].classList.toggle('hide', hideDloadBtn);
		
		const hideSearchBtn = 
			options.searchable === false || bab.$meta?.searchable === false;
		this.refs['search-btn'][0].classList.toggle('hide', hideSearchBtn);
		
		const hideFavBtn = 
			options.favoritable === false || bab.$meta?.favoritable === false;
		this.refs['favorite-btn'][0].classList.toggle('hide', hideFavBtn);

		const showBtn1 = options.fahrasBattons?.[0]?.show(section, bab);
		this.refs['button-1'][0].classList.toggle('hide', !showBtn1);

		const showBtn2 = options.fahrasBattons?.[1]?.show(section, bab);
		this.refs['button-2'][0].classList.toggle('hide', !showBtn2);

		const showBtn3 = options.fahrasBattons?.[2]?.show(section, bab);
		this.refs['button-3'][0].classList.toggle('hide', !showBtn3);
		
		//toggle toolbar visibility
		toolbar.classList.toggle('hide', 
			hideDloadBtn && hideSearchBtn && hideFavBtn && !(showBtn1 || showBtn2 || showBtn3)
		);

		//readd separator 
		let lastShownBtn: HTMLElement = undefined as any;
		for (const el of query('.sep', toolbar)) el.remove();
		for (const el of Array.from(toolbar.children)) if (!el.classList.contains('hide')) {
			lastShownBtn = el as HTMLElement;
			el.after(create('span', '.sep', '|'));
		}
		if (lastShownBtn) lastShownBtn.nextElementSibling?.remove();
	}

	download () {
		const options = this.get('options');
		router.go(`./download.html#${options.contentPack}`)
	}
	addToFavorite () {
		addToFavorites(`.${location.pathname}${location.hash}`)
	}
	async search () {
		const bab = this.get('bab');
		const section = this.get('section');
		const fahras = await getFahras(section);

		//ask for the text to be matched with
		const text = prepareForSearch(await prompt('البحث عن'));
		if (text[0] === '') return;

		//create result bab
		const ind = getRandomInd(fahras);
		const resultBab: Bab = { 
			$ind: ind, $name: `نتائج بحث: ${text.join(' ')}`, $parent: bab, 
			$meta: { favoritable: false, searchable: false } 
		};
		fahras.set(ind, resultBab);
		
		//loop through babs
		const path: string[] = [];
		function walkBab (bab: Bab, includeInPath = true) {
			if (includeInPath) path.push(bab.$name);

			//loop through items
			for (const name in bab) if (name[0] !== '$') {
				//if match, add it
				if (testString(name, text)) 
					resultBab[path.length === 0 ? name : `${path.join('/')}/${name}`] = bab[name];
				//walk through if is bab
				if ($is<Bab>(bab[name]) && bab[name].$ind) walkBab(bab[name]);
			}

			if (includeInPath) path.pop();
		}
		walkBab(bab, false);

		//save to history and route to results
		searchHistory.push([ind, fahras]);
		router.go(`#${section}/${ind}`);
	}
	onButtonClick (ind: number) {
		this.get('options').fahrasBattons?.[ind].handle(this.get('section'), this.get('bab'))
	}
}

registry.add('fahras', Fahras);