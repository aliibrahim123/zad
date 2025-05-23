import type { Bab } from "./sections.ts";

export const currentSearches: [number, Map<number, Bab>][] = [];
export const masbahat: Record<string, number> = 
	JSON.parse(localStorage.getItem('masabahat') as string) || {};
export const searchHistory: string[] = 
	JSON.parse(localStorage.getItem('search-history') as string) || [];
export const installedPacks: Partial<Record<string, string>> = 
	JSON.parse(localStorage.getItem('zad-installed-packs') as string) || {};
export const scrollHistory: Record<string, [page: number, offset: number]> =
	JSON.parse(localStorage.getItem('scroll-history') as string) || {};
	
export function saveMasbahat () {
	localStorage.setItem('masabahat', JSON.stringify(masbahat));
}
export function saveInstalledPacks () {
	localStorage.setItem('zad-installed-packs', JSON.stringify(installedPacks));
}
export function setScrollEntry (name: string, page: number, offset: number) {
	const keys = Object.keys(scrollHistory);
	if (keys.length > 75) delete scrollHistory[keys[Math.round(Math.random() * keys.length)]];
	scrollHistory[name] = [page, offset];
	localStorage.setItem('scroll-history', JSON.stringify(scrollHistory));
}
export function addSearchEntry (name: string) {
	if (searchHistory.includes(name)) return;
	searchHistory.unshift(name);
	if (searchHistory.length > 75) searchHistory.pop();
	localStorage.setItem('search-history', JSON.stringify(searchHistory));
}
export async function getPacks () {
	return await (await fetch('./internal/contentPacks/info.json')).json() as Record<string, Pack>
}
export interface Pack {
	version: string;
	size: number;
	arabicName: string;
}
