import type { StyleCore, StyleGroup, StyleUnit } from "./style.ts";
import { isMobile, merge } from "./utils.ts";

export interface Settings {
	style: {
		core: StyleCore,
		base: StyleUnit,
	} & Record<StyleGroup, Partial<StyleUnit>>,
	content: {
		maxContentPerPage: number,
		maxUnitPerPage: number,
	}
	timings: {
		adjustDate: number,
		method: number,
		safaq: 'general' | 'ahmer' | 'abyad',
		midnightMode: number,
		latitudeAdjust: number
	}
}
type PartialSettings = {
	style: { [P in keyof Settings['style']]: Partial<Settings['style'][P]> },
	content: Partial<Settings['content']>,
	timings: Partial<Settings['timings']>
}

export const defaultSettings: Settings = {
	style: {
		core: {
			animationSpeed: 1,
			backRes: 'meduim',
			fontSize: 1,
			titleSize: 1,
			borderSize: 1,
			masbahaSize: 1
		},
		base: {
			layout: 'full-page',
			background: 'random',
			backFill: 'fit',
			overlayBack: 'blur',
			margin: 1,
			marginX: 1,
			borderWidth: 1,
			overlayTransMod: 0.5,
			padding: 0.5,
			blackMod: 1
		},
		root: { }, viewer: { }, fahras: { }, tools: { }
	},
	content: {
		maxContentPerPage: 8000,
		maxUnitPerPage: 30
	},
	timings: {
		adjustDate: 0,
		method: 0,
		safaq: 'general',
		midnightMode: 0,
		latitudeAdjust: 1
	}
}

if (!isMobile()) {
	defaultSettings.style.base.layout = 'overlay';
	//defaultSettings.style.viewer.overlayBack = 'random';
}
else {
	defaultSettings.style.base.padding = 1;
	defaultSettings.style.base.blackMod = 0.4;
	defaultSettings.style.core.fontSize = 1.25;
}

declare global {
	var settings: Settings & { overwritten: PartialSettings };
}
const overwritten: PartialSettings = JSON.parse(localStorage.getItem('zad-settings') as string) 
  || {
	style: { base: {}, core: {}, fahras: {}, root: {}, tools: {}, viewer: {} },
	content: {},
	timings: {}
};
globalThis.settings = merge(defaultSettings, overwritten as Settings) as any;
globalThis.settings.overwritten = overwritten;

export function saveSettings () {
	localStorage.setItem('zad-settings', JSON.stringify(settings.overwritten));
}