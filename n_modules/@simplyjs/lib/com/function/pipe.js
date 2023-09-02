//function pipe

var check = (fns) => fns.forEach((fn, ind) => {
	if (typeof fn !== 'function') throw new TypeError('fn: fn at index (' + ind + ') of type (' + fn?.constructor?.name + '), expected (Function)')
})

export var pipe = (...fns) => {
	check(fns);
	return (value) => fns.reduce((cur, fn) => fn(cur), value)
}

export var compose = (...fns) => {
	check(fns);
	return (value) => fns.reduceRight((cur, fn) => fn(cur), value)
}

export var over = (...fns) => {
	check(fns);
	return (...args) => fns.map(fn => fn(...args)) 
}

export var overAll = (...fns) => {
	check(fns);
	return (...args) => fns.every(fn => fn(...args)) 
}

export var overSome = (...fns) => {
	check(fns);
	return (...args) => fns.some(fn => fn(...args)) 
}