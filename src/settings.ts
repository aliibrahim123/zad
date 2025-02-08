import type { StyleCore, StyleGroup, StyleUnit } from "./style.ts";
import { isMobile } from "./utils.ts";

export interface Settings {
	style: {
		core: StyleCore,
		base: StyleUnit,
	} & Record<StyleGroup, Partial<StyleUnit>>,
	viewer: {
		maxContentPerPage: number,
		maxUnitPerPage: number,
	}
}

const defaultSettings: Settings = {
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
			base: 'base',
			layout: 'full-page',
			background: 'random',
			backFill: 'fit',
			overlayBack: 'blur',
			margin: 1,
			marginX: 1,
			borderWidth: 1,
			overlayTransMod: 0.5,
			padding: 0.5
		},
		root: { base: 'base' },
		viewer: { base: 'base' },
		fahras: { base: 'base' },
		tools: { base: 'base' }
	},
	viewer: {
		maxContentPerPage: 8000,
		maxUnitPerPage: 30
	}
}

if (!isMobile()) {
	defaultSettings.style.base.layout = 'overlay';
	//defaultSettings.style.viewer.overlayBack = 'random';
}
else {
	defaultSettings.style.base.padding = 1;
}

declare global {
	var settings: Settings;
}
globalThis.settings = JSON.parse(localStorage.getItem('zad-settings') as string) || defaultSettings;

export function saveSettings () {
	localStorage.setItem('zad-settings', JSON.stringify(settings));
}