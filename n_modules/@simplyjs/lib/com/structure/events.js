//simple event emmiter

export var checkstr = (str, name) => {
	if (typeof str !== 'string') throw new TypeError(`events: ${name} of type (${str?.constructor?.name}), expected (String)`);
}

export var checkfn = (fn, name) => {
	if (typeof fn !== 'function') throw new TypeError(`events: ${name} of type (${fn?.constructor?.name}), expected (Function)`);
}

export var checkarr = (arr, name) => {
	if (!Array.isArray(arr)) throw new TypeError(`events: ${name} of type (${arr?.constructor?.name}), expected (Array)`)
}

export class EventEmmiter {
	constructor (opts = {}, events = {}) {
		this.opts = {
			addUndifined: true,
			...opts
		}
		
		this.events = {};
		for (let event in events) {
			this.add(event);
			checkarr(events[event], 'listners');
			events[event].forEach(fn => this.on(event, fn))
		}
	}
	
	add (name) {
		checkstr(name, 'name');
		if (name in this.events) throw new ReferenceError(`events: adding defined event (${name})`);
		this.events[name] = [];
		return this
	}
	has (name) {
		checkstr(name, 'name');
		return name in this.events
	}
	on (name, fn) {
		//case object
		if (typeof name === 'object') {
			for (let evn in name) {
				this.on(evn, name[evn])
			};
			return this
		}
		
		//check
		checkstr(name, 'name');
		checkfn(fn, 'listner');
		
		//add listner
		if (name in this.events) this.events[name].push(fn);
		else if (this.opts.addUndifined) this.events[name] = [fn];
		else throw new ReferenceError(`events: undefined event (${name})`);
		
		return this
	}
	off (name, fn) {
		//check
		checkstr(name, 'name');
		checkfn(fn, 'listner');
		
		if (!(name in this.events)) throw new ReferenceError(`events: undefined event (${name})`);
		
		//remove listner
		else if (fn) this.events[name].splice(this.events[name].indexOf(fn), 1);
		else this.events[name] = [];
		
		return this
	}
	once (name, fn) {
		checkstr(name, 'name');
		checkfn(fn, 'listner');
		
		var onceFn = (...args) => {
			fn(...args);
			this.off(name, onceFn)
		}
		
		return this.on(name, onceFn)
	}
	trigger (name, ...args) {
		checkstr(name, 'name');
		if (name in this.events) this.events[name].forEach(fn => fn(...args));
		else throw new ReferenceError(`events: undefined event (${name})`);
		return this
	}
}

export default (opts, events) => new EventEmmiter(opts, events);