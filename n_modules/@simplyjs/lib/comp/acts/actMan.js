//action manager
//defining and handling actions on elements

import { checkstr, checkcomp, checkfn, CompError } from '../check.js';
import { compActs } from './comp.js';
import { bindActs } from './bind.js';
import { setActs } from './set.js';
import { onActs } from './on.js';

var actManager = {
	actions: {
		...compActs,
		...bindActs,
		...setActs,
		...onActs
	},
	add (type, action) {
		checkstr(type, 'type', 'action');
		checkfn(action, 'action', 'action');
		this.actions[type] = action
	},
	do (comp, action) {
		checkcomp(comp);
		if (!action?.type || !(action.type in this.actions)) throw new CompError('action: undefined action type (' + action?.type + ')');
		this.actions[action.type](comp, action);
	}
}

export { actManager }