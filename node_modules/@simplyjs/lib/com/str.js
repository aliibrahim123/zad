//string utility

import { chars, codePoints, words, lines, splitLinesAt } from './str/split.js';
import { first, last, sliceWords } from './str/slice.js';
import { truncate, prune } from './str/truncate.js';
import { count, reverse, splice, insert } from './str/misc.js';
import { addPrefix, addSuffix, removePrefix, removeSuffix } from './str/prefix-suffix.js';
import { capitalize, convCase, camelCase, pascalCase, snakeCase, constantCase, 
		 kebabCase, trainCase, titleCase, sentenceCase, lowerCase, upperCase } from './str/case.js';
import { containsOnly, containsNot, isAlpha, isAlphaLower, isAlphaUpper, isAlphaNumerial, isDigit, isWhitespace, isBlank, isPunctuation,
		 isInt, isFloat, isBin, isOcta, isHex } from './str/query.js';
import { escapeHTML, unescapeHTML, escapeRegExp } from './str/escape.js';

var extendNative = () => {
	var handle = (fn) => function (...args) { return fn(this, ...args) };
	for (let prop in $str) {
		Object.defineProperty(String.prototype, '$' + prop, {
			value: handle($str[prop]),
			enumerable: false
		})
	}
}

var $str = {
	chars, codePoints, words, lines, splitLinesAt,
	first, last, sliceWords,
	truncate, prune,
	count, reverse, splice, insert,
	addPrefix, addSuffix, removePrefix, removeSuffix,
	capitalize, convCase, camelCase, pascalCase, snakeCase, constantCase, kebabCase, trainCase, titleCase, sentenceCase, lowerCase, upperCase,
	containsOnly, containsNot, isAlpha, isAlphaLower, isAlphaUpper, isAlphaNumerial, isDigit, isWhitespace, isBlank, isPunctuation,
	isInt, isFloat, isBin, isOcta, isHex,
	escapeHTML, unescapeHTML, escapeRegExp,
	extendNative
};

export default $str;
export {
	chars, codePoints, words, lines, splitLinesAt,
	first, last, sliceWords,
	truncate, prune,
	count, reverse, splice, insert,
	addPrefix, addSuffix, removePrefix, removeSuffix,
	capitalize, convCase, camelCase, pascalCase, snakeCase, constantCase, kebabCase, trainCase, titleCase, sentenceCase, lowerCase, upperCase,
	containsOnly, containsNot, isAlpha, isAlphaLower, isAlphaUpper, isAlphaNumerial, isDigit, isWhitespace, isBlank, isPunctuation,
	isInt, isFloat, isBin, isOcta, isHex,
	escapeHTML, unescapeHTML, escapeRegExp,
	extendNative
}