//tuple type

import { checkChecker, checkstr, checkarr } from './check.js';
import { instanceOf } from './throwers.js';

export class TupleType {
	$isTypeChecker = true;
	constructor (items, rest = null, typeName = 'unnamedTuple') {
		//handle items
		checkarr(items, 'items');
		this.items = items.map((item, i) => {
			var name = '', type;
			if (Array.isArray(item)) [name, type] = item;
			else type = item;
			checkstr(name, 'name');
			checkChecker(type);
			return [name, type]
		});
		
		//handle rest
		if (rest !== null) checkChecker(rest, 'restType');
		this.rest = rest;
		
		//handle typeName
		checkstr(typeName, 'typeName');
		this.typeName = typeName
	}
	check (value, name, doThrow) {
		//check if array
		var { items, rest } = this;
		if (!Array.isArray(value)) return doThrow && instanceOf(name, value, this.typeName);
		
		//check main items
		if (!items.every(
			([iname, type], i) => type.check(value[i], iname || doThrow && `${name} at index (${i})`, doThrow)
		)) return false;
		
		//check rest items
		var ilen = items.length;
		if (value.length > ilen) {
			if (rest) return value.every(
				(item, i) => i >= ilen ? rest.check(item, doThrow && `${name} at index (${i})`, doThrow) : true
			);
			if (doThrow) throw new TypeError(`${name} of length (${value.length}), expected (${ilen})`);
			return false
		}
		return true
	}
}

export var tuple = (items, rest, typeName) => new TupleType(items, rest, typeName)