import { ChainedDom } from './chain.js';
import chain from './chain.js';
import $el from './base.g.js';

Object.assign($el, { ChainedDom, chain });

export default chain;
export { ChainedDom }