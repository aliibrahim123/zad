//cli framework

import { checkstr, checkpInt } from './check.js';
import { Command } from './base/command.js';
import { Argument } from './base/argument.js';
import { Option } from './base/option.js';
import { parse } from './base/parse.js';
import { help } from './base/help.js';

class CLI {
	constructor (name = '', summary = '', version = '0.0.0', config, rootCommand) {
		checkstr(name, 'name');
		this.name = name;
		checkstr(version, 'version');
		this.version = version;
		this.config = {
			logHelpIfEmptyArgs: true, //log help if no args is provided
			passRemainingArgs: true, //pass remaining arguments to args.$remained
			allowUnknownOpts: true, //allow unknown options
			helpMaxWidth: 80,
			...config
		};
		checkpInt(this.config.helpMaxWidth, 'helpMaxWidth');
		this.rootCommand = new Command(undefined, rootCommand ? rootCommand : name, summary);
	}
	command (...args) {
		return new Command(this.rootCommand, ...args);
	}
	argument (...args) {
		return this.rootCommand.argument(...args)
	}
	option (...args) {
		return this.rootCommand.option(...args)
	}
	handle (fn) {
		this.rootCommand.handle(fn);
		return this
	}
	describe (...args) {
		this.rootCommand.describe(...args);
		return this
	}
	error (msg) {
		console.error(msg);
		process.exit()
	}
	help (command = this.rootCommand) {
		help(this, command)
	}
	parse (args = process.argv.slice(2)) {
		parse(args, this)
	}
}

var make = (name, summary, version, config, commands) => new CLI(name, summary, version, config, commands);

export {
	CLI,
	make,
	Command,
	Argument,
	Option
};

export default make