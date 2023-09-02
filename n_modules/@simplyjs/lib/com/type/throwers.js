//throwers

export var typeOf = (name, value, typeName) => {
	throw new TypeError(`${name} of type (${typeof value}), expected (${typeName})`)
}

export var instanceOf = (name, value, typeName) => {
	throw new TypeError(`${name} of type (${value?.constructor?.name}), expected (${typeName})`)
}

export var throwers = {
	typeOf, instanceOf
}