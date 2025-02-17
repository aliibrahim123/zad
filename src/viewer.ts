import { Component, create, query, registry } from "./libs.ts";
import type { Satisfies, BaseMap, CompOptions, Signal } from "./libs.ts";
import template from './templates/viewer.neo.html';
import { 
	addToFavorites, getHeight, prepareForSearch, prompt, sections, setupStyle, testString,
	updateFade, type SectionOptions, type Sections, saveSettings, masbahat,
	saveMasbahat, searchHistory, addSearchEntry, delay
} from "./base.ts";

export type TypeMap = Satisfies<BaseMap, {
	childmap: {},
	props: {
		data: Data,
		options: SectionOptions,
		title: string,
		page: number,
		pages: Unit[][],
		isMultiPage: boolean,
		show2ndToolbar: boolean,
		showFontAdjust: boolean,
		fontSize: number,
		showMasbaha: string,
		masbahaCount: number
	},
	refs: {
		title: HTMLElement,
		info: HTMLElement;
		'main-toolbar': HTMLElement;
		'page-control': HTMLElement;
		'second-toolbar': HTMLElement;
		'add-favorite': HTMLElement;
		filter: HTMLElement;
		'masbaha-options': HTMLElement;
		'second-toolbar-filler': HTMLElement;
		content: HTMLElement;
		'adjust-font': HTMLElement;
		masbaha: HTMLElement;
	}
}>; 

export interface Data {
	title: string,
	type: 'text' | 'html',
	source?: string,
	info?: Record<string, string>,
	singlePage?: boolean,
	meta?: Record<string, any>,
	data: string | Unit[]
}
export interface Unit {
	miniTitle?: string,
	text: string,
	source?: string,
	meta?: Record<string, any>
}

export class Viewer extends Component<TypeMap> {
	static override defaults: CompOptions = {
		...Component.defaults,
		view: { 
			template: template.viewer,
			insertMode: 'into',
			into: '#inner-container'
		},
		store: {
			addUndefined: true
		}
	};
	override init() {
		this.store.set('show2ndToolbar', false);
		this.store.set('fontSize', settings.style.core.fontSize);
		this.store.set('showFontAdjust', false);
		this.masbahaCount = this.signal('masbahaCount', 0);
		this.pages = this.signal('pages', []);
		this.effect(['show2ndToolbar'], this.togglw2ndToolbar.bind(this));
		this.effect(['showMasbaha'], this.toggleMasbaha.bind(this));

		this.initDom();

		this.update(location.hash.slice(1));

		this.fireInit();
	}
	sectionOptions = this.signal('options');
	page = this.signal('page');
	pages = this.signal('pages');
	data = this.signal('data');
	masbahaCount = this.signal('masbahaCount');

	async update (path: string) {
		const [section, id] = path.split('/') as [Sections, string];
		const options = sections[section] as SectionOptions;
		this.sectionOptions = this.signal('options', options);

		//load data
		const data: Data = await (await fetch(`./data/${options.dataFolder}/${id}.json`)).json();
		this.set('title', data.title);
		document.title = `زاد العباد ليوم المعاد: ${options.arabicName}`;
		this.data = this.signal('data', data);
		
		//handle pages
		const isMultiPage = Array.isArray(data.data) && !data.singlePage;
		this.page = this.signal('page', 0);
		this.set('isMultiPage', isMultiPage);
		if (isMultiPage) this.collectPages(data.data as Unit[]);
		
		this.updateInfo();
		
		//set content
		const contentEl = this.refs['content'][0];
		if (typeof(data.data) === 'string') this.setContent(contentEl, data.data);
		else if (isMultiPage) this.updatePage(this.pages.value[0]);
		else this.updatePage(data.data);

		//set style
		if (options.viewerStyle) {
			if (options.viewerStyle.includes('quran')) contentEl.classList.add('quran')
		}
	}
	updateInfo () {
		//collect info
		const data = this.data.value;
		const info: Record<string, string> = {};
		if (data.source) info['مصدر'] = data.source;
		if (this.get('isMultiPage')) info['صفحة'] = '0';
		if (data.info) Object.assign(info, data.info);

		//reconstruct
		const infoEl = this.refs['info'][0];
		infoEl.replaceChildren();
		for (const prop in info) infoEl.append(
			create('span', '.info-item', { attrs: { prop } }, `${prop}: ${info[prop]}`),
			create('span', '.sep', '|')
		);
		//remove last separator
		infoEl.lastChild?.remove();

		//toggle visibility
		const isEmpty = Object.keys(info).length === 0;
		infoEl.classList.toggle('hide', isEmpty);
	}
	setContent (el: HTMLElement, content: string) {
		if (this.data.value.type === 'text') el.innerText = content;
		else el.innerHTML = content;
	}

	collectPages (units: Unit[]) {
		const { maxContentPerPage: maxLength, maxUnitPerPage: maxUnits } = settings.content;
		let curLength = 0, curPage: Unit[] = [], pages = [curPage];

		for (const unit of units) {
			curPage.push(unit);
			curLength += unit.text.length;
			if (curLength > maxLength || curPage.length === maxUnits) {
				curPage = [];
				pages.push(curPage);
				curLength = 0;
			}
		}
		if (pages.at(-1)?.length === 0) pages.pop();
		
		this.pages.value = pages;
	}
	changePage (offset: number) {
		const oldPage = this.page.value, pages = this.pages.value;
		const newPage = Math.max(0, Math.min(pages.length -1, oldPage + offset));
		if (newPage === oldPage) return;
		this.page.value = newPage;
		this.updatePage(pages[newPage]);
	}
	updatePage (page: Unit[]) {
		const contentEl = this.refs['content'][0];
		const infoEl = this.refs['info'][0];
		const type = this.data.value.type;
		const animationSpeed = settings.style.core.animationSpeed;
		
		//animate page changing
		const isFirstTime = contentEl.childNodes.length === 0;
		if (!isFirstTime && animationSpeed) {
			updateFade(contentEl, 300);
			updateFade(infoEl, 300)
		}
		
		contentEl.replaceChildren();
		
		//update pageh
		this.updateInfo();
		const pageEl = this.query('.info-item[prop="صفحة"]')
			.filter(el => !el.parentElement?.classList.contains('old'))[0];
		if (pageEl) pageEl.innerText = 
		  `صفحة: ${this.page.value +1} / ${this.pages.value.length}`;
		let ind = 0;
		for (const unit of page) {
			//contruct unit
			const unitEl = create('div', '.unit');
			this.setContent(unitEl, unit.text);
			if (unit.miniTitle) unitEl.prepend(create('div', '.unit-title', unit.miniTitle));
			if (unit.source) unitEl.append(
			  create('div', '.unit-source', create('b', 'مصدر: '), unit.source)
			);
			contentEl.append(unitEl);

			//animate entering
			if (animationSpeed && !isFirstTime) unitEl.animate([
			  { opacity: 0, transform: 'translateY(1em)' }, 
			  { opacity: 1 }
			], { 
			  fill: 'backwards', easing: 'ease-out', 
			  duration: 400 * animationSpeed,
			  delay: (100 + Math.min(ind++, 15) * 100) * animationSpeed, 
			})
		}
		//remove border from last element 
		(contentEl.lastChild as HTMLElement).classList.add('no-border');
	}

	togglw2ndToolbar () {
		const show = this.get('show2ndToolbar');
		const animationSpeed = settings.style.core.animationSpeed;
		const toolbar = this.refs['second-toolbar'][0];
		const shadow = this.refs['second-toolbar-filler'][0];

		//if no animation
		if (animationSpeed === 0) return toolbar.classList.toggle('hide', !show);

		//animate toolbar
		if (show) toolbar.classList.remove('hide')
		toolbar.style.position = 'absolute';
		toolbar.animate(
		  { opacity: show ? [0, 1] : [1, 0] }, 
		  { 
			duration: 300 * animationSpeed, fill: 'backwards',
			delay: 75 * animationSpeed * Number(show)
		  }
		).finished.then(() => { 
			if (!show) toolbar.classList.add('hide');
		});
		
		//animate filler
		const height = getHeight(toolbar) + 'px';
		shadow.animate(
		  { height: show ? ['0', height] : [height, '0'] }, 
		  { 
			duration: 300 * animationSpeed, easing: 'ease-out', fill: 'backwards',
			delay: 75 * animationSpeed * Number(!show) 
		  }
		).finished.then(() => {
			shadow.style.height = '0';
			toolbar.style.position = ''
		});
	}
	
	download () {
		const options = this.sectionOptions.value;
		router.go(`./download.html#${options.contentPack}`)
	}
	addToFavorites () {
		addToFavorites(`.${location.pathname}${location.hash}`)
	}
	async filter () {
		//request text to be matched
		const name = prepareForSearch(await prompt('الإسم: ', (container, input) => {
			const datalist = create('datalist', '#search-history', 
			  ...searchHistory.map(name => create('option', { value: name }))
			);
			input.setAttribute('list', datalist.id);
			container.append(datalist);
		}));
		if (name[0] !== '') addSearchEntry(name.join(' '));
		const data = this.data.value.data as Unit[];

		//collect pages
		if (name[0] === '') this.collectPages(data);
		else this.collectPages(data.filter(unit => testString(unit.text, name)));

		//update
		this.page.value = 0;
		this.updatePage(this.pages.value[0]);
	}

	adjustFont () {
		const show = !this.get('showFontAdjust');
		const animationSpeed = settings.style.core.animationSpeed;
		const container = this.refs['adjust-font'][0];
		this.set('showFontAdjust', show);

		//if no animation
		if (!animationSpeed) return container.classList.toggle('hide', !show);

		//fade in/out
		container.classList.remove('hide');
		container.animate({ opacity: show ? [0, 1] : [1, 0] }, { duration: 400 * animationSpeed })
		  .finished.then(() => { if (!show) container.classList.add('hide') });
	}
	updateFont (size: number) {
		settings.style.core.fontSize = size;
		settings.overwritten.style.core.fontSize = size;
		this.set('fontSize', size);
		setupStyle(true);
	}
	saveSettings () {
		saveSettings()
	}

	toggleMasbaha () {
		const show = this.get('showMasbaha');
		const animationSpeed = settings.style.core.animationSpeed;
		const container = this.refs['masbaha'][0];

		//if no animation
		if (!animationSpeed) return container.classList.toggle('hide', !show);

		//fade in/out
		container.classList.remove('hide');
		container.animate({ opacity: show ? [0, 1] : [1, 0] }, { duration: 400 * animationSpeed })
		  .finished.then(() => { if (!show) container.classList.add('hide') });
	}
	async adjustMasbaha () {
		const value = await prompt('العدد: ', (_, input) => {
			input.value = String(this.masbahaCount.value)
		})
		this.masbahaCount.value = Number.parseInt(value) || 0
	}
	masbahaAutoComplete (container: HTMLElement, input: HTMLElement) {
		//create datalist
		const datalist = create('datalist', '#all-masbahat', 
		  ...Object.keys(masbahat).map(name => create('option', { value: name }))
		);
		input.setAttribute('list', datalist.id);
		container.append(datalist);
	}
	async loadMasbaha () {
		const name = await prompt('الإسم: ', this.masbahaAutoComplete);
		if (masbahat[name]) this.masbahaCount.value = masbahat[name];
	}
	async saveMasbaha () {
		masbahat[await prompt('الإسم: ', this.masbahaAutoComplete)] = this.masbahaCount.value;
		saveMasbahat();
	}
}

registry.add('viewer', Viewer);