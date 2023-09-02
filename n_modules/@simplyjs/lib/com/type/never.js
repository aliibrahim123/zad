//never type

export var never = {
	$isTypeChecker: true,
	typeName: 'never',
	check (value, name, doThrow) {
		if (doThrow) throw new TypeError(`expected ${name} to never exist`);
		return false
	}
}