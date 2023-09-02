//literal type

import { checkstr } from './check.js';

var Throw = (name, value, expected) => {
	throw new TypeError(`${name} of value (${value}), expected (${expected})`);
}

export class LiteralType {
	$isTypeChecker = true;
	constructor (value, typeName = 'unnamed') {
		this.value = value;
		checkstr(typeName, 'typeName');
		this.typeName = typeName
	}
	check (value, name, doThrow) {
		return Object.is(value, this.value) || doThrow && Throw(name, value, this.value)
	}
}

export var literal = (value, typeName) => new LiteralType(value, typeName)