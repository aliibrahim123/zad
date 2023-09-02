//help handler

import { checkcommand } from '../check.js';

export var baseHelpLayout = [
	{
		type: 'header'
	}, {
		type: 'usage'
	}, {
		type: 'arguments'
	}, {
		type: 'options',
		category: ''
	}, {
		type: 'commands'
	}
];

var splitIntoLines = (str, max) => { //split string into an array of strings of max length while preserving words
	var result = [];
	str.split(' ').forEach((word, i) => {
		if (i === 0) result.push(word)
		else if (result[result.length -1].length + word.length + 1 > max) result.push(word);
		else result[result.length -1] += ' ' + word
	});
	return result
}

var handleArgExp = (arg) => {
	var name = arg.name || arg.argName;
	var prefix = arg.variadic ? '...' : '';
	return arg.required ? `<${prefix}${name}>` : `[${prefix}${name}]`
}

export var help = (cli, command) => {
	checkcommand(command);
	var maxWidth = cli.config.helpMaxWidth;
	console.log('\n' + command.helpLayout.map(section => {
		if (typeof section === 'string') return splitIntoLines(section, maxWidth).join('\n');
		else if (typeof section === 'string') return splitIntoLines(section(command), maxWidth).join('\n');
		else if (section?.type === 'header') return handleHeader(command, maxWidth);
		else if (section?.type === 'usage') return handleUsage(command, maxWidth);
		else if (section?.type === 'arguments') return handleArgs(command, maxWidth);
		else if (section?.type === 'options') return handleOpts(command, section.category, maxWidth);
		else if (section?.type === 'commands') return handleCommands(command, maxWidth);
		else throw new Error('cli: undefined help section type (' + section?.type + ')');
	}).filter(Boolean).join('\n\n'))
};

var handleHeader = (command, maxWidth) => `${command.name}: ${command.summary}` + (
	command.description ? splitIntoLines('\n' + command.description, maxWidth).join('\n') : '');

var handleUsage = (command, maxWidth) => {
	var commands = [command.name], curCommand = command;
	while (curCommand.root) {
		curCommand = curCommand.root;
		commands.push(curCommand.name)
	}
	
	var requiredArgs = command.requiredArgs, optionalArgs = command.optionalArgs, variadicArg = command.variadicArg;
	return splitIntoLines(`usage: ${commands.reverse().join(' ')} ${
		requiredArgs.length ? requiredArgs.map(handleArgExp).join(' ') + ' ' : ''
	}${
		optionalArgs.length ? optionalArgs.map(handleArgExp).join(' ') + ' ' : ''
	}${
		variadicArg ? handleArgExp(variadicArg) + ' ' : ''
	}${command.opts.length ? '[options]' : ''}`, maxWidth)
};

var table2 = (cols, maxWidth1, maxWidth) => { //generate a table of 2 columns
	var result = '';
	
	//calculate widths
	//width1 = Math.min(longestName1, maxWidth1)
	var width1 = Math.min(cols.reduce((res, cur) => res > cur[0].length ? res : cur[0].length, 0), maxWidth1),
		width2 = maxWidth - width1 - 4;
	
	//loop through rows
	for (let rowInd = 0; rowInd < cols.length; rowInd++) {
		//handle column line splitting
		var col1Lines = splitIntoLines(cols[rowInd][0], width1),
			col2Lines = splitIntoLines(cols[rowInd][1], width2);
		
		for (let lineInd = 0, len = Math.max(col1Lines.length, col2Lines.length); lineInd < len; lineInd++) {
			result += '  ' + (col1Lines[lineInd] || '').padEnd(width1);
			result += '  ' + (col2Lines[lineInd] || '') + '\n';
		}
	}
	return result.slice(0, -1) //remove the last new line
}

var handleArgDesc = (arg) => { //handle argument description
	var additionalDesc = [];
	if (arg.type) additionalDesc.push('type: ' + arg.type);
	if (String(arg.Default)) additionalDesc.push('default: ' + arg.Default);
	if (arg.choices.length) additionalDesc.push('choices: (' + arg.choices.join(', ') + ')');
	return additionalDesc.length ? arg.description + ' (' + additionalDesc.join(', ') + ')' : arg.description
}

var handleArgs = (command, maxWidth) => {
	if (command.requiredArgs.length === 0 && command.optionalArgs.length === 0 && !command.variadicArg) return '';
	return 'arguments:\n' + table2([
		...command.requiredArgs,
		...command.optionalArgs,
		command.variadicArg
	].map(arg => [handleArgExp(arg), handleArgDesc(arg)]), 20, maxWidth)
}

var handleOptName = (opt) => {
	var names = (opt.shortName ? '-' + opt.shortName + ', ' : '') + opt.longNames.map(name => '--' + name).join(', ');
	return names + (opt.argName ? ' ' + handleArgExp(opt) : '')
}

var handleOptDesc = (opt) => { //handle option description
	var additionalDesc = [];
	if (opt.type) additionalDesc.push('type: ' + opt.type);
	
	//handle default section
	var defaultDesc = [];
	if (String(opt.Default)) defaultDesc.push(opt.Default);
	if (opt.defaultTrue !== true) defaultDesc.push('specified: ' + opt.defaultTrue);
	if (opt.defaultFalse !== false) defaultDesc.push('negated: ' + opt.defaultFalse);
	if (defaultDesc.length) additionalDesc.push('default: (' + defaultDesc.join(', ') + ')');
	
	if (opt.choices.length) additionalDesc.push('choices: (' + opt.choices.join(', ') + ')');
	if (opt.conflict.length) additionalDesc.push('conflict: (' + opt.conflict.join(', ') + ')');
	if (opt.depends.length) additionalDesc.push('dependencies: (' + opt.depends.join(', ') + ')');
	return additionalDesc.length ? opt.description + ' (' + additionalDesc.join(', ') + ')' : opt.description
}

var handleOpts = (command, category, maxWidth) => {
	var opts = command.opts.filter(opt => opt.category === category);
	if (opts.length === 0) return '';
	return (category || 'options') + ':\n' + table2(
		opts.map(opt => [handleOptName(opt), handleOptDesc(opt)]), 
	40, maxWidth);
}

var handleCommands = (command, maxWidth) => {
	if (command.commands.length === 0) return '';
	return 'commands:\n' + table2(
		command.commands.map(command => [command.name, command.summary]),
	20, maxWidth);
}