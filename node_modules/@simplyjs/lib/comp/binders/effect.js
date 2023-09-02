//effect class
//call functions on property change

import { checkstr, checkDataProv, checkfn } from '../check.js';

class EffectEmmiter {
	constructor (comp, opts) {
		checkDataProv(comp, 'effect');
		this.comp = comp;
		this.effects = {...opts};
		comp.on('model:change', this.patch.bind(this))
	}
	patch (comp, model, name, prop, oldv, newv, meta) {
		this.effects[name] && this.effects[name].forEach(e=> 
			typeof e === 'string' ? comp.call(e, newv, oldv, prop, name, meta) : e(comp, newv, oldv, prop, name, meta)
		)
	}
	add (name, fn) {
		if (typeof fn !== 'function' && typeof fn !== 'string') checkfn(fn, 'fn', 'effect');
		
		if (Array.isArray(name)) {
			var nfn = (comp) => {
				var props = name.map(prop => comp.get(prop))
				typeof fn === 'string' ? comp.call(fn, ...props) : fn(...props)
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
			else this.comp.warn('effect: undefined property (' + name + ')')
		} else {
			if (this.effects[name]) this.effects[name] = undefined;
			else this.comp.warn('effect: undefined property (' + name + ')')
		}
		return this
	}
}

export { EffectEmmiter }