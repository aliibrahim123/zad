//add route at path

import { checkstr } from '../check.js';
import { ServerError } from './error.js';

//consume Route as argument since cant import dependent
export var addRoute = (path, root, router, handler, opts, Route) => {
	checkstr(path, 'path');
	return path.split('/').reduce((parent, name, i, arr) => {
		var isLast = i === arr.length -1;
		//case parametric route
		if (name[0] === '[') {			
			if (parent.routes['[PARAM]']) {
				let route = parent.routes['[PARAM]'];
				if (route.name !== name.slice(1, -1)) throw new ServerError(`serve: accessing parametric route (${route.path}) with name (${name})`);
				return route
			}
			return parent.routes['[PARAM]'] = new Route(router, parent, isLast && handler, name, opts);
		}
		
		//case normal route
		if (parent.routes[name]) return parent.routes[name];
		return parent.routes[name] = new Route(router, parent, isLast && handler, name, opts)
	}, root)
}