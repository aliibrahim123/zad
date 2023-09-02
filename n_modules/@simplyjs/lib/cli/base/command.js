//command class

import { checkfn, checkstr, checkarr, throwNotStrOrArr } from '../check.js';
import { Argument } from './argument.js';
import { Option } from './option.js';
import { baseHelpLayout } from './help.js';

export class Command {
	constructor (root, name, summary = '', handler = () => {}) {
		this.root = root;
		
		//define and extract variables
		var description = '', aliases = [], helpLayout = baseHelpLayout, args = [], opts = [], commands = [];
		if (typeof name === 'object' && name !== null) ({name, description, summary, aliases, helpLayout, args, opts, commands, handler} = {
			name: '',
			description: '',
			summary: '',
			aliases: [],
			helpLayout: baseHelpLayout,
			args: [],
			opts: [],
			commands: [],
			handler: () => {},
			...name
		});
		
		//handle name and description
		checkstr(name, 'name');
		this.name = name;
		checkstr(summary, 'summary');
		this.summary = summary;
		checkstr(description, 'description');
		this.description = '';
		checkarr(aliases, 'aliases');
		this.aliases = aliases;
		checkarr(helpLayout, 'helpLayout');
		this.helpLayout = helpLayout;
		
		//handle args and opts
		this.requiredArgs = [];
		this.optionalArgs = [];
		this.opts = [];
		this.optMap = {};
		
		this.variadicArg = null;
		
		checkarr(args, 'arguments');
		args.forEach(arg => this.argument(arg));
		checkarr(opts, 'options');
		opts.forEach(opt => this.option(opt));
		
		//handle handler and commands
		if (handler !== undefined) checkfn(handler, 'handler');
		this.handler = handler || (() => {});
		
		this.commands = [];
		this.commandMap = {};
		commands.forEach(command => this.command(command))
		
		//connecting to root
		if (root) {
			root.commands.push(this);
			root.commandMap[name] = this;
			aliases.forEach(alias => root.commandMap[alias] = this)
		}
	}
	describe (description, summary) {
		if (summary) [summary, description] = [description, summary];
		else summary = this.summary;
		checkstr(description, 'description');
		this.description = description;
		checkstr(summary, 'summary');
		this.summary = summary;
		return this
	}
	addAlias (alias) {
		if (typeof alias === 'string') {
			this.aliases.push(alias);
			if (this.root) this.root.commandMap[alias] = this;
		} else if (Array.isArray(alias)) {
			this.aliases.push(...alias);
			if (this.root) alias.forEach(alias => this.root.commandMap[alias] = this)
		} else throwNotStrOrArr(alias, 'alias');
		return this
	}
	handle (fn) {
		checkfn(fn, 'handler');
		this.handler = fn;
		return this
	}
	command (...args) {
		return new Command(this, ...args);
	}
	argument (...args) {
		return new Argument(this, ...args)
	}
	option (...args) {
		return new Option(this, ...args)
	}
}