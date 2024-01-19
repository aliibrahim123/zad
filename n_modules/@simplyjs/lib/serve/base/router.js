//router class

import { checkarr, checkfn } from '../check.js';
import { Route } from './route.js';
import { addRoute } from './addRoute.js';
import { handleRoute } from './handleRoute.js';
import { errorSymbol } from './symbols/errors.js';

export class Router {
	constructor (middlewares = [], opts = {}) {
		//handle middlewares
		this.middlewares = [];
		this.postMiddlewares = [];
		checkarr(middlewares, 'middlewares');
		middlewares.forEach((middleware, i) => {
			checkfn(middleware, `middleware at index (${i})`);
			if (middleware.isPost) this.postMiddlewares.push(middleware);
			else this.middlewares.push(middleware);
		});
		
		//handle opts
		var { sendOnDone } = {
			sendOnDone: true,
			...opts
		};
		this.sendOnDone = sendOnDone;
		
		//handle routes
		this.root = new Route();
		
		//handle listner
		this.listener = this.handle.bind(this);
		
		this.errors = {};
	}
	
	handle (req, res, ctx = {}) {
		handleRoute(this, req, res, ctx)
	}
	
	use (...middlewares) {
		middlewares.forEach((middleware, i) => checkfn(middleware, `middleware at index (${i})`));
		this.middlewares.push(...middlewares)
	}
	
	error (error, status, req, res, ...args) {
		if (this.errors[error]) this.errors[error](status, req, res, ...args);
		else {
			res.writeHead(status);
			res.end()
		}
		return errorSymbol;
	}
	
	route (path, handler, opts = {}) {
		return addRoute(path, this.root, this, handler, opts, Route)
	}
	
	all (path, handler) {
		return this.route(path, handler)
	}
	connect (path, handler) {
		return this.route(path).method('connect', handler)
	}
	delete (path, handler) {
		return this.route(path).method('delete', handler)
	}
	get (path, handler) {
		return this.route(path).method('get', handler)
	}
	head (path, handler) {
		return this.route(path).method('head', handler)
	}
	options (path, handler) {
		return this.route(path).method('options', handler)
	}
	patch (path, handler) {
		return this.route(path).method('patch', handler)
	}
	post (path, handler) {
		return this.route(path).method('post', handler)
	}
	put (path, handler) {
		return this.route(path).method('put', handler)
	}
	trace (path, handler) {
		return this.route(path).method('trace', handler)
	}
}