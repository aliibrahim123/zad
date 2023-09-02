//core pattern helpers

import { check } from './base.js';

export var is = (pattern) => value => check(value, pattern)

export var isStrictly = (x) => value => value === x;

export var isLosely = (x) => value => value == x;

export var isNotStrictly = (x) => value => value !== x;

export var isNotLosely = (x) => value => value != x;

export var has = (prop) => value => value !== null && value !== undefined && value[prop] !== undefined;

export var hasOwn = (prop) => value => value !== null && value !== undefined && value.hasOwnProperty(prop);

export var callAndCheck = (name, p, ...args) => value => value !== null && value !== undefined && typeof value[name] === 'function' && check(value[name](...args), p)