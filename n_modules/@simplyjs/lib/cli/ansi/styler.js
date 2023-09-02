//styler
//style factory

import * as styles from './style.js';

//target.styles = array of [style, ...args]

var handler = {
	get (target, style, proxy) {
		if (!(style in styles) || typeof styles[style] !== 'function') throw new ReferenceError('cli: style (' + style + ') is undefined');
		if (styles[style].length !== 0) target.lastStyleWasParametric = true;
		target.styles.push([style]);
		return proxy
	},
	apply (target, _, args) {
		if (target.lastStyleWasParametric) {
			target.styles[target.styles.length -1].push(...args);
			target.lastStyleWasParametric = false;
			return target.proxy
		}
		return target.styles.reduce(
			(result, style) => styles[style[0]](...style.slice(1), result)
		, args[0])
	}
}

export var styler = () => {
	var proxy = new Proxy(() => {}, handler); //use empty function to alow calling
	proxy.proxy = proxy;
	proxy.styles = [];
	return proxy
}