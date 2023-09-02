//excute function every interval

import { checkfn, checkpInt } from './check.js';

export class Ticker {
	constructor (interval, start = true, limit = false) {
		checkpInt(interval, 'interval');
		if (limit !== false) checkpInt(limit, 'limit');
		this._interval = interval; //in ms
		this.tickcount = 0;
		this.limit = limit;
		this.isStopped = !start;
		this.handlers = [];
		if (start) this.start();
	}
	get interval () {
		return this._interval
	}
	set interval (interval) {
		this._interval = interval;
		if (!this.isStopped) this.restart()
	}
	start () {
		if (this.tickcount === this.limit) return;
		this.isStopped = false;
		this.id = setInterval(this.handle.bind(this), this._interval);
		return this
	}
	stop () {
		this.isStopped = true;
		clearInterval(this.id);
		return this
	}
	restart () {
		this.stop();
		this.start()
		return this
	}
	clear (restart = true) {
		this.tickcount = 0;
		this.stop();
		if (restart) this.start();
		return this
	}
	delay (delay) {
		checkpInt(delay, 'delay');
		if (this.isStopped) return this;
		this.stop();
		setTimeout(this.start.bind(this), delay);
		return this
	}
	handle () {
		this.tickcount++;
		this.handlers.forEach(fn => fn(this.tickcount));
		if (this.limit === this.tickcount) this.stop();
	}
	addHandler (fn) {
		checkfn(fn, 'handler');
		this.handlers.push(fn);
		return this
	}
	removeHandler (fn) {
		checkfn(fn, 'handler');
		this.handlers = this.handlers.filter(h => h !== fn);
		return this
	}
	nextTick (count = 1) {
		checkpInt(count, 'count');
		var originalTick = this.tickcount;
		return new Promise ((resolve) => {
			var handler = (curTick) => {
				if (curTick - originalTick === count) {
					resolve(curTick);
					this.removeHandler(handler)
				}
			};
			this.addHandler(handler)
		});
	}
};

export var ticker = (interval, start, limit) => new Ticker(interval, start, limit)