type EntryMap = { [key: string]: EntryMap | ''};
const entryMap: EntryMap = {
	libs: '',
	base: '',
	root: '',
	fahras: '',
	viewer: '',
	quranViewer: '',
	sw: '',
	settingsPage: '',
	download: '',
	aboutDay: '',
	masbaha: '',
	sections: {
		quran: '',
		doaa: '',
		saaat: '',
		osboa: '',
		months: '',
		ziara: '',
		mobeen: '',
		monasabat: '',
		sera: '',
		sala: '',
		quranTopics: '',
		quranInfo: '',
		shorts: '',
		aliWord: '',
		dewan: '',
		nahij: '',
		ibooks: '',
	}
}

//as straight path, without src/ or .ts
export const entries: string[] = [];

function flatternEntry (entry: EntryMap, path: string = '') {
	path = path === '' ? '' : path + '/';
	for (const name in entry) {
		const subEntry = entry[name];
		if (subEntry === '') entries.push(path + name);
		else flatternEntry(subEntry, path + name);
	}
}
flatternEntry(entryMap);

//with src/ and .ts
export const entriesFull = entries.map(entry => `src/${entry}.ts`);
export const entriesFullSet = new Set(entriesFull); 