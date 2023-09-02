//lazy component manager

import { LazyComp } from './lazyComp.js'

var lazyCManager = {
	add () {
		throw new CompError('lazy comp manager: unsupported method (add)')
	},
	has () {
		throw new CompError('lazy comp manager: unsupported method (has)')
	},
	get (name) {
		if ($comp.has(name)) return $comp.get(name);
		return createProxy(name);
	}
};

var createProxy = (name) => {
	return new Proxy(LazyComp, {
		get (target, prop) {
			return target[prop]
		},
		construct (target, args) {
			return new target(name, ...args)
		}
	})
}

export { lazyCManager, LazyComp, createProxy }