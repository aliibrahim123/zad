//parser

import { throwNotStrOrArr } from '../check.js';

//match ['arg1', '--arg2', '"big arg"', 'arg3="huge arg"']
//in 'arg1 --arg2 "big arg" arg3="huge arg"'
//visualize: https://jex.im/regulex/#!flags=g&re=%5B%5E%22%5Cs%5D%2B(%3F%3A%22%5B%5E%22%5D*%22)%3F%7C(%3F%3A%22%5B%5E%22%5D*%22)
var splitArgsRegExp = /[^"\s]+(?:"[^"]*")?|(?:"[^"]*")/g;

var toCamelCase = (str) => str.replace(/-./g, (s) => s.slice(1).toUpperCase());

export var parse = (args, cli) => {
	var i = 0;
	var { passRemainingArgs, allowUnknownOpts } = cli.config;
	//split into parts
	var parts;
	if (Array.isArray(args)) parts = args;
	else if (typeof args === 'string') parts = args.match(splitArgsRegExp) || [];
	else throwNotStrOrArr(args, 'args');
	
	//walk in command tree to get the specified command
	var command = cli.rootCommand, maybeCommand = command.commandMap[parts[i]];
	while (maybeCommand) {
		command = maybeCommand;
		i++;
		maybeCommand = command.commandMap[parts[i]];
	}
	
	//log help if possible
	if (parts.length === i && cli.config.logHelpIfEmptyArgs) return cli.help(command);
	
	var requiredArgs = command.requiredArgs,
		optionalArgs = command.optionalArgs,
		variadicArg = command.variadicArg,
		opts = command.opts;
	
	//make argument object from defaults
	var args = {};
	requiredArgs.forEach(arg => args[arg.name] = arg.Default);
	optionalArgs.forEach(arg => args[arg.name] = arg.Default);
	if (variadicArg) args[variadicArg.name] = variadicArg.Default;
	opts.forEach(opt => args[opt.CCName] = opt.Default);
	
	//mapping arguments from parts to argument object
	var visitedRArgs = 0, visitedOArgs = 0, // visited optional and required arguments count
		visitedOpts = [];
	for (undefined; i < parts.length; i++) {
		let curPart = parts[i];
		if (curPart === '-h') return cli.help(command);
		if (curPart === '-v') return console.log(cli.version);
		if (curPart === '--') { //set remaining args to passed arguments '--'
			args['--'] = parts.slice(i + 1).join(' ');
			break
		} else if (curPart.startsWith('-')) {
			i = handleOption(curPart, command, args, i, parts, visitedOpts, allowUnknownOpts, cli)
		} else {
			[visitedRArgs, visitedOArgs] = handleArgument(curPart, command, args, visitedRArgs, visitedOArgs, passRemainingArgs, cli)
		}
	}
	
	//check for post-mapping errors
	if (visitedRArgs !== requiredArgs.length)
		cli.error('argument: unspecified required arguments (' + requiredArgs.map(arg => arg.name).slice(visitedRArgs).join(', ') + ')');
	if (variadicArg?.required && args[variadicArg.name] === variadicArg.Default)
		cli.error('argument: unspecified required variadic argument (' + variadicArg.name + ')');
	opts.forEach(opt => {
		var conflicts = opt.conflict.filter(conflict => visitedOpts.includes(conflict));
		if (conflicts.length) cli.error('option: option (' + opt.CCName + ') can not be used with (' + conflicts.join(', ') + ')');
		var depends = opt.depends.filter(depend => !visitedOpts.includes(depend));
		if (depends.length) cli.error('option: option (' + opt.CCName + ') requires (' + depends.join(', ') + ') to be specified')
	});

	//call handler
	command.handler(args)
}

var argToValue = (value, arg, isArg, cli) => {
	if (value.startsWith('"')) value = value.slice(1, -1);
	if (arg.choices.length !== 0 && !arg.choices.includes(value)) 
		cli.error((isArg ? 'argument' : 'option') + ': invalid choice (' + value + ') for ' + (isArg ? 'argument (' + arg.name : 'option (' + arg.CCName) + '), expected (' + arg.choices.join(', ') + ')');
	return arg.converter(value, arg, cli)
}
var handleArgument = (curPart, command, args, visitedRArgs, visitedOArgs, passRemainingArgs, cli) => {
	var arg;
	
	//required
	if (visitedRArgs !== command.requiredArgs.length) {
		arg = command.requiredArgs[visitedRArgs];
		args[arg.name] = argToValue(curPart, arg, true, cli);
		return [visitedRArgs + 1, 0]
	}
	
	//optional
	if (visitedOArgs !== command.optionalArgs.length) { 
		arg = command.optionalArgs[visitedOArgs];
		args[arg.name] = argToValue(curPart, arg, true, cli);
		return [visitedRArgs, visitedOArgs + 1]
	} 
	
	//variadic
	if (command.variadicArg) {
		arg = command.variadicArg;
		let value = argToValue(curPart, arg, true, cli);
		if (args[arg.name]) args[arg.name].push(value);
		else args[arg.name] = [value];
		return [visitedRArgs, visitedOArgs]
	}
	
	//passed arguments
	if (passRemainingArgs) {
		if (args['--']) args['--'].push(curPart);
		else args['--'] = [curPart]
	}
	return [visitedRArgs, visitedOArgs]
}

var handleMultiShortOption = (names, command, isNegated, ivalue, secPart, args, i, cli, visitedOpts, allowUnknownOpts) => {
	names.split(/(.)/).forEach(name => {
		if (name === '') return; //splitting with regexp /(.)/ produces an array full of empty strings
		var opt = command.optMap[name];
		if (opt) {
			if (isNegated) args[opt.CCName] = opt.defaultFalse;
			else if (ivalue) args[opt.CCName] = argToValue(ivalue, opt, false, cli);
			else if (!secPart.startsWith('-')) args[opt.CCName] = argToValue(secPart, opt, false, cli);
			else args[opt.CCName] = opt.defaultTrue;
			visitedOpts.push(opt.CCName);
		} else {
			if (!allowUnknownOpts) return cli.error('option: option (' + name + ') is undefined');
			if (isNegated) args[name] = false;
			else if (ivalue) args[name] = ivalue.startsWith('"') ? ivalue.slice(1, -1) : ivalue;
			else if (!secPart.startsWith('-')) args[name] = secPart.startsWith('"') ? secPart.slice(1, -1) : secPart;
			else args[name] = true
		}
	})
	return ((secPart.startsWith('-') && !ivalue) || isNegated) ? i : i + 1
}

var handleOption = (curPart, command, args, i, parts, visitedOpts, allowUnknownOpts, cli) => {
	//split into name and value if --name=value
	var name, ivalue, value, isNegated = false, isShort = false, secPart = parts[i+1] || '-';
	[name, ivalue] = curPart.split('=');
	
	//get name
	if (name.startsWith('--')) name = name.slice(2);
	else {
		name = name.slice(1);
		isShort = true
	}
	if (name.startsWith('no-')) {
		name = name.slice(3);
		isNegated = true
	}
	
	//handle multilength short option like -abc and -p8080
	if (isShort && name.length !== 1) {
		//if second character is a digit, it is an argumented short option
		//else it is multi short option
		if (/\d/.test(name[1])) [name, ivalue] = [name.slice(0, 1), name.slice(1)];
		else return handleMultiShortOption(name, command, isNegated, ivalue, secPart, args, i, cli, visitedOpts, allowUnknownOpts);
	}
	
	var opt = command.optMap[name];
	
	//handle undefined option
	if (!opt) {
		if (!allowUnknownOpts) cli.error('option: option (' + name + ') is undefined');
		if (isNegated) value = false;
		else if (ivalue) value = ivalue.startsWith('"') ? ivalue.slice(1, -1) : ivalue;
		else value = true
		args[toCamelCase(name)] = value;
		return i
	}
	
	//handle no argument options
	else if (isNegated) value = opt.defaultFalse;
	else if (opt.argName === '') value = opt.defaultTrue;
	else if (ivalue) value = argToValue(ivalue, opt, false, cli);
	
	//handle variadic option
	else if (opt.variadic) {
		var curParts = [];
		for (i++; i < parts.length; i++) {
			if (parts[i].startsWith('-')) break;
			curParts.push(parts[i])
		}
		value = curParts.map(arg => argToValue(arg, opt, false, cli));
		if (curParts.length === 0 && opt.required) cli.error('option: required variadic option (' + name + ') argument not specified');
	}
	
	//handle one argument option
	else if (secPart.startsWith('-')) {
		value = opt.defaultTrue;
		if (opt.required) cli.error('option: required option (' + name + ') argument is not specified');
	} else {
		value = argToValue(secPart, opt, false, cli);
		i++
	}
	
	//set args
	args[opt.CCName] = value;
	visitedOpts.push(opt.CCName);
	return i
}