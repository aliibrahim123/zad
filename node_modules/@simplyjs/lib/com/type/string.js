//string type

import { typeOf } from './throwers.js';

export var string = {
	$isTypeChecker: true,
	typeName: 'string',
	check: (value, name, doThrow) => typeof value === 'string' || doThrow && typeOf(name, value, 'string')
}