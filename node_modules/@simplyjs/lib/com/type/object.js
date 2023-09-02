//object type

import { checkChecker, checkstr } from './check.js';

export class ObjectType {
	$isTypeChecker = true;
	constructor (shape, strict = false, typeName = 'unnamed') {
		for (let prop in shape) {
			checkChecker(shape[prop], 'shape.' + prop)
		}
		this.shape = shape;
		this.strict = strict;
		checkstr(typeName, 'typeName');
		this.typeName = typeName
	}
	check(value, name, doThrow) {
		var shape = this.shape;
		for (let prop in shape) {
			if (!shape[prop].check(value?.[prop], prop, doThrow)) return false
		}
		
		if (this.strict && Object.keys(value).length !== Object.keys(shape)) {
			if (doThrow) throw new TypeError(`${name} has keys (${Object.keys(value).join(', ')}), expected (${Object.keys(shape).join(', ')})`);
			return false
		}
		
		return true
	}
}

export var object = (shape, strict, typeName) => new ObjectType(shape, strict, typeName)