//typeOf type

import { checkstr, checkfn } from './check.js';
import { typeOf as typeOfThrower, instanceOf as instanceOfThrower } from './throwers.js';

export var typeOf = (type, typeName = type) => {
	checkstr(type, 'type');
	checkstr(typeName, 'typeName');
	return {
		$isTypeChecker: true,
		typeName,
		check: (value, name, doThrow) => typeof value === type || doThrow && typeOfThrower(name, value, typeName)
	}
}

export var instanceOf = (type, typeName = type?.name) => {
	checkfn(type, 'type');
	checkstr(typeName, 'typeName');
	return {
		$isTypeChecker: true,
		typeName,
		check: (value, name, doThrow) => value instanceof type || doThrow && instanceOfThrower(name, value, typeName)
	}
}