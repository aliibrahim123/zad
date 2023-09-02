//various array getters

import { checkarr } from './check.js';

export var head = (arr) => checkarr(arr) && arr[0];
export var last = (arr) => checkarr(arr) && arr[arr.length -1];
export var initial = (arr) => checkarr && arr.slice(0, arr.length -1);
export var tail = (arr) => checkarr && arr.slice(1);