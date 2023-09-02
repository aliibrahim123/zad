//function type

import { typeOf } from './throwers.js';

export var Function = {
	$isTypeChecker: true,
	typeName: 'function',
	check: (value, name, doThrow) => typeof value === 'function' || doThrow && typeOf(name, value, 'function')
}