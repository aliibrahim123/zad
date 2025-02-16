import type { ContentPack } from "../scripts/generatePacks.ts";
import { Component, create, registry } from "./libs.ts";
import type { Satisfies, BaseMap, CompOptions } from "./libs.ts";
import { addListener, getPacks, installedPacks, removeListener, saveInstalledPacks, sendRequest, type Pack, type SWResponse } from "./base.ts";
import template from './templates/download.neo.html';

type ItemTypeMap = Satisfies<BaseMap, {
	childmap: {},
	props: {
		packName: string,
		pack: Pack,
		installedVersion: string | undefined
	},
	refs: {}
}>;
class Item extends Component<ItemTypeMap> {
	static override defaults: CompOptions = {
		...Component.defaults,
		view: { template: template.item, insertMode: 'replace' },
		store: { addUndefined: true },
		initMode: 'minimal',
	};

	override init(): void {}
}

type TypeMap = Satisfies<BaseMap, {
	childmap: {},
	props: {
		status: { primary: string, secondary: string },
		listner: ((res: SWResponse) => void) | null,
		packs: Record<string, Pack>,
	},
	refs: {
		list: HTMLElement
	}
}>;
 
class DownloadPage extends Component<TypeMap> {
	static override defaults: CompOptions = {
		...Component.defaults,
		view: { 
			template: template.download,
			insertMode: 'into',
			into: '#inner-container'
		},
		store: { addUndefined: true }
	};
	Status = this.signal('status', { primary: 'متفرغ', secondary: '' });
	listener = this.signal('listner', null);
	packs = this.signal('packs', null as any);
	override async init() {
		this.initDom();
		this.fireInit();

		if (!navigator.onLine) return;

		//prepare info
		const packs = await getPacks();
		this.packs.value = packs;
		
		//add buttons
		const list = this.refs['list'][0];
		for (let name in packs) {
			const item = new Item();
			this.addChild(item);
			item.store.setMultiple({
				packName: name, pack: packs[name], installedVersion: installedPacks[name]
			});item.store
			list.append(item.el);
		}
	}

	download (pack: ContentPack) {
		sendRequest({ type: 'cache', action: 'download', pack });
		if (!this.listener.value) {
			const listener = this.onResponse.bind(this);
			this.listener.value = listener;
			addListener('cache', listener);
		}
	}
	delete (pack: ContentPack) {
		sendRequest({ type: 'cache', action: 'delete', pack });
		if (!this.listener.value) {
			const listener = this.onResponse.bind(this);
			this.listener.value = listener;
			addListener('cache', listener);
		}
	}
	name (name: ContentPack) {
		return this.packs.value[name].arabicName;
	}
	onResponse (res: SWResponse) {
		if (res.type !== 'cache') return;
		if (res.status === 'finished') {
		  //show status
		  if (res.action === 'download') this.Status.value = {
			primary: `تم تنزيل: ${this.name(res.pack)}`, secondary: '',
		  }
		  else this.Status.value = {
			primary: `تم حذف: ${this.name(res.pack)}`, secondary: '',
		  }

		  //change current version
		  const curVersion = res.action === 'download' ? this.packs.value[res.pack].version : undefined;
		  installedPacks[res.pack] = curVersion;
		  saveInstalledPacks();

		  //update child specilized in pack
		  (this.children.find(child => child.get('packName') === res.pack) as Item)
			.set('installedVersion', curVersion);
		  
		  if (res.nowIdle) {
			//reset everything
			removeListener(this.listener.value as any);
			this.listener.value = null;	
			//return to normal status
			setTimeout(() => this.Status.value = {
			  primary: 'متفرغ', secondary: ''
			}, 1000)
		  }
		}

		//donwload unpacked
		else if (res.action === 'download' && res.packType === 'unpacked') {
		  if (res.status === 'started') this.Status.value = {
			primary: `بدأ تنزيل: ${this.name(res.pack)}`, secondary: ''
		  };
		  else if (res.status === 'caching') this.Status.value = {
			primary: `تنزيل: ${this.name(res.pack)}`,
			secondary: `تم تنزيل ${res.processed} / ${res.fullCount}`
		  }
		}

		//downoad unpacked
		else if (res.action === 'download' && res.packType === 'packed') {
		  if (res.status === 'started') this.Status.value = {
			primary: `بدأ  تنزيل: ${this.name(res.pack)}`, secondary: ''
		  };
		  else if (res.status === 'fetched') this.Status.value = {
			primary: `تنزيل: ${this.name(res.pack)}`,
			secondary: `تم تنزيل جزأ ${res.chunk} / ${res.chunkCount}`
		  }
		  else if (res.status === 'caching') this.Status.value = {
			primary: `تنزيل: ${this.name(res.pack)}`,
			secondary: `تم تحميل ${res.processed} / ${res.fileCount} من جزأ ${res.chunk} / ${res.chunkCount}`
		  }
		  else if (res.status === 'finished-chunk') this.Status.value = {
			primary: `تنزيل: ${this.name(res.pack)}`,
			secondary: `تم تحميل جزأ ${res.chunk} / ${res.chunkCount} كاملاً`
		  }
		}

		//delete
		else if (res.action === 'delete') {
		  if (res.status === 'deleting') this.Status.value = {
			primary: `يتم حذف: ${this.name(res.pack)}`, secondary: ''
		  }
		}
	}
}

registry.add('download', DownloadPage);
registry.add('download.item', Item);