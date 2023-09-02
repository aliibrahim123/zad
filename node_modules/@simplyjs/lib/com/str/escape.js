//escape operations

import { checkstr } from './check.js';

var escapeHTMLMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
}

var unescapeHTMLMap = {
	'&amp;': '&',
	'&lt;': '<',
	'&gt;': '>',
	'&quot;': '"' ,
	'&#39;': "'" 
}

export var escapeHTML = (str) => {
	checkstr(str);
	return str.replace(/&<>'"/g, (char) => escapeHTMLMap[char])
}

export var unescapeHTML = (str) => {
	checkstr(str);
	return str.replace(/&amp|&lt|&gt|&quot|&#39/g, (char) => unescapeHTMLMap[char])
}

export var escapeRegExp = (str) => {
	checkstr(str);
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}