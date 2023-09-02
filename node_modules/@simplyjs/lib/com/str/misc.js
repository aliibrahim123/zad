//miscellaneous operation

import { checkstr, checkstrReg, checkint } from './check.js';

export var count = (str, pattern) => {
	checkstr(str);
	checkstrReg(pattern, 'pattern');
	return str.split(pattern).length
}

export var reverse = (str, accurate = false) => {
	checkstr(str);
	return (accurate ? Array.from(str) : str.split('')).reverse().join('')
}

export var splice = (str, start = 0, end = str?.length, toAdd = '') => {
	checkstr(str);
	checkint(start, 'start');
	checkint(end, 'end');
	checkstr(toAdd, 'toAdd');
	return str.slice(0, start) + toAdd + str.slice(end)
}

export var insert = (str, pos = 0, toAdd = '') => {
	checkstr(str);
	checkint(pos, 'position');
	checkstr(toAdd, 'toAdd');
	return str.slice(0, pos) + toAdd + str.slice(pos)
}