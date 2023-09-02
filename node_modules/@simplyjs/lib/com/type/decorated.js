//decorated type

import { checkChecker, checkfn, checkarr, checkstr } from './check.js';

export class DecoratedType {
	$isTypeChecker = true;
	constructor (type, decorators, typeName =  type && 'decorated' + type.typeName[0].toUpperCase() + type.typeName.slice(1)) {
		checkChecker(type);
		this.type = type;
		checkarr(decorators, 'decorators');
		decorators.forEach((decorator, i) => checkfn(decorator, `decorator at index (${i})`));
		this.decorators = decorators;
		checkstr(typeName, 'typeName');
		this.typeName = typeName
	}
	check (value, name, doThrow) {
		return this.type.check(value, name, doThrow) &&
		  this.decorators.every(decorator => decorator(value, name, doThrow))
	}
}

export var decorated = (type, decorators, typeName) => new DecoratedType(type, decorators, typeName)