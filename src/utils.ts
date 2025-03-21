import { query } from "./libs.ts";

export function randomInt (min: number, max?: number) {
	if (max === undefined) {
		return Math.floor(Math.random() * min);
	}
	return Math.floor(Math.random() * (max - min)) + min;
}

export function isMobile () {
	return screen.orientation.type.startsWith('portrait')
}

export function loadSvgs () {
	for (const svg of query('svg')) {
		const src = svg.getAttribute('_src');
		if (!src) continue;
		fetch(src).then(async (res) => {
			svg.replaceWith((new DOMParser())
			  .parseFromString(await res.text(), 'image/svg+xml').documentElement
			)
		})
	}
}

export function defer (fn: (...args: any[]) => void) {
	setTimeout(fn, 0)
}

export function $is <T> (value: any): value is T {
	return true
}

export function deepCopy <T> (value: T): T {
	if (Array.isArray(value)) return value.map(item => deepCopy(item)) as T;
	else if (typeof(value) !== 'object' || value === null) return value;
	const cloned = {} as T;
	for (const prop in value) cloned[prop] = deepCopy(value[prop]);
	return cloned
}
export function merge <T> (a: T, b: Partial<T>) {
	const c = {} as T;
	for (const prop in a) {
		const aProp = a[prop], bProp = b[prop];
		if (typeof(aProp) === 'object') c[prop] = merge(aProp, bProp || {})
		else c[prop] = bProp || aProp
	}
	return c;
}

export function delay (ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

export function getHeight (el: HTMLElement) {
	const styles = window.getComputedStyle(el);
	return el.offsetHeight + Number.parseFloat(styles.marginTop) + Number.parseFloat(styles.marginBottom);
}

export function prepareForSearch(str: string) {
	//remove harakat and normalize hamza
	return str
		.trim()
		.replaceAll(/[\u0617-\u061A\u064B-\u0652]/g, '')
		.replaceAll(/[ئءؤإأآ]/g, 'ا')
		.split(' ');
}
export function testString(string: string, match: string[]) {
	//prepare text
	const text = prepareForSearch(string);

	//loop through text
	let matchInd = 0, curPart = match[0];
	for (const word of text) {
		//if matches
		if (word.includes(curPart)) {
			matchInd++;
			curPart = match[matchInd];
			if (matchInd === match.length) return true;
		}
	}
	return false;
}

export const any = undefined as any;

export function adjustedToday () {
	const today = new Date();
	today.setDate(today.getDate() + Number(settings.timings.adjustDate));
	return today
}
export function toHijri (date: Date) {
	const parts = (new Intl.DateTimeFormat(
	  'ar-SA-islamic-umalqura', { day: 'numeric', month: 'numeric', year: 'numeric', numberingSystem: 'latn' }
	)).formatToParts(date);
	const result: Record<'month' | 'year' | 'day', number> = {} as any;
	for (const { type, value } of parts) result[type as keyof typeof result] = Number(value);
	return result
}
export function toHijriString (date: Date) {
	return date.toLocaleDateString(
	  'ar-SA-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }
	);
}