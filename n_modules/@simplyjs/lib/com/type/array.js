//array type

import { checkChecker, checkstr } from './check.js';
import { any } from './any.js';
import { instanceOf } from './throwers.js';

export class ArrayType {
	$isTypeChecker = true;
	constructor (itemType = any, typeName = itemType?.typeName + 'Array') {
		checkChecker(itemType, 'itemType');
		this.itemType = itemType;
		checkstr(typeName, 'typeName');
		this.typeName = typeName
	}
	check (value, name, doThrow) {
		var itemType = this.itemType;
		return (Array.isArray(value) || doThrow && instanceOf(name, value, this.typeName)) &&
		  value.every((value, i) => itemType.check(value, doThrow && `${name} at index (${i})`, doThrow))
	}
}

export var array = (itemType, typeName) => new ArrayType(itemType, typeName)