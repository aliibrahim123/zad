//attacher handler

import { query } from '../base.js';

var hasVisit = Symbol('router:visit');

export var attach = (router) => {
	var attr = router.opts.attr;
	
	//handle link interception
	query('a' + (attr ? `[${attr}]` : '')).forEach(el => {
		if (el[hasVisit]) return; //skip visitid
		if (!el.href.includes(location.origin)) return; //skip non same origin
		el.addEventListener('click', (e) => {
			e.preventDefault();
			router.go(el.href)
		});
		el[hasVisit] = true
	});
	
	//trigger attach event
	router.events.trigger('attach', router);
}