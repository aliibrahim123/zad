//ansi escape code

import * as style from './ansi/style.js';
import { styler } from './ansi/styler.js';
import * as cursor from './ansi/cursor.js';
import { checkstr } from './check.js';

var code = (name, ...args) => {
	checkstr(name, 'name');
	return '\x1b[' + args.join(';') + name
}

export default {
	code, style, styler, cursor
}

export {
	code, style, styler, cursor
}

export * from './ansi/style.js';
export * from './ansi/cursor.js';