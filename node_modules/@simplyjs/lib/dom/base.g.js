import $el from './base.js';
import { create, query, construct } from './base.js';

globalThis.$el = $el;
Object.assign($el, { create, query, construct });

export * from './base.js';
export default $el;