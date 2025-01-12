//sources and assets sources

export interface Item {
	name: string,
	type: ItemType,
	loc?: string,
	author: {
		name: string,
		url?: string
	},
	url?: string,
	host?: {
		name: string
		url?: string
	}
}
export type ItemType = 'image';

const items: Item[] = [
	
]
export default items;