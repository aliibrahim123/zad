//base functions

import { checkChecker, checkstr } from './check.js';

export function is (type, value) {
	checkChecker(type);
	if (arguments.length === 1) return (value) => type.check(value, '', false);
	return type.check(value, '', false)
}

export function validate (type, name, value) {
	checkChecker(type);
	checkstr(name, 'name');
	if (arguments.length === 2) return (value) => type.check(value, name, true);
	return type.check(value, name, true)
}