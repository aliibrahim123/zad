//bigint type

import { typeOf } from './throwers.js';

export var bigint = {
	$isTypeChecker: true,
	typeName: 'bigint',
	check: (value, name, doThrow) => typeof value === 'bigint' || doThrow && typeOf(name, value, 'bigint')
}