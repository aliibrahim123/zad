//test if ...

import { checkstr } from './check.js';

export var containsOnly = (str, match) => {
	if (match === undefined) {
		checkstr(str, 'match')
		match = new RegExp('^[' + str + ']+$');
		return (str) => checkstr(str) && match.test(str)
	} 
	
	checkstr(str);
	checkstr(match, 'match');
	return new RegExp('^[' + match + ']+$').test(str)
}

export var containsNot = (str, match) => {
	if (match === undefined) {
		checkstr(str, 'match')
		match = new RegExp('^[^' + str + ']+$');
		return (str) => checkstr(str) && match.test(str)
	} 
	
	checkstr(str);
	checkstr(match, 'match');
	return new RegExp('^[^' + match + ']+$').test(str)
}

//visualize: 
//alphaR: https://jex.im/regulex/#!flags=&re=%2F%5E%5Ba-zA-Z%5D%2B%24%2F
//alphaLowerR: https://jex.im/regulex/#!flags=&re=%2F%5E%5Ba-z%5D%2B%24%2F
//alphaUpperR: https://jex.im/regulex/#!flags=&re=%2F%5E%5BA-Z%5D%2B%24%2F
//alphaUpperR: https://jex.im/regulex/#!flags=&re=%2F%5E%5Cw%2B%24%2F
var alphaR = /^[a-zA-Z]+$/;
var alphaLowerR = /^[a-z]+$/;
var alphaUpperR = /^[A-Z]+$/;
var alphaNumerialR = /^\w+$/;

//visualize:
//digitR:  https://jex.im/regulex/#!flags=&re=%2F%5E%5Cd%2B%24%2F
//whitespaceR:  https://jex.im/regulex/#!flags=&re=%2F%5E%5Cs%2B%24%2F
//punctuationR:  https://jex.im/regulex/#!flags=&re=%2F%5E%5B!%22%23%24%25%26%27()*%2B%2C-.%2F%3A%3B%3C%3D%3E%3F%40%5B%5C%5D%5E_%60%7B%7C%7D~%5D%2B%24%2F
var digitR = /^\d+$/;
var whitespaceR = /^\s+$/;
var punctuationR = /^[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+$/;

//visualize: 
//intR: https://jex.im/regulex/#!flags=&re=%2F%5E%5B%2B-%5D%3F%5Cd%2B%24%2F
//floatR: https://jex.im/regulex/#!flags=&re=%5E%5B%2B-%5D%3F%5Cd*%5C.%3F%5Cd%2B(%3F%3A%5BeE%5D%5B%2B-%5D%3F%5Cd%2B)%3F%24
//binR: https://jex.im/regulex/#!flags=&re=%2F%5E%5B%2B-%5D%3F(%3F%3A0b)%3F%5B01%5D%2B%24%2F
//octaR: https://jex.im/regulex/#!flags=&re=%2F%5E%5B%2B-%5D%3F(%3F%3A0o)%3F%5B0-7%5D%2B%24%2F
//hexR: https://jex.im/regulex/#!flags=&re=%2F%5E%5B%2B-%5D%3F(%3F%3A0x)%3F%5B0-9a-fA-F%5D%2B%24%2F
var intR = /^[+-]?\d+$/;
var floatR = /^[+-]?\d*\.?\d+(?:[eE][+-]?\d+)?$/;
var binR = /^[+-]?(?:0b)?[01]+$/;
var octaR = /^[+-]?(?:0o)?[0-7]+$/;
var hexR = /^[+-]?(?:0x)?[0-9a-fA-F]+$/;

export var isAlpha = (str) => checkstr(str) && alphaR.test(str);
export var isAlphaLower = (str) => checkstr(str) && alphaLowerR.test(str);
export var isAlphaUpper = (str) => checkstr(str) && alphaUpperR.test(str);
export var isAlphaNumerial = (str) => checkstr(str) && alphaNumerialR.test(str);

export var isDigit = (str) => checkstr(str) && digitR.test(str);
export var isWhitespace = (str) => checkstr(str) && whitespaceR.test(str);
export var isBlank = (str) => checkstr(str) && (str === '' || whitespaceR.test(str));
export var isPunctuation = (str) => checkstr(str) && punctuationR.test(str);

export var isInt = (str) => checkstr(str) && intR.test(str);
export var isFloat = (str) => checkstr(str) && floatR.test(str);
export var isBin = (str) => checkstr(str) && binR.test(str);
export var isOcta = (str) => checkstr(str) && octaR.test(str);
export var isHex = (str) => checkstr(str) && hexR.test(str);