//slicing operations

import { checkstr, checkint, checkpInt } from './check.js';

export var first = (str, n) => {
	checkstr(str);
	checkpInt(n, 'length', false);
	return str.slice(0, n)
}

export var last = (str, n) => {
	checkstr(str);
	checkpInt(n, 'length', false);
	return str.slice(-n)
}

export var sliceWords = (str, start = 0, end = str?.length, keepFirst = true, keepLast = true) => {
	checkstr(str);
	checkint(start, 'start');
	checkint(end, 'end');
	
	//adjust start and end to be between 0 and len
	var len = str.length;
	start = start < 0 ? start + len : start;
	start = Math.max(0, Math.min(start, len));
	end = end < 0 ? end + len : end;
	end = Math.max(0, Math.min(end, len));
	
	//find indixes of spaces
	var si = start === 0 ? 0 : keepFirst ? str.lastIndexOf(' ', start) : str.indexOf(' ', start);
	var ei = end === len ? len : keepLast ? str.indexOf(' ', end) : str.lastIndexOf(' ', end);
	
	//handle case were space not found
	if (si === -1) si = keepFirst ? 0 : len;
	if (ei === -1) ei = keepLast ? len : 0;
	
	//slice
	return str.slice(si ? si +1 : 0, ei)
}