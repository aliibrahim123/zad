import { Component, create, query, registry } from "./libs.ts";
import type { BaseMap, CompOptions } from "./libs.ts";
import type { SectionOptions, Sections, Bab } from './base.ts';
import { $is, addToFavorites, getFahras, getRandomInd, prompt, currentSearches, sections, searchHistory, addSearchEntry } from "./base.ts";
import template from './templates/fahras.neo.html';
import { prepareForSearch, testString } from "./base.ts";

interface TypeMap extends BaseMap {
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
};

class Fahras extends Component<TypeMap> {
	static override defaults: CompOptions = {
		...Component.defaults,
		view: { 
			template: template.fahras,
			insertMode: 'into',
			into: '#inner-container'
		},
		store: {
			addUndefined: true
		}
	};
	override init() {
		this.section = this.signal('section', {} as any);
		this.bab = this.signal('bab', {} as any);
		this.sectionOptions = this.signal('options', {} as any);
		this.initDom();

		this.update(location.hash.slice(1));

		this.fireInit();
	}
	section = this.signal('section');
	bab = this.signal('bab');
	sectionOptions = this.signal('options');
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
		this.bab.value = bab;
		this.section.value = section;
		this.sectionOptions.value = options;

		//set title
		this.set('title', bab.$name);
		document.title = `زاد العباد ليوم المعاد: ${options.arabicName}`;
		
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
			
			//contruct item
			//bab
			if ($is<Bab>(item) && item.$name)
				el = create('li', '.bab-item', create('a', name, { href: `#${section}/${item.$ind}` }));
			//link
			else if ($is<{link: string}>(item) && item.link && typeof(item.link) === 'string')
				el = create('li', '.link-item', create('a', name, { href: item.link }));
			//scripted
			else if (typeof(item) === 'function') 
				el = create('li', '.item', name, { events: { click () { item(bab) } } });
			//item
			else el = create('li', '.item', create('a', name, 
				{ href: `./${options.viewer}.html#${options.dataFolder}/${item}` }
			));
			
			list.append(el);

			//update animation
			if (animationSpeed) el.animate([
			  {	opacity: 0,	transform: 'translateY(1em)' }, 
			  { opacity: 1 }
			], { 
			  fill: 'backwards', easing: 'ease-out', 
			  duration: 350 * animationSpeed,
			  delay: (150 + Math.min(ind++, 30) * 75) * animationSpeed, 	
			})
		}

		//reatach router
		router.attachToDom();
	}
	updateToolbar () {
		const bab = this.bab.value;
		const section = this.section.value;
		const options = this.sectionOptions.value;
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
		const options = this.sectionOptions.value;
		router.go(`./download.html#${options.contentPack}`)
	}
	addToFavorite () {
		addToFavorites(location.toString())
	}
	async search () {
		const bab = this.bab.value;
		const section = this.section.value;
		const fahras = await getFahras(section);

		//ask for the text to be matched with
		const text = prepareForSearch(await prompt('البحث عن', (container, input) => {
			const datalist = create('datalist', '#search-history', 
			  ...searchHistory.map(name => create('option', { value: name }))
			);
			input.setAttribute('list', datalist.id);
			container.append(datalist);
		}));
		if (text[0] === '') return;
		addSearchEntry(text.join(' '));

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
		currentSearches.push([ind, fahras]);
		router.go(`#${section}/${ind}`);
	}
	onButtonClick (ind: number) {
		this.sectionOptions.value.fahrasBattons?.[ind]
		  .handle(this.section.value, this.bab.value)
	}
}

registry.add('fahras', Fahras);