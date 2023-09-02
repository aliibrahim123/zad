//cli prompt

import { ask } from './prompt/ask.js';
import { password } from './prompt/password.js';
import { hidden } from './prompt/hidden.js';
import { number } from './prompt/number.js';
import { confirm } from './prompt/confirm.js';
import { select } from './prompt/select.js';

export default {
	ask, password, hidden, number, confirm, select
}

export {
	ask, password, hidden, number, confirm, select
}