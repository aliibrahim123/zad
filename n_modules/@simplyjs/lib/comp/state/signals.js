//signals for states

import { checkstr, checkfn, checkarr, checkDataProv } from '../check.js';

export class Signal {
	constructor (prov, name, value) {
		checkDataProv(prov, 'signal');
		checkstr(name, 'name', 'signal');
		
		this.prov = prov;
		this.name = name;
		
		if (!prov.model.has(name)) prov.model.set(name, value)
	}

	get value () {
		return this.prov.model.get(this.name)
	}
	
	set value (value) {
		return this.prov.model.set(this.name, value)
	}
}

export class CSignal {
	constructor (prov, name, depends, fn) {
		checkDataProv(prov, 'signal');
		checkstr(name, 'name', 'signal');
		checkarr(depends, 'dependencies', 'signal');
		checkfn(fn, 'computer', 'signal');
		
		this.prov = prov;
		this.name = name;
		
		this.prov.addEffect(depends, (...args) => this.prov.model.set(name, fn(...args)))
		
		if (!prov.model.has(name)) prov.model.set(name, 
			fn(...depends.map(dep => this.prov.model.get(dep)))
		)
	}

	get value () {
		return this.prov.model.get(this.name)
	}
}
