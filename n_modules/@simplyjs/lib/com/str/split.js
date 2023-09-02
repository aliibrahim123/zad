//split operations

import { checkstr, checkpInt } from './check.js';

export var chars = (str, accurate = false) => {
	checkstr(str);
	return accurate ? Array.from(str) : str.split('')
}

export var codePoints = (str, accurate = false) => {
	checkstr(str);
	return (accurate ? Array.from(str) : str.split('')).map(s => s.codePointAt(0))
}

//visualize: https://jex.im/regulex/#!flags=&re=%5B%5Cs_-%5D%2B%7C(%3F%3D%5BA-Z%5D)
export var words = (str, allCases = false) => {
	checkstr(str);
	return str.trim().split(allCases ? /[\s_-]+|(?=[A-Z])/g : /\s+/)
}

export var lines = (str) => {
	checkstr(str);
	return str.split('\n')
}

export var splitLinesAt = (str, max) => {
	checkstr(str);
	checkpInt(max, 'max', false);
	
	var result = [], i = 0, lastInd = 0;
	while (true) {
		i += max;
		if (i > str.length) {
			result.push(str.slice(lastInd));
			return result
		}
		i = str.lastIndexOf(' ', i); //search for space before i
		if (i <= lastInd) //in case of words bigger than max, i will be equal to lastInd
			i = str.indexOf(' ', lastInd + max); //search for space after i
		result.push(str.slice(lastInd, i === -1 ? str.length : i));
		if (i === -1) return result; //if there is a big word at the end of string, i will be -1
		i++;
		lastInd = i;
	}
}