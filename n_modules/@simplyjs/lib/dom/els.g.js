import * as $els from './els.js';

globalThis.$els = { ...$els };

export * from './els.js';
export default { ...$els };