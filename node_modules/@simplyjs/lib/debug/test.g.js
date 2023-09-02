import $test from './test.js';

globalThis.$test = $test;

export * from './test.js';
export default $test;