//typed array type

import { instanceOf } from './throwers.js';

export var typedArray = {
	$isTypeChecker: true,
	typeName: 'TypedArray',
	check: (value, name, doThrow) => value instanceof TypedArray || doThrow && instanceOf(name, value, 'TypedArray')
}