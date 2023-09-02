//case convertion

import { checkstr, checkfn } from './check.js';
import { words } from './split.js';

var lowerize = str => str.toLowerCase();
var upperize = str => str.toUpperCase();
var _capitalize = str => str[0].toUpperCase() + str.slice(1).toLowerCase();
var camelize = (str, i) => i === 0 ? str.toLowerCase() : str[0].toUpperCase() + str.slice(1).toLowerCase();
var sentencize = (str, i) => i === 0 ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str.toLowerCase();

export var capitalize = (str) => {
	checkstr(str);
	return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export var convCase = (str, mapper, join = ' ') => {
	checkstr(str);
	checkfn(mapper, 'mapper');
	checkstr(join, 'join');
	
	return words(str, true).map(mapper).join(join)
}

export var camelCase = (str) => words(str, true).map(camelize).join('');
export var pascalCase = (str) =>  words(str, true).map(_capitalize).join('');
export var snakeCase = (str) => words(str, true).join('_').toLowerCase();
export var constantCase = (str) => words(str, true).join('_').toUpperCase();
export var kebabCase = (str) => words(str, true).join('-').toLowerCase();
export var trainCase = (str) => words(str, true).join('_').toUpperCase();;
export var titleCase = (str) => words(str, true).map(_capitalize).join(' ');
export var sentenceCase = (str) => words(str, true).map(sentencize).join(' ');
export var lowerCase = (str) => words(str, true).join(' ').toLowerCase();
export var upperCase = (str) => words(str, true).join(' ').toUpperCase();