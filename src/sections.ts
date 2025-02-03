export type Sections = 'quran';
export interface SectionOptions {
	viewer: 'viewer' | 'quranViewer',
	dataFolder: string,
	searchable?: boolean,
	contentPack: string,
	favoritable?: boolean
}
export type ProtoBab = {
	$ind: number,
	$meta?: {
		searchable?: boolean,
		downloadble?: boolean,
		favoritable?: boolean
	} & Record<string, any>,
} & { [K in string]: ProtoBab | number | string | { link: string } }
export type Bab = {
	$ind: number,
	$meta?: {
		searchable?: boolean,
		downloadble?: boolean,
		favoritable?: boolean
	},
	$name: string,
	$parent: Bab,
} & { [K in string]: Bab | number | string | { link: string } }

export const sections: Record<Sections, SectionOptions> = {
	quran: {
		viewer: 'quranViewer',
		dataFolder: 'quran',
		contentPack: 'quran'
	}
}

const fahrases = new Map<Sections, Map<number, Bab>>();
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