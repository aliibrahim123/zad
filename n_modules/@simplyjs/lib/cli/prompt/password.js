//password prompt

import { create } from './core.js';
import { checkstr } from '../check.js';

var stdin = process.stdin;
var stdout = process.stdout;

export var password = (msg, opts = {}) => new Promise(resolve => {
	var { replacement } = {
		replacement: '*',
		...opts
	}
	
	//check arguments
	checkstr(msg, 'message');
	checkstr(replacement, 'replacement');
	
	//handle creation and display prompt
	var lines = msg.split('\n');
	var [rl, close] = create({prompt: lines[lines.length -1], historySize: 0});
	stdout.write(msg);
	
	var keypress = (_, key) => {
		if (key.name === 'return') return; //if key = enter
		
		//rerender line
		stdout.clearLine(0);
		rl.prompt();
		stdout.write(replacement.repeat(rl.line.length));
		rl.cursor = rl.line.length
	}
	stdin.on('keypress', keypress);
	
	//handle complete
	rl.on('line', (str) => {
		close();
		stdin.off('keypress', keypress);
		resolve(str);
	})
});