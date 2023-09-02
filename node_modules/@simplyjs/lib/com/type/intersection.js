//intersection type

import { checkChecker, checkarr, checkstr } from './check.js';

export class IntersectionType {
	$isTypeChecker = true;
	constructor (types, typeName = 'unnamedIntersection') {
		checkarr(types, 'types');
		types.forEach((type, i) => checkChecker(type, `type at index (${i})`));
		this.types = types;
		checkstr(typeName, 'typeName');
		this.typeName = typeName
	}
	check (value, name, doThrow) {
		var result = this.types.some(type => type.check(value, name, false))
		if (!result && doThrow) throw new TypeError(
			`${name} of type (${value?.constructor?.name}), expected to be one of (${this.types.map(i => i.typeName).join(', ')})`
		);
		return result
	}
}

export var intersection = (types, typeName) => new IntersectionType(types, typeName);
export var oneOf = (types, typeName) => new IntersectionType(types, typeName);