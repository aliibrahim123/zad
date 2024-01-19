//component collection
//dynamic array of components

import { checkarr, checkpInt, CompError} from '../check.js';

var throwIndGT = (ind, length) => {
	throw new CompError('collection: index (' + ind + ') greater than length (' + length + ')');
}

class CompCollection {
	constructor (comps = [], propName = 'value') {
		checkarr(comps, 'comps');
		this.comps = comps;
		this.propName = propName;
		comps.forEach(c => c.trigger('collection:added', this))
	}
	add (comp, ind) {
		checkpInt(ind, 'index', 'collection');
		if (ind > this.comps.length) throwIndGT(ind, this.comps.length);
		this.comps.splice(ind, 0, comp);
		comp.trigger('collection:added', this);
		return this
	}
	get (ind) {
		return this.comps[ind]
	}
	get length () {
		return this.comps.length
	}
	set (values) {
		if (Array.isArray(values)) {
			if (values.length !== this.comps.length) 
				$comp.warn('collection: values length (' + values.length + ') is not equal to length (' + this.comps.length + ')');
			values.forEach((v, i) => this.comps[i] && this.comps[i].set(typeof v === 'object' ? v : this.propName, v))
		}
		else $comp.warn('collection: values of type (' + values?.constructor?.name + '), expected (Array)');
		return this
	}
	setOne (value, ind) {
		checkpInt(ind, 'index', 'collection');
		if (this.comps.length <= ind) $comp.warn('collection: index ('+ ind +') greater than length (' + this.comps.length + ')');
		else this.comps[ind].set(typeof value === 'object' ? value : this.propName, value);
		return this
	}
	remove (ind, count = 1) {
		checkpInt(ind, 'index', 'collection');
		if (ind >= this.comps.length) throwIndGT(ind, this.comps.length);
		this.comps.splice(ind, count)
	}
}

export { CompCollection }