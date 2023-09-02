//void type

import { typeOf } from './throwers.js';

export var Void = {
	$isTypeChecker: true,
	typeName: 'void',
	check: (value, name, doThrow) => value === undefined || doThrow && typeOf(name, value, 'undefined')
}