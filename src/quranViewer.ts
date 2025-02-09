import { registry } from "./libs.ts";
import { updateFade } from "./base.ts";
import { Viewer, type Data, type Unit } from "./viewer.ts";

class QuranViewer extends Viewer {
	override init() {
		super.init();
	}
	override async update(path: string) {
		await super.update(path);
		this.page.value = Number.parseInt(path.split('/')[1]);
		this.refs["page-control"][0].classList.remove('hide');
	}
	override async changePage(offset: number) {
		const animationSpeed = settings.style.core.animationSpeed;
		//get page number
		const oldPage = this.page.value, options = this.sectionOptions.value;
		const newPage = Math.max(1, Math.min(604, oldPage + offset));
		if (newPage === oldPage) return;
		this.page.value = newPage;

		//replace history entry
		history.replaceState(undefined, '', location.hash.replace(/\d+/, String(newPage)));

		//update page
		const data: Data = await (await fetch(`./data/${options.dataFolder}/${newPage}.json`)).json();
		this.data.value = data;
		
		this.set('title', data.title);
		
		this.updatePage(data.data as Unit[]);
	}
}

registry.add('quran-viewer', QuranViewer);