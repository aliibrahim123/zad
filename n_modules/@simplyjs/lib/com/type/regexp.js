//regexp type

import { instanceOf } from './throwers.js';

export var regexp = {
	$isTypeChecker: true,
	typeName: 'Regexp',
	check: (value, name, doThrow) => value instanceof Regexp || doThrow && instanceOf(name, value, 'Regexp')
}