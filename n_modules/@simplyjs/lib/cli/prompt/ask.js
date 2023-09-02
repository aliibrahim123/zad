//simple prompt

import { create } from './core.js';
import { checkstr, checkfn } from '../check.js';

var stdout = process.stdout;

export var ask = (msg, Default = '', opts = {}) => new Promise(resolve => {
	var { completer, trim, validate, prompt } = {
		completer: (str) => [[], str],
		trim: true,
		validate: null,
		prompt: '> ',
		...opts
	}
	
	//check arguments
	checkstr(msg, 'message');
	checkstr(prompt, 'prompt');
	checkfn(completer, 'completer');
	if (validate !== null) checkfn(validate, 'validate');
	
	//handle creation and desplay prompt
	var [rl, close] = create({completer, prompt});
	stdout.write(msg);
	if (msg.endsWith('\n')) rl.prompt();
	
	//handle complete
	rl.on('line', (str) => { 
		if (trim) str = str.trim();
		if (validate && !validate(str)) {
			console.error('unvalid answer');
			return rl.prompt()
		}
		close();
		resolve(str || Default);
	})
});