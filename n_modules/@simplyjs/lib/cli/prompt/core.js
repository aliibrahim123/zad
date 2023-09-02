//main logic

import { createInterface } from 'node:readline/promises';
import { emitKeypressEvents } from 'node:readline';

var stdin = process.stdin;
var stdout = process.stdout;

export var create = (obj) => {
	var rl = createInterface({
		input: stdin,
		output: stdout,
		...obj
	});
	emitKeypressEvents(stdin, rl);
	if (stdin.isTTY) stdin.setRawMode(true);
	
	var close = () => {
		if (stdin.isTTY) stdin.setRawMode(false);
		rl.close()
	}
	
	return [rl, close]
}