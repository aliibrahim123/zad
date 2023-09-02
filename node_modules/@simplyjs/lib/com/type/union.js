//union type

import { checkChecker, checkarr, checkstr } from './check.js';

export class UnionType {
	$isTypeChecker = true;
	constructor (types, typeName = 'unnamedUnion') {
		checkarr(types, 'types');
		types.forEach((type, i) => checkChecker(type, `type at index (${i})`));
		this.types = types;
		checkstr(typeName, 'typeName');
		this.typeName = typeName
	}
	check (value, name, doThrow) {
		return this.types.every(type => type.check(value, name, doThrow))
	}
}

export var union = (types, typeName) => new UnionType(types, typeName);
export var allOf = (types, typeName) => new UnionType(types, typeName);