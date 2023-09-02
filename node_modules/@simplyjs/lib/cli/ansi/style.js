//style escape codes

import { checkstr, checkbyte } from '../check.js';

export var reset = '\x1b[0m';

var format = (str = false, start, end) => {
	if (str === false) return '\x1b[' + start + 'm';
	return '\x1b[' + start + 'm' + str + '\x1b[' + end + 'm'
}

//text modifiers
export var bold          = (str = false) => format(str,  1, 22);
export var dim           = (str = false) => format(str,  2, 22);
export var italic        = (str = false) => format(str,  3, 23);
export var underline     = (str = false) => format(str,  4, 24);
export var overline      = (str = false) => format(str, 53, 55);
export var inverse       = (str = false) => format(str,  7, 27);
export var hidden        = (str = false) => format(str,  8, 28);
export var strikethrough = (str = false) => format(str,  9, 29);

export var noBold =          '\x1b[22m';
export var noDim =           '\x1b[22m';
export var noItalic =        '\x1b[23m';
export var noUnderline =     '\x1b[24m';
export var noOverline =      '\x1b[55m';
export var noInverse =       '\x1b[27m';
export var noHidden =        '\x1b[28m';
export var noStrikethrough = '\x1b[29m';

//forground colors
export var Default = '\x1b[39m';

export var black   = (str = false) => format(str, 30, 39);
export var red     = (str = false) => format(str, 31, 39);
export var green   = (str = false) => format(str, 32, 39);
export var yellow  = (str = false) => format(str, 33, 39);
export var blue    = (str = false) => format(str, 34, 39);
export var magenta = (str = false) => format(str, 35, 39);
export var cyan    = (str = false) => format(str, 36, 39);
export var white   = (str = false) => format(str, 37, 39);

export var blackBright   = (str = false) => format(str, 90, 39);
export var redBright     = (str = false) => format(str, 91, 39);
export var greenBright   = (str = false) => format(str, 92, 39);
export var yellowBright  = (str = false) => format(str, 93, 39);
export var blueBright    = (str = false) => format(str, 94, 39);
export var magentaBright = (str = false) => format(str, 95, 39);
export var cyanBright    = (str = false) => format(str, 96, 39);
export var whiteBright   = (str = false) => format(str, 97, 39);

export var ansi256 = (index, str = false) => {
	checkbyte(index, 'index', true);
	return format(str, '38;5;' + index, 39)
}
export var ansiRGB = (r, g, b, str = false) => {
	checkbyte(r, 'red');
	checkbyte(g, 'green');
	checkbyte(b, 'blue');
	return format(str, `38;2;${r};${g};${b}`, 39)
}

//background colors
export var bgDefault = '\x1b[49m';

export var bgBlack   = (str = false) => format(str, 40, 49);
export var bgRed 	 = (str = false) => format(str, 41, 49);
export var bgGreen   = (str = false) => format(str, 42, 49);
export var bgYellow  = (str = false) => format(str, 43, 49);
export var bgBlue 	 = (str = false) => format(str, 44, 49);
export var bgMagenta = (str = false) => format(str, 45, 49);
export var bgCyan 	 = (str = false) => format(str, 46, 49);
export var bgWhite   = (str = false) => format(str, 47, 49);

export var bgBlackBright   = (str = false) => format(str, 100, 49);
export var bgRedBright     = (str = false) => format(str, 101, 49);
export var bgGreenBright   = (str = false) => format(str, 102, 49);
export var bgYellowBright  = (str = false) => format(str, 103, 49);
export var bgBlueBright    = (str = false) => format(str, 104, 49);
export var bgMagentaBright = (str = false) => format(str, 105, 49);
export var bgCyanBright    = (str = false) => format(str, 106, 49);
export var bgWhiteBright   = (str = false) => format(str, 107, 49);

export var bgAnsi256 = (index, str = false) => {
	checkbyte(index, 'index', true);
	return format(str, '48;5;' + index, 49)
}
export var bgAnsiRGB = (r, g, b, str = false) => {
	checkbyte(r, 'red');
	checkbyte(g, 'green');
	checkbyte(b, 'blue');
	return format(str, `48;2;${r};${g};${b}`, 49)
}