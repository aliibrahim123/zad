import { baseBody } from './body.js';

if (globalThis.$serve) {
	$serve.baseBody = baseBody;
} else globalThis.$serve = {
	baseBody
};

export * from './body.js';
export default $serve;