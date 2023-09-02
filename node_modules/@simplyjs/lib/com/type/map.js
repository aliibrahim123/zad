//map type

import { checkChecker, checkstr } from './check.js';
import { instanceOf } from './throwers.js';

export class MapType {
	$isTypeChecker = true;
	constructor (keyType, valueType, typeName = 'unnamedMap') {
		checkChecker(keyType, 'keyType');
		this.keyType = keyType;
		checkChecker(valueType, 'valueType');
		this.valueType = valueType;
		checkstr(typeName, 'typeName');
		this.typeName = typeName
	}
	check (value, name, doThrow) {
		var { keyType, valueType } = this;
		return (value instanceof Map || doThrow && instanceOf(name, value, this.typeName)) &&
		  Array.from(value.entries()).every(([key, value]) => 
			keyType.check(key, doThrow && `key of ${name}`, doThrow) &&
			valueType.check(value, doThrow && `${name} at key (${key})`, doThrow)
		  )
	}
}

export var map = (keyType, valueType, typeName) => new MapType(keyType, valueType, typeName)