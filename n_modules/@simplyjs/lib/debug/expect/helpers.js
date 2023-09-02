//helpers

import { AssertionError } from '../assertionError.js';
import { checkstr } from './check.js';

export var assert = (cond, msg, negated) => {
	checkstr(msg, 'message');
	if (!!cond === negated) throw new AssertionError(msg.replace('#not ', negated ? 'not ' : ''))
}

var throwNotEq = (a, b, path) => {
	throw new AssertionError(`expected (${a}) to be equal to (${b}) at (${path.join('.')})`);
}

export var deepEq = (a, b, strictly, doThrow = true, path = []) => {
	if (typeof a !== 'object' || a === null) {
		if (Object.is(a, b)) return true;
		if (doThrow) throwNotEq(a, b, path);
		return false
	}
	
	if (a instanceof Date) {
		if (b instanceof Date && Number(a) === Number(b)) return true;
		if (doThrow) throwNotEq(a, b, path);
		return false
	}
	
	if (a instanceof RegExp) {
		if (b instanceof RegExp && String(a) === String(b)) return true;
		if (doThrow) throwNotEq(a, b, path);
		return false
	}
	
	if (a instanceof Error) {
		if (b instanceof Error && a.message === b.message && a.name === b.name) return true;
		if (doThrow) throwNotEq(a, b, path);
		return false
	}
	
	if (strictly && Object.keys(a).length !== Object.keys(b).length) {
		if (doThrow) 
			throw new AssertionError(`expected keys (${Object.keys(a).join(',')}) to be same as (${Object.keys(b).join(',')}) at (${path.join('.')})`);
		return false;
	}
	return Object.keys(b).every(prop => deepEq(a[prop], b[prop], strictly, doThrow, path.concat(prop)))
}