import prompt from './prompt.js';

if (globalThis.$cli) {
	$cli.prompt = prompt;
	$cli.ask = prompt.ask;
} else globalThis.$cli = {
	prompt,
	ask: prompt.ask
};

export * from './prompt.js';
export default prompt;