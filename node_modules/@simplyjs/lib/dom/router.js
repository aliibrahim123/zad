//zero refresh router

import $events from '../com/structure/events.js';
import { attach } from './router/attacher.js';
import { handleRoute } from './router/handleRoute.js';
import { checkstr, checkfn } from './router/check.js';
import { errorPage } from './router/errorPage.js';

export class ZRRouter {
	constructor (opts = {}) {
		this.opts = {
			transitions: true, //view transitions api
			attr: '', //"a" element attribute to intercept
			errorPage,
			...opts
		}
		checkstr(this.opts.attr, 'attribute');
		checkfn(this.opts.errorPage, 'error page');
		
		//handle evetns
		this.events = $events();
		this.events.add('before-fetch');
		this.events.add('after-fetch');
		this.events.add('before-update');
		this.events.add('after-update');
		this.events.add('attach');
		this.events.add('error');
		this.events.add('route');
		
		//handle popstate events
		window.addEventListener('popstate', () => this.go(''));
		
		this.lastUrl = location;
	}
	
	on (name, fn) {
		this.events.on(name, fn)
	}
	off (name, fn) {
		this.events.off(name, fn)
	}
	once (name, fn) {
		this.events.once(name, fn)
	}
	
	attachToDom () {
		attach(this)
	}
	
	go (url) {
		checkstr(url, 'url');
		
		//transform url to full url
		var fullUrl = url === '' ? location : new URL(url, location.href);
		
		this.events.trigger('route', this, fullUrl);
		
		//handle routing
		handleRoute(this, fullUrl);
		
		//update lastUrl
		this.lastUrl = new URL(fullUrl.href);
	}
	back () {
		history.back()
	}
	forward () {
		history.forward()
	}
}

var $router = (opts) => new ZRRouter(opts);
$router.ZRRouter = ZRRouter;

export default $router;