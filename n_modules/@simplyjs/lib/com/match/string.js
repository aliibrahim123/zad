//string pattern helpers

export var startsWith = (string) => value => typeof value === 'string' && value.startsWith(string);

export var endsWith = (string) => value => typeof value === 'string' && value.endsWith(string);

export var matchString = (x) => {
	if (typeof x !== 'string' && !(x instanceof RegExp)) throw new TypeError('match: matcher of type (' + x?.constructor?.name + '), expected (String) or (RegExp)');
	return typeof x === 'string' ? (value => value.includes(x)) : (value => x.test(value))
}