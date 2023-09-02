//symbol type

import { typeOf } from './throwers.js';

export var symbol = {
	$isTypeChecker: true,
	typeName: 'symbol',
	check: (value, name, doThrow) => typeof value === 'symbol' || doThrow && typeOf(name, value, 'symbol')
}