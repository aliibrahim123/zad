import ansi from './ansi.js';

if (globalThis.$cli) {
	$cli.ansi = ansi;
	$cli.style = ansi.style;
	$cli.styler = ansi.styler;
	$cli.cursor = ansi.cursor;
} else globalThis.$cli = {
	ansi: ansi,
	style: ansi.style,
	styler: ansi.styler,
	cursor: ansi.cursor,
};

export * from './ansi.js';
export default ansi;