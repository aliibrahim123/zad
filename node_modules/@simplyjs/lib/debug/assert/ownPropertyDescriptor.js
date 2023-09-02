//assert own property descriptor

import { assert } from './helpers.js';
import { checkstr } from './check.js';
import { have } from './have.js';

export var ownPropertyDescriptor = (name, desc, value, msg) => {
	checkstr(name, 'name');
	have(name, value);
	var odesc = Object.getOwnPropertyDescriptor(value, name);
	
	if ('value' in desc) assert(
		odesc.value === desc.value,
		`value of (${name}) is (${odesc.value}), expected (${desc.value})`,
	);
	
	if ('configurable' in desc) assert(
		odesc.configurable === desc.configurable,
		`configurable of (${name}) is (${odesc.configurable}), expected (${desc.configurable})`,
	);
	
	if ('writable' in desc) assert(
		odesc.writable === desc.writable,
		`writable of (${name}) is (${odesc.writable}), expected (${desc.writable})`,
	);
	
	if ('enumerable' in desc) assert(
		odesc.enumerable === desc.enumerable,
		`enumerable of (${name}) is (${odesc.enumerable}), expected (${desc.enumerable})`,
	);
	
	if ('get' in desc) assert(
		odesc.get === desc.get,
		`getter of (${name}) is (${odesc.get}), expected (${desc.get})`,
	);
	
	if ('set' in desc) assert(
		odesc.set === desc.set,
		`setter of (${name}) is (${odesc.set}), expected (${desc.set})`,
	);

}