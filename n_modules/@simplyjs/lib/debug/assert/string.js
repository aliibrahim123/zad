//assert string operations

import { assert } from './helpers.js';
import { checkstr, checkstrOrReg } from './check.js';
import { ofType } from './ofType.js';

export var startsWith = (str, value, msg) => {
	checkstr(str, 'str');
	ofType('string', value);
	assert(
		value.startsWith(str),
		`expected (${value}) to start with (${str})`
	)
}

export var endsWith = (str, value, msg) => {
	checkstr(str, 'str');
	ofType('string', value);
	assert(
		value.endsWith(str),
		`expected (${value}) to end with (${str})`
	)
}

export var match = (pattern, value, msg) => {
	checkstrOrReg(pattern, 'pattern');
	ofType('string', value);
	assert(
		value.match(pattern),
		`expected (${value}) to be matched with (${pattern})`
	)
}

export var notStartsWith = (str, value, msg) => {
	checkstr(str, 'str');
	ofType('string', value);
	assert(
		!value.startsWith(str),
		`expected (${value}) to not start with (${str})`
	)
}

export var notEndsWith = (str, value, msg) => {
	checkstr(str, 'str');
	ofType('string', value);
	assert(
		!value.endsWith(str),
		`expected (${value}) to not end with (${str})`
	)
}

export var notMatch = (pattern, value, msg) => {
	checkstrOrReg(pattern, 'pattern');
	ofType('string', value);
	assert(
		!value.match(pattern),
		`expected (${value}) to not be matched with (${pattern})`
	)
}