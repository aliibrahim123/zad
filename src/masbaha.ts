import { Component, registry } from "./libs.ts";
import type { BaseMap, CompOptions } from "./libs.ts";
import { masbahat, prompt, saveMasbahat } from "./base.ts";
import template from './templates/masbaha.neo.html';

interface ItemTypeMap extends BaseMap {
	childmap: {},
	props: {
		name: string,
		count: number
	},
	refs: {}
};
class Item extends Component<ItemTypeMap> {
	static override defaults: CompOptions = {
		...Component.defaults,
		view: { template: template.item, insertMode: 'replace' },
		store: { addUndefined: true },
		initMode: 'minimal',
	};
	count = this.signal('count');
	name = this.signal('name');
	override init(): void {
		this.el.classList.add('item');
		this.effect(['count'], () => {
			masbahat[this.name.value] = this.count.value; 
			saveMasbahat() 
		});
	}
	async change () {
		const count = Math.max(Number(await prompt('العدد الجديد')), 0);
		this.count.value = count;
		masbahat[this.name.value] = count;
		saveMasbahat();
	}
	delete () {
		delete masbahat[this.name.value];
		this.remove();
		saveMasbahat();
	}
}

interface TypeMap extends BaseMap {
	childmap: {},
	props: {
	},
	refs: {
		list: HTMLElement
	}
};
 
class Masbaha extends Component<TypeMap> {
	static override defaults: CompOptions = {
		...Component.defaults,
		view: { 
			template: template.download,
			insertMode: 'into',
			into: '#inner-container'
		},
		store: { addUndefined: true }
	};
	override async init() {
		this.initDom();
		this.fireInit();

		const list = this.refs['list'][0];
		for (const name in masbahat) {
			const item = new Item();
			item.store.setMultiple({ name, count: masbahat[name] });
			this.addChild(item);
			list.append(item.el)
		}
	}

	update () {
		const list = this.refs['list'][0];
		for (const child of this.children) child.remove();
		for (const name in masbahat) {
			const item = new Item();
			item.store.setMultiple({ name, count: masbahat[name] });
			this.addChild(item);
			list.append(item.el)
		}
	}

	async add () {
		const name = await prompt('الإسم');
		masbahat[name] = 0;
		this.update();
		saveMasbahat();
	}
}

registry.add('masbaha', Masbaha);
registry.add('masbaha.item', Item);