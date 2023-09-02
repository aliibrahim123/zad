//date type

import { instanceOf } from './throwers.js';

export var date = {
	$isTypeChecker: true,
	typeName: 'Date',
	check: (value, name, doThrow) => value instanceof Date || doThrow && instanceOf(name, value, 'Date')
}