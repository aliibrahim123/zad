//event emiter

import { checkfn, checkstr } from '../check.js';

class EventEmmiter {
	constructor (events = {}, addUndef = true, warn = 'warn') {
		this.events = events;
		this.warn = warn;
		this.addUndef = addUndef //add undefined event
	}
	add (name) {
		checkstr(name, 'name', 'event');
		if (name in this.events) this.warn && console[this.warn]('event: adding defined event (' + name + ')');
		this.events[name] = [];
		return this
	}
	has (name) {
		checkstr(name, 'name', 'event');
		return name in this.events
	}
	on (name, fn) {
		if (typeof name === 'object') {
			for (let e in name) {
				this.on(e, name[e])
			};
			return this
		}
		checkstr(name, 'name', 'event');
		checkfn(fn, 'handler', 'event');
		
		if (name in this.events) this.events[name].push(fn);
		else if (this.addUndef) this.events[name] = [fn];
		else this.warn && console[this.warn]('event: udefined event (' + name + ')');
		
		return this
	}
	off (name, fn) {
		checkstr(name, 'name', 'event');
		checkfn(fn, 'handler', 'event');
		if (!(name in this.events)) this.warn && console[this.warn]('event: udefined event (' + name + ')');
		
		else if (fn) this.events[name].splice(this.events[name].indexOf(fn), 1);
		else this.events[name] = [];
		
		return this
	}
	once (name, fn) {
		checkstr(name, 'name', 'event');
		checkfn(fn, 'handler', 'event');
		var onceFn = (...args) => {
			fn(...args);
			this.off(name, onceFn)
		}
		return this.on(name, onceFn)
	}
	trigger (name, ...args) {
		checkstr(name, 'name', 'event');
		if (name in this.events) this.events[name].forEach(fn => fn(...args));
		else this.warn && console[this.warn]('event: udefined event (' + name + ')');
		return this
	}
}

export { EventEmmiter }