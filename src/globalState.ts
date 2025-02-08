import type { Bab } from "./sections.ts";

export const currentSearches: [number, Map<number, Bab>][] = [];
export const masbahat: Record<string, number> = 
	JSON.parse(localStorage.getItem('masabahat') as string) || {};
export const searchHistory: string[] = 
	JSON.parse(localStorage.getItem('search-history') as string) || [];

export function saveMasbahat () {
	localStorage.setItem('masabahat', JSON.stringify(masbahat));
}
export function addSearchEntry (name: string) {
	if (searchHistory.includes(name)) return;
	searchHistory.unshift(name);
	if (searchHistory.length > 30) searchHistory.pop();
	localStorage.setItem('search-history', JSON.stringify(searchHistory));
}