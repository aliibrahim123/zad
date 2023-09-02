//state

import { RValue } from './rvalue.js';

export var state = (value) => {
	var rvalue = value instanceof RValue ? value : new RValue(value);
	return [ //[state, setState, getState, rvalue]
		rvalue.v, 
		(value) => rvalue.v = value,
		() => rvalue.v,
		rvalue
	]
}