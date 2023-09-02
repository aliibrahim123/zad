//number prompt

import { create } from './core.js';
import { checkstr, checknb } from '../check.js';

var stdin = process.stdin;
var stdout = process.stdout;

export var number = (msg, opts = {}) => new Promise(resolve => {
	var { initial, min, max, float, step } = {
		initial: 0,
		min: 0,
		max: 100,
		float: false,
		step: 1,
		...opts
	}
	
	//check arguments
	checkstr(msg, 'message');
	checknb(initial, 'initial');
	checknb(min, 'min');
	checknb(max, 'max');
	checknb(step, 'step');
	
	//handle creation and display prompt
	var lines = msg.split('\n');
	var [rl, close] = create({prompt: lines[lines.length -1]});
	stdout.write(msg);
	var nb = initial;
	
	var keypress = (_, key) => {
		if (key.name === 'return') return; //if key = enter
		
		//update number
		if (key.name === 'up' || key.name === 'right') nb += step;
		else if (key.name === 'down' || key.name === 'left') nb -= step;
		else nb = Number(rl.line);
		nb = Number.isNaN(nb) ? initial : Math.max(min, Math.min(max, nb));
		
		//rerender line
		rl.line = String(nb);
		stdout.clearLine(0);
		rl.prompt();
		stdout.write(rl.line);
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