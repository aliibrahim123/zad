//nullable type

import { checkChecker, checkstr } from './check.js';

export class NullableType {
	$isTypeChecker = true;
	constructor (type, typeName = type?.typeName) {
		checkChecker(type);
		this.type = type;
		checkstr(typeName, 'typeName');
		this.typeName = typeName
	}
	check (value, name, doThrow) {
		return value === null || this.type.check(value, name, doThrow)
	}
}

export var nullable = (type, typeName) => new NullableType(type, typeName)