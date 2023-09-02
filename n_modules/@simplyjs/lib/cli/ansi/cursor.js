//cursor escape codes

import { checkpInt } from '../check.js';

export var moveTo = (line, column) => {
	checkpInt(line, 'line');
	checkpInt(column, 'column');
	return `\x1b[${line};${column}H`
};

export var up = (line) => {
	checkpInt(line, 'line');
	return '\x1b[' + line + 'A';
}

export var down = (line) => {
	checkpInt(line, 'line');
	return '\x1b[' + line + 'B';
}

export var forward = (column) => {
	checkpInt(column, 'column');
	return '\x1b[' + column + 'C';
}

export var backward = (column) => {
	checkpInt(column, 'column');
	return '\x1b[' + column + 'D';
}

export var nextLine = (line) => {
	checkpInt(line, 'line');
	return '\x1b[' + line + 'E';
}

export var prevLine = (line) => {
	checkpInt(line, 'line');
	return '\x1b[' + line + 'F';
}

export var moveToCol = (column) => {
	checkpInt(column, 'column');
	return '\x1b[' + column + 'G';
}

export var savePos = '\x1b[s';
export var restorePos = '\x1b[u';

export var hide = '\x1b[?25l';
export var show = '\x1b[?25h';

export var scrollUp = (line) => {
	checkpInt(line, 'line');
	return '\x1b[' + line + 'S';
}

export var scrollDown = (line) => {
	checkpInt(line, 'line');
	return '\x1b[' + line + 'T';
}

export var eraseFrom = '\x1b[0J';
export var eraseTo = '\x1b[1J';
export var eraseAll= '\x1b[2J';

export var eraseLineFrom = '\x1b[0K';
export var eraseLineTo = '\x1b[1K';
export var eraseLine= '\x1b[2K';