//assert have

import { assert } from './helpers.js';
import { checkstr } from './check.js';
import { isNotNill } from './is.js';

export var have = (prop, value, msg) => {
	checkstr(prop, 'prop');
	assert(
		value?.[prop] !== undefined,
		msg || `expected (${value}) to have (${prop})`
	)
}

export var haveOwn = (prop, value, msg) => {
	checkstr(prop, 'prop');
	isNotNill(value);
	assert(
		Object.hasOwn(value, prop),
		msg || `expected (${value}) to have own property (${prop})`
	)
}

export var notHave = (prop, value, msg) => {
	checkstr(prop, 'prop');
	assert(
		value?.[prop] === undefined,
		msg || `expected (${value}) to not have (${prop})`
	)
}

export var notHaveOwn = (prop, value, msg) => {
	checkstr(prop, 'prop');
	isNotNill(value);
	assert(
		!Object.hasOwn(value, prop),
		msg || `expected (${value}) to not have own property (${prop})`
	)
}

export var haveKeys = (value, ...keys) => {
	keys.forEach(key => have(key, value))
}

export var notHaveKeys = (value, ...keys) => {
	keys.forEach(key => notHave(key, value))
}

export var haveOwnKeys = (value, ...keys) => {
	keys.forEach(key => haveOwn(key, value))
}

export var notHaveOwnKeys = (value, ...keys) => {
	keys.forEach(key => notHaveOwn(key, value))
}