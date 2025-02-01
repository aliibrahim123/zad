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