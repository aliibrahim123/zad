//confirm prompt

import { create } from './core.js';
import { PassThrough } from 'node:stream';
import { checkstr } from '../check.js';

var stdin = process.stdin;
var stdout = process.stdout;

export var confirm = (msg) => new Promise(resolve => {
	//check arguments
	checkstr(msg, 'message');
	
	//handle creation and desplay prompt
	msg += '(y/n)'
	var lines = msg.split('\n');
	var [rl, close] = create({prompt: lines[lines.length -1], output: PassThrough});
	stdout.write(msg);
	
	var handle = (value) => {
		close();
		stdout.write('\n');
		stdin.off('keypress', keypress);
		resolve(value);
	}
	
	var keypress = (_, key) => {
		if (key.name === 'return') handle(true); //if key = enter
		if (key.name === 'y') handle(true);
		if (key.name === 'n') handle(false);
	}
	stdin.on('keypress', keypress);
});