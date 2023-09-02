import { make, CLI, Command, Argument, Option } from './base.js';

if (globalThis.$cli) {
	$cli.make = make;
	$cli.CLI = CLI;
	$cli.Command = Command;
	$cli.Argument = Argument;
	$cli.Option = Option;
} else globalThis.$cli = {
	make,
	CLI,
	Command,
	Argument,
	Option
};

export * from './base.js';
export default $cli;