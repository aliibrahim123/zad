//record type

import { checkChecker, checkstr } from './check.js';
import { typeOf } from './throwers.js';
import { any } from './any.js';

export class RecordType {
	$isTypeChecker = true;
	constructor (valueType = any, typeName = valueType?.typeName + 'Record') {
		checkChecker(valueType, 'valueType');
		this.valueType = valueType;
		checkstr(typeName, 'typeName');
		this.typeName = typeName
	}
	check (value, name, doThrow) {
		//check if not primitive
		if (typeof value !== 'object' && typeof value !== 'function' || value === null) return doThrow && typeOf(name, value, this.typeName);
		
		var valueType = this.valueType;
		for (let prop in value) {
			if (!valueType.check(value[prop], doThrow && `${name} at key (${prop})`, doThrow)) return false
		}
		return true
	}
}

export var record = (valueType, typeName) => new RecordType(valueType, typeName)