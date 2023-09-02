//promise type

import { instanceOf } from './throwers.js';

export var promise = {
	$isTypeChecker: true,
	typeName: 'Promise',
	check: (value, name, doThrow) => value instanceof Promise || doThrow && instanceOf(name, value, 'Promise')
}