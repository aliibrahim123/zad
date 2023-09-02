//set type

import { checkChecker, checkstr } from './check.js';
import { instanceOf } from './throwers.js';

export class SetType {
	$isTypeChecker = true;
	constructor (itemType, typeName = itemType?.typeName + 'Set') {
		checkChecker(itemType, 'itemType');
		this.itemType = itemType;
		checkstr(typeName, 'typeName');
		this.typeName = typeName
	}
	check (value, name, doThrow) {
		var itemType = this.itemType;
		return (value instanceof Set || doThrow && instanceOf(name, value, this.typeName)) &&
		  Array.from(value).every((value, i) => itemType.check(value, doThrow && `${name} at index (${i})`, doThrow))
	}
}

export var set = (itemType, typeName) => new SetType(itemType, typeName)