//boolean type

import { typeOf } from './throwers.js';

export var boolean = {
	$isTypeChecker: true,
	typeName: 'boolean',
	check: (value, name, doThrow) => typeof value === 'boolean' || doThrow && typeOf(name, value, 'boolean')
}