//root page

import { Component, registry, View } from "./libs.ts";
import type { Satisfies, BaseMap, CompOptions } from "./libs.ts";
import template from './templates/root.neo.html';
import { defer, loadSvgs } from "./base.ts";

type Section = 
  'main' | 'quran' | 'amal' | 'ahdath' | 'ahkam' |
  'imam-trath' | 'aalem-turath' | 'tools' | 'others';
type TypeMap = Satisfies<BaseMap, {
	childmap: {},
	props: {
		lastSection: HTMLElement,
	},
	refs: {
	} & Record<`section-${Section}`, HTMLElement>
}>; 

class Root extends Component<TypeMap> {
	static override defaults: CompOptions = {
		...Component.defaults,
		view: { 
			template: template.root,
			insertMode: View.insertMode.atBottom
		}
	};
	override init() {
		this.initDom();

		//open current section
		const section = this.getSection(location.hash.slice(1) as Section);
		section.classList.add('current');
		this.store.add('lastSection', { value: section });

		loadSvgs();

		this.fireInit();
	}
	async onRoute (url: URL) {
		const lastSection = this.get('lastSection');
		const curSection = this.getSection(url.hash.slice(1) as Section);
		const sectionWidth = lastSection.clientWidth;

		lastSection.classList.remove('current');
		curSection.classList.add('current');
		this.set('lastSection', curSection);

		const animationSpeed = settings.style.core.animationSpeed;
		if (animationSpeed) {
			const toRoot = url.hash === '';

			curSection.animate({
				transform: [`translateX(${sectionWidth * (toRoot ? 1 : -1)}px)`, '']
			}, { duration: 350 * animationSpeed });

			lastSection.classList.add('exiting');
			await lastSection.animate({
				transform: ['', `translateX(${sectionWidth * (toRoot ? -1 : 1)}px)`]
			}, { duration: 350 * animationSpeed }).finished;
			lastSection.classList.remove('exiting') 
		}
	}
	getSection (section: '' | Section) {
		return this.refs[`section-${section === '' ? 'main' : section}`][0]
	}
}

registry.add('root', Root);