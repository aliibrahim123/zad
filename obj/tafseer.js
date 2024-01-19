import { quran } from './quran.js';

var copy = (obj) => {
	if (typeof obj !== 'object') return obj;
	var cloned = {};
	for (let prop in obj) cloned[prop] = copy(obj[prop]);
	return cloned
}

export default copy(quran['سورة'])