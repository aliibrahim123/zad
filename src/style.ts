import { query } from "./libs.ts";
import { lowRes, meduimRes, highRes, pages } from './data/backgrounds.ts';
import { isMobile, randomInt } from "./utils.ts";

export type StyleGroup = 'base' | 'root' | 'viewer' | 'fahras' | 'tools';
export interface StyleUnit {
	base: StyleGroup,
	layout: 'full-page' | 'overlay',

	background: number | 'random',
	backFill: 'fill' | 'fit' | 'crop',

	overlayBack: 'blur' | 'transparent' | 'random' | number,
	overlayTransMod: number,
	borderWidth: number,

	margin: number,
	marginX: number,
	padding: number,
}
export interface StyleCore {
	backRes: 'low' | 'meduim' | 'high',
	animationSpeed: number,

	fontSize: number,
	titleSize: number,
	borderSize: number,
}

export function setupStyle (soft = false) {
	//get style unit
	const group = query('#root')[0].getAttribute('style-group') as StyleGroup;
	var style = settings.style[group] as StyleUnit;
	if (group !== 'base') style = { ...settings.style.base, ...style };
	const core = settings.style.core;
	
	//query elements
	const body = document.body;
	const main = query('main')[0] as HTMLElement;
	const backInner = query('#back-inner')[0] as HTMLElement;
	const overlayBorder = query('#overlay-border')[0] as HTMLElement;
	
	//font
	body.style.setProperty('--font-size', String(core.fontSize));
	if (style.layout === 'overlay' && 
		(style.overlayBack === 'blur' || style.overlayBack === 'transparent')
	) body.style.setProperty('--font-color', 'white')
	else body.style.setProperty('--font-color', 'black');

	//size modifiers
	body.style.setProperty('--title-size', String(core.titleSize));
	body.style.setProperty('--border-size', String(core.borderSize));

	//background
	if (soft) {}
	else if (style.layout === 'full-page') {
		setBack(getBack(pages, style.background), 'crop');
		main.style.backgroundImage = '';
	} else {
		const images = 
		  core.backRes === 'high' ? highRes :
		  core.backRes === 'meduim' ? meduimRes :
		  lowRes;
		
		setBack(getBack(images, style.background));
	}
	
	//padding
	main.style.setProperty('--padding-mod', String(style.padding));

	//overlay
	main.classList.remove('overlay');
	overlayBorder.classList.remove('enable');
	if (style.layout === 'overlay') overlay();
	
	function overlay () {
		main.classList.add('overlay')
		
		//margin
		main.style.setProperty('--margin-mod', String(style.margin));
		main.style.setProperty('--margin-x-mod', String(style.marginX));
	
		overlayBorder.style.setProperty('--margin-mod', String(style.margin));
		overlayBorder.style.setProperty('--margin-x-mod', String(style.marginX));
		
		//border
		main.style.setProperty('--border-width', String(style.borderWidth));
		
		overlayBorder.classList.add('enable');
		overlayBorder.style.setProperty('--trans-mod', String(style.overlayTransMod));
		overlayBorder.style.setProperty('--border-width', String(style.borderWidth));
		
		//background
		main.style.setProperty('--trans-mod', String(style.overlayTransMod));
		if (soft) return;
		main.classList.remove('transparent', 'blur', 'back-crop');
		
		main.style.backgroundClip = '';
		if (style.overlayBack === 'transparent') main.classList.add('transparent');
		else if (style.overlayBack === 'blur') main.classList.add('blur');
		else {
			main.classList.add('back-crop');
			main.style.backgroundClip = 'padding-box';
			main.style.backgroundImage = 
				`url('./assets/background/${getBack(pages, style.overlayBack)}')`;
		}
	}
	
	function getBack (images: string[], img: 'random' | number) {
		//random
		if (style.background === 'random') return images[randomInt(images.length)];
		//specific
		else return images.find(name => name.startsWith(String(style.background))) as string;
	}
	function setBack (path: string, backFill = style.backFill) {
		//set back img
		const exp = `url('./assets/background/${path}')`;
		body.style.backgroundImage = exp;
		if (backFill === 'fit') backInner.style.backgroundImage = exp;
		else backInner.style.backgroundImage = '';
		
		//clean body
		body.classList.remove('back-fill', 'back-crop', 'back-blur');
		backInner.classList.remove('back-fit');
		
		//set classes
		if      (backFill === 'fill') body.classList.add('back-fill'); 
		else if (backFill === 'crop') body.classList.add('back-crop');
		else {
			body.classList.add('back-fill', 'back-blur');
			backInner.classList.add('back-fit');
		}
	}
}