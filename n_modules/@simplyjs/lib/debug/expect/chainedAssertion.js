//chained assertion class

import { checkstr, checkfn, checkpInt, throwNotStrOrFun, checkstrOrReg } from './check.js';
import { assert, deepEq } from './helpers.js';
import { AssertionError } from '../assertionError.js';

export class ChainedAssertion {
	constructor (value) {
		this.value = value;
		this.negated = false;
		this.deep = false;
		this.strict = false;
		this._own = false;
	}
	
	//language chains
	get to () {
		return this
	}
	get be () {
		return this
	}
	get and () {
		return this
	}
	get that () {
		return this
	}
	get which () {
		return this
	}
	get is () {
		return this
	}
	get has () {
		return this
	}
	get have () {
		return this
	}
	get but () {
		return this
	}
	get of () {
		return this
	}
	
	//flags
	get not () {
		this.negated = true;
		return this
	}
	get deeply () {
		this.deep = true;
		return this
	}
	get strictly () {
		this.strict = true;
		return this
	}
	get own () {
		this._own = true;
		return this
	}
	
	type (type, msg) {
		if (typeof type === 'string') assert(
			typeof this.value === type, 
			msg || `value of type (${typeof this.value}), expected #not (${type})`,
			this.negated
		);
		
		else if (typeof type === 'function') assert(
			this.value instanceof type,
			msg || `value of type (${this.value?.constructor?.name}), expected #not (${type.name})`,
			this.negated
		);
		
		else throwNotStrOrFun(type, 'type');
		this.negated = false;
		return this
	}
	a (type, msg) {
		return this.type(type, msg)
	}
	an (type) {
		return this.type(type, msg)
	}
	
	string (msg) {
		return this.type('string', msg)
	}
	number (msg) {
		return this.type('number', msg)
	}
	boolean (msg) {
		return this.type('boolean', msg)
	}
	true (msg) {
		this.eq(true, msg)
	}
	false (msg) {
		this.eq(false, msg)
	}
	null (msg) {
		return this.eq(null, msg)
	}
	undefined (msg) {
		return this.eq(undefined, msg)
	}
	function (msg) {
		return this.type('function', msg)
	}
	object (msg) {
		assert(
			typeof this.value === 'object' && this.value !== null,
			msg || `value of type (${this.value === null ? null : typeof this.value}), expected #not object`,
			this.negated
		);
		this.negated = false;
		return this
	}
	array (msg) {
		return this.type(Array, msg)
	}
	date (msg) {
		return this.type(Date, msg)
	}
	regExp (msg) {
		return this.type(RegExp, msg)
	}
	bigInt (msg) {
		return this.type('bigint', msg)
	}
	symbol (msg) {
		return this.type('symbol', msg)
	}
	promise (msg) {
		return this.type(Promise, msg)
	}
	primitive (msg) {
		assert(
			this.value === null || (typeof this.value !== 'object' && typeof this.value !== 'function'),
			msg || `expected (${this.value}) to #not be primitive`,
			this.negated
		);
		this.negated = false;
		return this
	}
	truthy (msg) {
		assert(
			!!this.value,
			msg || `expected (${this.value}) to be truthy`,
			false
		);
		this.negated = false;
		return this
	}
	falsy (msg) {
		assert(
			!this.value,
			msg || `expected (${this.value}) to be falsy`,
			false
		);
		this.negated = false;
		return this
	}
	defined (msg) {
		return this.not.eq(undefined, msg)
	}
	nill (msg) {
		assert(
			this.value === undefined || this.value === null,
			msg || `value of type (${typeof this.value}), expected #not nill`,
			this.negated
		);
		this.negated = false;
		return this
	}
	nan (msg) {
		return this.eq(NaN, msg)
	}
	int (msg) {
		assert (
			Number.isInteger(this.value),
			msg || `expected (${this.value}) to be integer`,
			false
		);
		this.negated = false;
		return this
	}
	float (msg) {
		assert (
			!Number.isInteger(this.value),
			msg || `expected (${this.value}) to be float`,
			false
		);
		this.negated = false;
		return this
	}
	finite (msg) {
		assert (
			Number.isFinite(this.value),
			msg || `expected (${this.value}) to be finite`,
			false
		);
		this.negated = false;
		return this
	}
	infinite (msg) {
		assert (
			!Number.isFinite(this.value),
			msg || `expected (${this.value}) to be infinite`,
			false
		);
		this.negated = false;
		return this
	}
	arrayBuffer (msg) {
		return this.type(ArrayBuffer, msg)
	}
	typedArray (msg) {
		return this.type(TypedArray, msg)
	}
	error (msg) {
		return this.type(Error, msg)
	}
	map (msg) {
		return this.type(Map, msg)
	}
	set (msg) {
		return this.type(Set, msg)
	}
	weakMap (msg) {
		return this.type(WeakMap, msg)
	}
	weakSet (msg) {
		return this.type(weakSet, msg)
	}
	
	eq (value, msg) {
		if (this.deep) {
			if (this.negated) assert(
				deepEq(this.value, value, this.strict, false),
				msg || `expected (${this.value}) to not be ${this.strict ? 'strictly ' : ''}deeply equal to (${value})`,
				true
			);
			
			else deepEq(this.value, value, this.strict);
		
		} else assert(
			Object.is(this.value, value),
			msg || `expected (${this.value}) to #not be equal to (${value})`,
			this.negated
		);
		
		this.negated = false;
		this.deep = false;
		this.strict = false;
		return this
	}
	equal (value, msg) {
		return this.eq(value, msg)
	}
	oneOf (...values) {
		var prefixes = (this.strict ? 'strictly ' : '') + (this.deep ? 'deeply ' : '')
		assert(
			values.some(value => {
				if (this.deep) return deepEq(this.value, value, this.strict, false);
				return Object.is(this.value, value)
			}),
			`expected (${this.value}) to #not be ${prefixes}one of (${values.join(', ')})`,
			this.negated
		);
		
		this.negated = false;
		this.deep = false;
		this.strict = false;
		return this
	}
	
	key (name, msg) {
		checkstr(name, 'name');
		var wasNegated = this.negated;
		this.not.nill();
		
		if (this._own) assert(
			Object.hasOwn(this.value, name),
			msg || `expected (${this.value}) to #not have own property (${name})`,
			wasNegated
		);
		
		else assert(
			this.value[name] !== undefined,
			msg || `expected (${this.value}) to #not have (${name})`,
			wasNegated
		);
		
		this._own = false;
		return this
	}
	prop (name, msg) {
		this.key(name, msg);
		return new ChainedAssertion(this.value[name])
	}
	property (name, msg) {
		this.key(name, msg);
		return new ChainedAssertion(this.value[name])
	}
	keys (...names) {
		var wasNegated = this.negated,
			wasOwn = this._own;
		names.forEach(name => {
			this.negated = wasNegated;
			this._own = wasOwn;
			this.key(name)
		});
		return this
	}
	ownPropertyDescriptor (name, desc) {
		checkstr(name, 'name');
		this.negated = false;
		this.key(name);
		var odesc = Object.getOwnPropertyDescriptor(this.value, name);
		
		if ('value' in desc) assert(
			odesc.value === desc.value,
			`expected (${odesc.value}) to be equal to (${desc.value})`,
			false
		);
		
		if ('configurable' in desc) assert(
			odesc.configurable === desc.configurable,
			`configurable of (${name}) is (${odesc.configurable}), expected (${desc.configurable})`,
			false
		);
		
		if ('writable' in desc) assert(
			odesc.writable === desc.writable,
			`writable of (${name}) is (${odesc.writable}), expected (${desc.writable})`,
			false
		);
		
		if ('enumerable' in desc) assert(
			odesc.enumerable === desc.enumerable,
			`enumerable of (${name}) is (${odesc.enumerable}), expected (${desc.enumerable})`,
			false
		);
		
		if ('get' in desc) assert(
			odesc.get === desc.get,
			`getter of (${name}) is (${odesc.get}), expected (${desc.get})`,
			false
		);
		
		if ('set' in desc) assert(
			odesc.set === desc.set,
			`setter of (${name}) is (${odesc.set}), expected (${desc.set})`,
			false
		);
		
		return this
	}
	
	frozen (msg) {
		assert(
			Object.isFrozen(this.value),
			msg || `expected (${this.value}) to #not be frozen`,
			this.negated
		);
		this.negated = false;
		return this
	}
	sealed (msg) {
		assert(
			Object.isSealed(this.value),
			msg || `expected (${this.value}) to #not be sealed`,
			this.negated
		);
		this.negated = false;
		return this
	}
	
	gt (nb, msg) {
		assert(
			this.value > nb,
			msg || `expected (${this.value}) to #not be greater than (${nb})`,
			this.negated
		);
		this.negated = false;
		return this
	}
	lt (nb, msg) {
		assert(
			this.value < nb,
			msg || `expected (${this.value}) to #not be less than (${nb})`,
			this.negated
		);
		this.negated = false;
		return this
	}
	greaterThan (nb, msg) {
		return this.gt(nb, msg)
	}
	lessThan (nb, msg) {
		return this.lt(nb, msg)
	}
	above (nb, msg) {
		return this.gt(nb, msg)
	}
	below (nb, msg) {
		return this.lt(nb, msg)
	}
	between (a, b, msg) {
		assert(
			this.value > a && this.value < b,
			msg || `expected (${this.value}) to #not be between (${a}) and (${b})`,
			this.negated
		);
		this.negated = false;
		return this
	}
	
	startsWith (str, msg) {
		checkstr(str, 'str');
		var wasNegated = this.negated;
		this.negated = false;
		this.type('string');
		assert(
			this.value.startsWith(str),
			msg || `expected (${this.value}) to #not start with (${str})`,
			wasNegated
		);
		return this
	}
	endsWith (str, msg) {
		checkstr(str, 'str');
		var wasNegated = this.negated;
		this.negated = false;
		this.type('string');
		assert(
			this.value.endsWith(str),
			msg || `expected (${this.value}) to #not end with (${str})`,
			wasNegated
		);
		return this
	}
	match (pattern, msg) {
		checkstrOrReg(pattern, 'pattern');
		var wasNegated = this.negated;
		this.negated = false;
		this.type('string');
		assert(
			!!this.value.match(pattern),
			msg || `expected (${this.value}) to #not be matched with (${pattern})`,
			wasNegated
		);
		return this
	}
	
	includes (...items) {
		var wasNegated = this.negated;
		this.negated = false;
		this.type(Array);
		assert(
			wasNegated ? 
				!items.some(item => this.value.includes(item)) 
				: items.every(item => this.value.includes(item)),
			`expected (${this.value}) to #not include (${items.join(', ')})`,
			false
		);
		return this
	}
	length (len, msg) {
		checkpInt(len, 'len');
		assert(
			this.value.length === len,
			msg || `(${this.value}) of length (${this.value.length}), expected #not (${len})`,
			this.negated
		);
		this.negated = false;
		return this
	}
	empty (msg) {
		return this.length(0, msg)
	}
	
	throw (type = Error, msgMatcher = '', msg, ...args) {
		checkfn(type, 'type');
		checkstrOrReg(msgMatcher, 'message matcher');
		var wasNegated = this.negated;
		this.negated = false;
		this.type('function');
		
		var error;
		try {
			this.value(...args)
		} catch (err) {
			error = err
		}
		
		var throwed = error ? `, throwed (${error.name}: ${error.message})` : '';
		assert(
			error && error instanceof type && error.message.match(msgMatcher),
			msg || `expected (${this.value.name}) to #not throw a (${type.name})${msgMatcher ? ' of message (' + msgMatcher + ')' : ''}${throwed}`,
			wasNegated
		);
		
		return this
	}
	
	resolve (resolver = ()=>{}, msg) {
		checkfn(resolver, 'resolver');
		this.type(Promise);
		this.value.then(resolver);
		this.value.catch(error => { throw new AssertionError(msg || `expected value to resolve, rejected with (${error?.name}: ${error?.message})`) });
		return this
	}
	reject (rejecter = ()=>{}, msg) {
		checkfn(rejecter, 'rejecter');
		this.type(Promise);
		this.value.then(result => { throw new AssertionError(msg || `expected value to reject, resolved with (${result})`) });
		this.value.catch(rejecter);
		return this
	}
	
	satisfy (fn) {
		checkfn(fn, 'fn');
		
		var [cond, msg] = fn(this.value, this);
		assert(cond, msg, this.negated);
		this.negated = false;
		return this
	}
}