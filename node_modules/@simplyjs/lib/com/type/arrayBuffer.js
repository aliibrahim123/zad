//array buffer type

import { instanceOf } from './throwers.js';

export var arrayBuffer = {
	$isTypeChecker: true,
	typeName: 'ArrayBuffer',
	check: (value, name, doThrow) => value instanceof ArrayBuffer || doThrow && instanceOf(name, value, 'ArrayBuffer')
}