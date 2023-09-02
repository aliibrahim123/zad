//combinators pattern helpers

import { check } from './base.js';

export var not = (pattern) => (value) => !check(value, pattern);

export var anyOff = (...patters) => (value) => patters.some(p => check(value, p));

export var allOff = (...patters) => (value) => patters.every(p => check(value, p));