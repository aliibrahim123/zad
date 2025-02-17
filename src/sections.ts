import type { ContentPack } from "../scripts/generatePacks.ts";

export type Sections = keyof typeof sections;
export interface SectionOptions {
	viewer: 'viewer' | 'quranViewer' | '',
	arabicName: string,
	dataFolder: string,
	searchable?: boolean,
	contentPack: ContentPack,
	favoritable?: boolean,
	fahrasBattons?: ({
		name: string,
		show: (section: Sections, bab: Bab) => boolean,
		handle: (section: Sections, bab: Bab) => void
	})[],
	viewerStyle?: ('quran')[]
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

export const sections = {
	quran: {
		viewer: 'quranViewer',
		arabicName: 'القرآن الكريم',
		dataFolder: 'quran',
		contentPack: 'quran',
		viewerStyle: ['quran']
	},
	saaat: {
		viewer: "viewer",
		arabicName: 'أعمال الساعات',
		contentPack: '',
		dataFolder: 'saaat'
	},
	osboa: {
		viewer: "viewer",
		arabicName: 'أعمال الأسبوع',
		contentPack: '',
		dataFolder: 'osboa'
	},
	months: {
		viewer: "viewer",
		arabicName: 'أعمال الأشهر',
		contentPack: '',
		dataFolder: 'months'
	},
	ziara: {
		viewer: "viewer",
		arabicName: 'قسم زيارات',
		contentPack: '',
		dataFolder: 'ziara'
	},
	favorite: {
		contentPack: '',
		dataFolder: '',
		viewer: '',
		arabicName: '',
		favoritable: false,
		searchable: false,
	},
	test: {
		viewer: 'viewer',
		arabicName: 'تجربة',
		contentPack: '',
		dataFolder: 'test'
	}
} satisfies Record<string, SectionOptions>

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