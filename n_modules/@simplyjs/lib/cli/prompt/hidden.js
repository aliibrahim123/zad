//hidden prompt

import { create } from './core.js';
import { checkstr } from '../check.js';
import { PassThrough } from 'node:stream';

var stdin = process.stdin;
var stdout = process.stdout;

export var hidden = (msg) => new Promise(resolve => {
	//check arguments
	checkstr(msg, 'message');
	
	var lines = msg.split('\n');
	var [rl, close] = create({prompt: lines[lines.length -1], output: PassThrough});
	stdout.write(msg);
	
	rl.on('line', (str) => {
		close();
		stdout.write('\n');
		resolve(str);
	})
});