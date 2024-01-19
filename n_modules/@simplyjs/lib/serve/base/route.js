//route class

import { checkfn, checkstr } from '../check.js';
import { ServerError } from './error.js';
import { addRoute } from './addRoute.js';

var httpMethods = ['connect', 'delete', 'get', 'head', 'options', 'patch', 'post', 'put', 'trace'];

export class Route {
	constructor (router, parent, handler, name = '', opts = {}) {
		//handle name
		checkstr(name, 'name');
		this.name = name.startsWith('[') ? name.slice(1, -1) : name;
		this.path = parent ? parent.path + '/' + name : '';
		
		this.router = router;
		this.parent = parent;
		
		//handle handler
		this.handler = {};
		if (!handler) this.handler = null;
		else if (typeof handler === 'function') this.handler = handler;
		else if (typeof handler === 'object') for (let method in handler) this.method(method, handler[method]);
		else throw new ServerError(`serve: handler at path (${this.path}) of type (${handler?.constructor?.name}), expected (Function) or (Object)`);
		
		//handle options
		var { portal } = {
			portal: false,
			...opts
		};
		this.portal = portal;
		
		//handle routes
		this.routes = {}
	}
	
	method (method, handler) {
		checkstr(method, 'method');
		checkfn(handler, 'handler');
		if (this.handler === null) this.handler = {};
		else if (typeof this.handler === 'function') 
			throw new ServerError(`serve: adding methed (${method}) for (${this.path}) in presence of (all) handler`)
		if (httpMethods.includes(method)) this.handler[method] = handler;
		else throw new ServerError(`serve: unsupported http method (${method}) at path (${this.path})`);
		return this
	}
	
	route (path, handler, opts = {}) {
		return addRoute(path, this, this.router, handler, opts, Route)
	}
	
	all (path, handler) {
		if (typeof path === 'function') {
			checkfn(path, 'handler');
			if (this.handler) throw new ServerError(`can not add handler in presence of other at path (${this.path})`);
			this.handler = path;
			return this;
		}
		return this.route(path, handler);
	}
	connect (path, handler) {
		if (typeof path === 'function') return this.method('connect', path);
		return this.route(path).method('connect', handler)
	}
	delete (path, handler) {
		if (typeof path === 'function') return this.method('delete', path);
		return this.route(path).method('delete', handler)
	}
	get (path, handler) {
		if (typeof path === 'function') return this.method('get', path);
		return this.route(path).method('get', handler)
	}
	head (path, handler) {
		if (typeof path === 'function') return this.method('head', path);
		return this.route(path).method('head', handler)
	}
	options (path, handler) {
		if (typeof path === 'function') return this.method('options', path);
		return this.route(path).method('options', handler)
	}
	patch (path, handler) {
		if (typeof path === 'function') return this.method('patch', path);
		return this.route(path).method('patch', handler)
	}
	post (path, handler) {
		if (typeof path === 'function') return this.method('post', path);
		return this.route(path).method('post', handler)
	}
	put (path, handler) {
		if (typeof path === 'function') return this.method('put', path);
		return this.route(path).method('put', handler)
	}
	trace (path, handler) {
		if (typeof path === 'function') return this.method('trace', path);
		return this.route(path).method('trace', handler)
	}
}