// set operation on sets and arrays

var check = (v, isSet, name) => {
		if (!(Array.isArray(v) || isSet)) throw new TypeError(`set: ${name} of type (${v?.constructor?.name}), epected (Array) or (Set)`);
}

var handle = (a, b, loopA, loopB, addIfInA, addIfInB, noDup, returnArr) => {
	var aIsSet = a instanceof Set;
	var bIsSet = b instanceof Set;
	check(a, aIsSet, 'a');
	check(b, bIsSet, 'b');
	var result = noDup ? new Set() : [];
	if (loopA) for (let v of a) {
		//addIfInB = 1, and v in b, add
		//addIfInB = 0, and v not in b, add
		//addIfInB = 2, add
		if (addIfInB === 2) noDup ? result.add(v) : result.push(v) 
		else if ((bIsSet ? b.has(v) : b.includes(v)) ^ !addIfInB) noDup ? result.add(v) : result.push(v) 
	}
	if (loopB) for (let v of b) {
		//addIfInA = 1, and v in a, add
		//addIfInA = 0, and v not in a, add
		//addIfInB = 2, add
		if (addIfInA === 2) noDup ? result.add(v) : result.push(v) 
		else if ((aIsSet ? a.has(v) : a.includes(v)) ^ !addIfInA) noDup ? result.add(v) : result.push(v) 
	}
	//return set if noDup = true and returnArr = false, else return array
	return noDup ? (returnArr ? Array.from(result) : result) : result
}

export var union = (a, b, noDup = true, returnArr = false) => handle(a, b, true, true, 2, 2, noDup, returnArr);
export var intersection = (a, b, noDup = true, returnArr = false) => handle(a, b, true, true, 1, 1, noDup, returnArr);
export var symDifferences = (a, b, noDup = true, returnArr = false) => handle(a, b, true, true, 0, 0, noDup, returnArr);
export var differences = (a, b, noDup = true, returnArr = false) => handle(a, b, true, false, 0, 0, noDup, returnArr);
export var similarities = (a, b, noDup = true, returnArr = false) => handle(a, b, true, false, 1, 0, noDup, returnArr);

export var subset = (a, b) => {
	var aIsSet = a instanceof Set;
	var bIsSet = b instanceof Set;
	check(a, aIsSet, 'a');
	check(b, bIsSet, 'b');
	for (let v of a) {
		if ((bIsSet ? b.has(v) : b.includes(v))) return true
	}
	return false
}

export var superset = (a, b) => {
	var aIsSet = a instanceof Set;
	var bIsSet = b instanceof Set;
	check(a, aIsSet, 'a');
	check(b, bIsSet, 'b');
	for (let v of a) {
		if (!(bIsSet ? b.has(v) : b.includes(v))) return false
	}
	return (a.size || a.length) ? true : false //for empty length, it doesnt loop and it return true
}

export var and = intersection;
export var or = union;
export var xor = symDifferences;

export default {
	union,
	intersection,
	symDifferences,
	differences,
	similarities,
	and: intersection,
	or: union,
	xor: symDifferences,
	subset,
	superset
}