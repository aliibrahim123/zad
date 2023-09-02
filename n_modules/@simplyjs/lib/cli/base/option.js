//option class

import { checkfn, checkstr, checkarr } from '../check.js';
export class Option {
	constructor (command, names, argExp = '', description = '', Default = '', options = {}) {
		this.command = command;
		
		//define and extract variables
		var shortName = '', longNames = [], defaultFalse, defaultTrue, category, type, choices, argName = '', converter, conflict, depends, required, variadic = false;
		if (names?.constructor === Object) ({shortName, longNames, argName, description, Default, defaultFalse, defaultTrue, category, type, choices, converter, conflict, depends, required, variadic} = {
			shortName: '',
			longNames: [],
			argName: '',
			description: '',
			Default: '',
			defaultFalse: false,
			defaultTrue: true,
			category: '',
			type: '',
			choices: [],
			converter: v => v,
			conflict: [],
			depends: [],
			required: false,
			variadic: false,
			...names
		}); else {
			({defaultFalse, defaultTrue, category, type, choices, converter, conflict, depends} = {
				defaultFalse: false,
				defaultTrue: true,
				category: '',
				type: '',
				choices: [],
				converter: v => v,
				conflict: [],
				depends: [],
				...options
			});
			
			//parse argument expression
			checkstr(argExp, 'argument expression');
			if (argExp !== '') {
				if (argExp.startsWith('<')) {
				required = true;
				argName = argExp.slice(1,-1)
				} else if (argExp.startsWith('[')) {
				required = false;
				argName = argExp.slice(1,-1)
				} else throw new SyntaxError('cli: option argument expression (' + argExp + ') is not wrapped with [] or <>');
				if (argName.startsWith('...')) {
					variadic = true;
					argName = argName.slice(3)
				}
			}
			
			//parse names
			checkarr(names, 'names');
			names.forEach((name, i) => {
				if (typeof name !== 'string') throw new TypeError('cli: name at index (' + i + ') of type (' + name?.constructor?.name + '), expected (String)');
				if (name.startsWith('-')) {
					if (name.startsWith('--')) return longNames.push(name.slice(2));
					name = name.slice(1)
					if (shortName) throw new Error('cli: adding short option name (' + name + ') in presence of another (' + shortName + ')');
					if (name.length !== 1) throw new SyntaxError('cli: short option name (' + name + ') of length (' + name.length + '), expected (1)');
					shortName = name
				} else throw new SyntaxError('cli: option name (' + name + ') didnt start with - or --')
			})
		}
		
		//handle name and description
		checkstr(shortName, 'shortName');
		checkarr(longNames, 'longNames');
		this.shortName = shortName;
		this.longNames = longNames;
		checkstr(argName, 'argName');
		this.argName = argName
		checkstr(description, 'description');
		this.description = description;
		checkstr(category, 'category');
		this.category = category;
		this.CCName = (longNames[0] || shortName || '').replace(/-./g, (s) => s.slice(1).toUpperCase()); //camelCase name
		
		//handle option argument options
		this.Default = Default === '' && variadic ? [] : Default; //when the option is not specified
		this.defaultFalse = defaultFalse; //when the option is negated with --no-opt
		this.defaultTrue = defaultTrue; //when the option is specified
		checkarr(choices, 'choices');
		this.choices = choices;
		checkstr(type, 'type');
		this.type = type;
		checkfn(converter, 'converter');
		this.converter = converter;
		checkarr(conflict, 'conflict');
		this.conflict = conflict;
		checkarr(depends, 'dependencies');
		this.depends = depends;
		
		this.required = required;
		this.variadic = variadic;
		
		//adding to command
		command.opts.push(this);
		command.optMap[shortName] = this;
		longNames.forEach(name => command.optMap[name] = this)
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
	setConflict (conflict) {
		checkarr(conflict, 'conflict');
		this.conflict = conflict;
		return this
	}
	setDepends (depends) {
		checkarr(depends, 'dependencies');
		this.depends = depends;
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