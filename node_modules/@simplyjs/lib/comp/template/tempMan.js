//template manager
//defining templates and subs

import { checkfn, checkstr, CompError } from '../check.js';
import { parse } from './parseAttr.js';
import { handleListen } from './listnerHndl.js';
import $el from '../../dom/base.js';

var tempManager = {
	temps: {},
	subs: {},
	add (name, temp) {
		checkstr(name, 'name', 'temps');
		if (name in this.temps) $comp.warn('comp: adding defined template (' + name + ')');
		var els;
		
		if (typeof temp === 'string') {//constuct from html string
			els = $el(temp);
			this.temps[name] = () => {return {els: els.map(el => el.cloneNode(true)), acts: []}};
		} else if (temp?.nodeType === 1) 
			this.temps[name] = () => {return {els: [...temp.cloneNode(true).childNodes], acts: []}}; //clone existing element 
		else {
			checkfn(temp, 'temp', 'temps')
			this.temps[name] = temp;
		}
		
		$comp.events.trigger('temp-added', name, this.temps[name])
	},
	has (name) {
		checkstr(name, 'name', 'temps');
		return name in this.temps
	},
	get (name) {
		checkstr(name, 'name', 'temps');
		if (!(name in this.temps)) throw new CompError('comp: undefined template (' + name + ')');
		return this.temps[name]
	},
	getLazy (view, name) {
		checkstr(name, 'name', 'temps');
		
		var fn = (tname) => {
			if (tname !== name) return;
			$comp.events.off('temp-added', fn)
			view.render();
			view.comp.waitingNb -= 1;
		};
		
		if (this.temps[name]) fn(name);
		else $comp.events.on('temp-added', fn)
	},
	addSub (name, sub) {
		checkstr(name, 'name', 'temps');
		
		if (name in this.subs) $comp.warn('comp: adding defined sub (' + name + ')');
		var els;
		
		if (typeof sub === 'string') {//constuct from html string
			els = $el(sub);
			this.subs[name] = {$isSub: true, fn() {return {el: els.map(el => el.cloneNode(true)), acts: []}}};
		} else if (sub?.nodeType === 1) 
			this.subs[name] = {$isSub: true, fn() {return {el: [...sub.cloneNode(true).childNodes], acts: []}}}; //clone existing element
		else {
			checkfn(sub?.fn, 'fn', 'temps');
			this.subs[name] = sub;
		}
	},
	hasSub (name) {
		checkstr(name, 'name', 'temps');
		return name in this.subs
	},
	getSub (name) {
		checkstr(name, 'name', 'temps');
		if (!(name in this.subs)) throw new CompError('comp: undefined sub (' + name + ')');
		return this.subs[name]
	},
	parseAttr: parse, 
	listen: handleListen
};

export { tempManager }