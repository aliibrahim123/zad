//assert if throws

import { assert } from './helpers.js';
import { checkfn, checkstrOrReg } from './check.js';
import { ofType } from './ofType.js';

export var throws = (value, type = Error, msgMatcher = '', msg, ...args) => {
	checkfn(type, 'type');
	checkstrOrReg(msgMatcher, 'message matcher');
	ofType('function', value)
	
	var error;
	try {
		value(...args)
	} catch(err) {
		error = err
	}
	
	var throwed = error ? `, throwed (${error.name}: ${error.message})` : '';
	assert(
		error && error instanceof type && error.message.match(msgMatcher),
		`expected (${value.name}) to throw a (${type.name})${msgMatcher ? ' of message (' + msgMatcher + ')' : ''}${throwed}`
	)
}

export var notThrows = (value, type = Error, msgMatcher = '', msg, ...args) => {
	checkfn(type, 'type');
	checkstrOrReg(msgMatcher, 'message matcher');
	ofType('function', value)
	
	var error;
	try {
		value(...args)
	} catch(err) {
		error = err
	}
	
	var throwed = error ? `, throwed (${error.name}: ${error.message})` : '';
	assert(
		!(error && error instanceof type && error.message.match(msgMatcher)),
		`expected (${value.name}) to not throw a (${type.name})${msgMatcher ? ' of message (' + msgMatcher + ')' : ''}${throwed}`
	)
}