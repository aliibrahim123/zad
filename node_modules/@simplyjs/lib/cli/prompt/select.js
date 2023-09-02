//select prompt

import { create } from './core.js';
import { blue } from '../ansi/style.js';
import { prevLine, eraseFrom } from '../ansi/cursor.js';
import { PassThrough } from 'node:stream';
import { checkstr, checkfn, checkarr } from '../check.js';

var stdin = process.stdin;
var stdout = process.stdout;

var clearScrean = (upCols) => stdout.write(prevLine(upCols) + eraseFrom);

var logChoices = (choices, selected, prefix, formatSelect) => stdout.write(choices.map(
	(choice, i) => prefix + (i === selected ? formatSelect(choice) : choice)
).join('\n'));

export var select = (msg, choices, opts = {}) => new Promise(resolve => {
	var { prefix, formatSelect } = {
		prefix: '  -',
		formatSelect: blue
	}
	
	//check arguments
	checkstr(msg, 'message');
	checkstr(prefix, 'prefix');
	checkarr(choices, 'choices');
	checkfn(formatSelect, 'formatSelect');
	
	//handle creation and display prompt
	var lines = msg.split('\n'), selected = 0;
	var [rl, close] = create({prompt: lines[lines.length -1], output: PassThrough});
	stdout.write(msg + '\n');
	logChoices(choices, 0, prefix, formatSelect);
	
	var keypress = (_, key) => {
		if (key.name === 'up' || key.name === 'right') selected = Math.max(0, selected -1);
		if (key.name === 'down' || key.name === 'left') selected = Math.min(choices.length -1, selected +1);
		
		clearScrean(choices.length -1);
		logChoices(choices, selected, prefix, formatSelect);
	}
	stdin.on('keypress', keypress);
	
	//handle complete
	rl.on('line', (str) => {
		close();
		stdin.off('keypress', keypress);
		clearScrean(choices.length -1);
		console.log(choices[selected])
		resolve(choices[selected]);
	})
});