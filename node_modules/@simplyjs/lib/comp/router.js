//zero refresh router

import $comp from '../comp/base.js';
import { CompError } from '../comp/base.js';
import $router from '../dom/router.js';
import { checkstr } from './check.js';
import { query } from '../dom/base.js';

var attach = (id = 'main', opts) => {
	checkstr(id, 'id', 'router');
	var router = $router(opts);
	router.on('before-update', () => $comp?.root?.remove?.());
	router.on('after-update', () => {
		var el = query('#' + id)[0];
		if (!el) throw new CompError(`router: no element with id (${id})`);
		var compType = el.getAttribute('comp-name');
		if (!compType) throw new CompError('router: root element have no attribute (comp-name)');
		$comp.setRoot(el, compType);
	});
	$comp.router = router;
	return router
}

$comp.attachRouter = attach;

export default attach;