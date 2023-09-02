//argument class

import { checkstr, checkarr, checkfn } from '../check.js';

export class Argument {
	constructor (command, exp, description = '', Default = '', options = {}) {
		this.command = command;
		
		//define and extract variables
		var name, type, choices, converter, required = true, variadic = false;
		if (typeof exp === 'object' && exp !== null) ({name, description, Default, type, choices, converter, required, variadic} = {
			name: '',
			description: '',
			Default: '',
			type: '',
			choices: [],
			converter: v => v,
			required: true,
			variadic: false,
			...exp
		}); else {
			({type, choices, converter} = {
				type: '',
				choices: [],
				converter: v => v,
				...options
			});
			
			//parse expression
			checkstr(exp, 'expression');
			if (exp.startsWith('<')) {
				required = true;
				name = exp.slice(1,-1)
			} else if (exp.startsWith('[')) {
				required = false;
				name = exp.slice(1,-1)
			} else throw new SyntaxError('cli: argument expression (' + exp + ') is not wrapped with [] or <>');
			if (name.startsWith('...')) {
				variadic = true;
				name = name.slice(3)
			}
		}
		
		//handle name and description
		checkstr(name, 'name');
		this.name = name;
		checkstr(description, 'description');
		this.description = description;
		
		//handle variadic checking
		if (command.variadicArg) {
			if (variadic) throw new Error('cli: adding variadic argument (' + name + ') in presence of other');
			if (command.variadicArg.required) throw new Error('cli: adding argument (' + name + ') in presence of required variadic argument');
			if (!required) throw new Error('cli: adding optional argument (' + name + ') in presence of optional variadic argument');
		}
		if (variadic && required && command.optionalArgs.length !== 0) 
			throw new Error('cli: adding required variadic argument (' + name + ') in presence of optional arguments');
		
		//handle argument options
		this.Default = Default === '' && variadic ? [] : Default;
		checkarr(choices, 'choices');
		this.choices = choices;
		checkstr(type, 'type');
		this.type = type;
		checkfn(converter, 'converter');
		this.converter = converter;
		
		this.required = required;
		this.variadic = variadic;
		
		//add to command
		if (variadic) command.variadicArg = this;
		else if (required) command.requiredArgs.push(this);
		else command.optionalArgs.push(this);
	}
	ofType (type) {
		checkstr(type, 'type');
		this.type = type;
		return this
	}
	setChoices (choices) {
		checkarr(choices, 'choices');
		this.choices = choices;
		return this
	}
	setConverter (converter) {
		checkfn(converter, 'converter');
		this.converter = converter;
		return this
	}
	argument (...args) {
		return this.command.argument(...args)
	}
	option (...args) {
		return this.command.option(...args)
	}
	handle (...args) {
		return this.command.handle(...args)
	}
}