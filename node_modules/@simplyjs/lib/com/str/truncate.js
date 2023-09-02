//truncate string

import { checkstr, checkpInt } from './check.js';
import { sliceWords } from './slice.js';

export var truncate = (str, length, end = '...') => {
	checkstr(str);
	checkpInt(length, 'length', false);
	checkstr(end, 'end');
	
	length = Math.max(0, length - end.length);
	return str.length > length ? str.slice(0, length) + end : str
}

export var prune = (str, length, end = '...') => {
	checkstr(str);
	checkpInt(length, 'length', false);
	checkstr(end, 'end');
	
	length = Math.max(0, length - end.length);
	return str.length > length ? sliceWords(str, 0, length, true, false) + end : str
}