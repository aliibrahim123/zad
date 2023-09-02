//action manager
//defining and handling actions on elements

import { checkstr, checkcomp, checkfn, CompError } from '../check.js';
import { useCompActs } from './useComp.js';
import { useBindActs } from './useBind.js';
import { useSetActs } from './useSet.js';
import { useOnActs } from './useOn.js';

var actManager = {
	actions: {
		...useCompActs,
		...useBindActs,
		...useSetActs,
		...useOnActs
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