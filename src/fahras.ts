import { Component, create, query, registry, View } from "./libs.ts";
import type { Satisfies, BaseMap, CompOptions } from "./libs.ts";
import { $is, getFahras, sections, type Bab, type Sections } from "./base.ts";
import template from './templates/fahras.neo.html';

type TypeMap = Satisfies<BaseMap, {
	childmap: {},
	props: {
		title: string,
		bab: Bab,
		section: Sections
	},
	refs: {
		title: HTMLElement,
		path: HTMLElement,
		list: HTMLElement,
		toolbar: HTMLElement,
		'search-btn': HTMLElement,
		'download-btn': HTMLElement,
		'favorite-btn': HTMLElement,
	}
}>; 

class Fahras extends Component<TypeMap> {
	static override defaults: CompOptions = {
		...Component.defaults,
		view: { 
			template: template.fahras,
			insertMode: View.insertMode.atBottom
		}
	};
	override init() {
		this.store.add('title');
		this.store.add('bab');
		this.store.add('section');

		this.initDom();

		this.update(location.hash.slice(1));

		this.fireInit();
	}
	onRoute (url: URL) {
		const animationSpeed = settings.style.core.animationSpeed;
		if (animationSpeed) {
			const container = this.el.children[0];
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
			
			if ($is<Bab>(item) && item.$name)
				el = create('li', '.bab-item', create('a', name, { href: `#${section}/${item.$ind}` }));
			else if ($is<{link: string}>(item) && item.link)
				el = create('li', '.link-item', create('a', name, { href: item.link }));
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
		const section = this.get('section');
		const bab = this.get('bab');
		const options = sections[section];
		const toolbar = this.refs['toolbar'][0];

		this.refs['download-btn'][0].classList.toggle('hide',
			options.contentPack === '' || bab.$meta?.downloadble === false
		);
		this.refs['search-btn'][0].classList.toggle('hide',
			options.searchable === false || bab.$meta?.searchable === false
		);
		this.refs['favorite-btn'][0].classList.toggle('hide',
			options.favoritable === false || bab.$meta?.favoritable === false
		);

		//readd separator 
		for (const el of query('.sep', toolbar)) el.remove();
		for (const el of Array.from(toolbar.children)) 
		  if (!el.classList.contains('hide') && toolbar.lastChild !== el) 
			el.after(create('span', '.sep', '|'));
	}
}

registry.add('fahras', Fahras);