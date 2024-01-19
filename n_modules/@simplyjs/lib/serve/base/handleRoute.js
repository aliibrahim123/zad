//handle routing

import { errorSymbol, undefined_route, no_handler, undefined_method } from './symbols/errors.js';
import { Not_Found, Method_Not_Allowed } from './symbols/httpStatus.js';

export var handleRoute = async (router, req, res, ctx) => {
	//add init ctx props
	var params = ctx.params = {};
	ctx.router = router;
	
	//get route
	var path = req.url.split('/'), curRoute = router.root;
	for (let i = 1; i < path.length; i++) {
		let name = path[i];
		
		if (req.url === '/') break;
		
		//normal route
		if (curRoute.routes[name]) curRoute = curRoute.routes[name];
		
		//parametric route
		else if (curRoute.routes['[PARAM]']) {
			curRoute = curRoute.routes['[PARAM]'];
			params[curRoute.name] = name
		}
		
		//portal route
		else if (curRoute.portal) {
			ctx.path = path.slice(i);
			break
		}
		
		//else return error
		else return router.error(undefined_route, Not_Found, req, res)
	}
	
	//in some edge cases, path in portal route is not included if it is the last route
	if (curRoute.portal && !ctx.path) ctx.path = [];
	
	//get handler
	var method = req.method.toLowerCase(), handler = curRoute.handler;
	if (!handler) return router.error(no_handler, Not_Found, req, res, curRoute);
	if (typeof handler === 'object') {
		if (handler[method]) handler = handler[method];
		else return router.error(undefined_method, Method_Not_Allowed, req, res, method);
	}
	
	//handle middlewares
	var middlewares = router.middlewares, postMiddlewares = router.postMiddlewares;
	for (let i = 0; i < middlewares.length; i++) {
		let result = await middlewares[i](req, res, ctx);
		if (result === errorSymbol) return;
	}
	
	//call handler
	await handler(req, res, ctx)
	
	//handle postMiddlewares
	for (let i = 0; i < postMiddlewares.length; i++) {
		let result = await postMiddlewares[i](req, res, ctx);
		if (result === errorSymbol) return;
	}
	
	//send
	if (router.sendOnDone) res.end()
}