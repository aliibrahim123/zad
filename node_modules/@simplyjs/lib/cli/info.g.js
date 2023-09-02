import * as info from './info.js';

if (globalThis.$cli) Object.assign($cli, info);
else $cli = {...info};

export * from './info.js';
export default info;
export $cli