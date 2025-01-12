import type { StyleCore, StyleGroup, StyleUnit } from "./style.ts";
import { isMobile } from "./utils.ts";

export interface Settings {
	style: {
		core: StyleCore,
		base: StyleUnit,
	} & Record<StyleGroup, Partial<StyleUnit>>
}

const defaultSettings: Settings = {
	style: {
		core: {
			transition: 'fade',
			backRes: 'meduim',
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
			padding: 0
		},
		root: { base: 'base' },
		viewer: { base: 'base' }
	}
}

if (!isMobile()) {
	defaultSettings.style.base.layout = 'overlay';
	defaultSettings.style.viewer.overlayBack = 'random';
}

declare global {
	var settings: Settings;
}
globalThis.settings = JSON.parse(localStorage.getItem('zad-settings') as string) || defaultSettings;

export function saveSettings () {
	localStorage.setItem('zad-settings', JSON.stringify(settings));
}