//null type

import { typeOf } from './throwers.js';

export var Null = {
	$isTypeChecker: true,
	typeName: 'null',
	check: (value, name, doThrow) => value === null || doThrow && typeOf(name, value, 'null')
}