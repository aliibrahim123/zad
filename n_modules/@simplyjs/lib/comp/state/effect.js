//effect class
//call functions on property change

import { checkstr, checkDataProv, checkfn } from '../check.js';

class EffectEmmiter {
	constructor (prov, opts) {
		checkDataProv(prov, 'effect');
		this.prov = prov;
		this.effects = {...opts};
		prov.on('model:change', this.patch.bind(this))
	}
	patch (prov, model, name, prop, oldv, newv, meta) {
		this.effects[name] && this.effects[name].forEach(e=> 
			typeof e === 'string' ? prov.call(e, newv, oldv, prop, name, meta) : e(prov, newv, oldv, prop, name, meta)
		)
	}
	add (name, fn) {
		if (typeof fn !== 'function' && typeof fn !== 'string') checkfn(fn, 'fn', 'effect');
		
		if (Array.isArray(name)) {
			var nfn = (prov) => {
				var props = name.map(prop => prov.get(prop))
				typeof fn === 'string' ? prov.call(fn, ...props) : fn(...props)
			}
			name.forEach(name => this.add(name, nfn));
			return this
		} 
		
		checkstr(name, 'name', 'effect');
		if (name in this.effects) this.effects[name].push(fn)
		else this.effects[name] = [fn];
		return this
	}
	remove (name, fn) {
		checkstr(name, 'name', 'effect');
		if (fn) {
			if (this.effects[name]) this.effects[name] = this.effects[name].filter(e=>e!==fn);
			else this.prov.warn('effect: undefined property (' + name + ')')
		} else {
			if (this.effects[name]) this.effects[name] = undefined;
			else this.prov.warn('effect: undefined property (' + name + ')')
		}
		return this
	}
}

export { EffectEmmiter }