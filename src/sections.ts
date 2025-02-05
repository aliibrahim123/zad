export type Sections = 'quran' | 'favorite';
export interface SectionOptions {
	viewer: 'viewer' | 'quranViewer' | '',
	dataFolder: string,
	searchable?: boolean,
	contentPack: string,
	favoritable?: boolean,
	fahrasBattons?: ({
		name: string,
		show: (section: Sections, bab: Bab) => boolean,
		handle: (section: Sections, bab: Bab) => void
	})[]
}
export type ProtoBab = {
	$ind: number,
	$meta?: {
		searchable?: boolean,
		downloadble?: boolean,
		favoritable?: boolean
	} & Record<string, any>,
} & { [K in string]: ProtoBab | number | string | { link: string } | ((bab: Bab) => void) | any }
export type Bab = {
	$ind: number,
	$meta?: {
		searchable?: boolean,
		downloadble?: boolean,
		favoritable?: boolean
	},
	$name: string,
	$parent: Bab,
} & { [K in string]: Bab | number | string | { link: string } | ((bab: Bab) => void) | object }

export const sections: Record<Sections, SectionOptions> = {
	quran: {
		viewer: 'quranViewer',
		dataFolder: 'quran',
		contentPack: 'quran'
	},
	favorite: {
		contentPack: '',
		dataFolder: '',
		viewer: '',
		favoritable: false,
		searchable: false,
	}
}

const fahrases = new Map<Sections, Map<number, Bab>>();
export function addFahras (name: Sections, babs: Map<number, Bab>) { 
	fahrases.set(name, babs) 
}
export async function getFahras (section: Sections) {
	//return if cached
	if (fahrases.has(section)) return fahrases.get(section) as Map<number, Bab>;

	//load
	let items: Map<number, Bab> = undefined as any; 
	try {
		items = (await import(`./sections/${section}.js`)).default;
	} catch(e) {}
	try {
		items = (await import(`./sections/${section}.ts`)).default;
	} catch(e) {}

	fahrases.set(section, items);
	return items
}
export function collectProtos (root: ProtoBab, section: string) {
	const items = new Map<number, Bab>();

	function walk (parent: Bab, name: string, cur: ProtoBab) {
		const item: Bab = cur as Bab;
		items.set(item.$ind, item);
		item.$name = name;
		item.$parent = parent;
		for (const child in cur) 
		  if (child[0] !== '$' && (cur[child] as Bab).$ind) {
			walk(item, child, cur[child] as Bab);
		}
	}
	walk(undefined as any, section, root)

	return items
}
export function getRandomInd (fahras: Map<number, Bab>) {
	let randomId = Math.ceil(Math.random() * 1000000);
	while (fahras.has(randomId)) randomId = Math.ceil(Math.random() * 1000000);
	return randomId
}