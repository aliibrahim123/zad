//number type

import { typeOf } from './throwers.js';

export var number = {
	$isTypeChecker: true,
	typeName: 'number',
	check: (value, name, doThrow) => typeof value === 'number' || doThrow && typeOf(name, value, 'number')
}