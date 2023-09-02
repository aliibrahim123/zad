//array pattern helpers

import { check } from './base.js';

var checkargs = (args) => {
	if (args.length === 0) throw new TypeError('match: arguments length of (0)');
}

export var ofLength = (len) => value => value?.length === len || value?.size === len;

export var includes = (x, from) => value => Array.isArray(value) && value.includes(x, from);

export var firstOf = (...patterns) => checkargs(patterns) && ((value) => {
	if (!value) return false;
	for (let i = 0; i < patterns.length; i++) {
		if (!check(value[i], patterns[i])) return false
	}
	return true
})

export var lastOf = (...patterns) => checkargs(patterns) && ((value) => {
	if (!value) return false;
	for (let i = 0; i < patterns.length; i++) {
		if (!check(value[value.length - (patterns.length - i)], patterns[i])) return false
	}
	return true
})

export var every = (x) => value => Array.isArray(value) && value.length && value.every(v => check(v, x));

export var some = (x) => value => Array.isArray(value) && value.length && value.some(v => check(v, x));