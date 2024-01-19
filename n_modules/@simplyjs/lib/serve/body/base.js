//the base middleware
//decode body into buffer

import { checkpInt } from '../check.js';
import { request_close, request_error } from '../base/symbols/errors.js';
import { above_limit } from './errors.js';
import { Bad_Request, Payload_Too_Large } from '../base/symbols/httpStatus.js';

export var baseBody = (opts = {}) => {
	opts = {
		limit: 1028 * 1028 * 1028,
		compression: true,
		...opts
	}
	
	checkpInt(opts.limit, 'limit', false);
	
	return (req, res, ctx) => baseBodyHandler(opts, req, res, ctx);
}

export var baseBodyHandler = (opts, req, res, ctx) => new Promise(resolve => {
	var { compression, limit } = opts;
	var router = ctx.router;
	var received = 0;
	
	//check method
	var method = req.method.toLowerCase();
	if (method === 'get' || method === 'head') return resolve();
	
	//check limit < length
	var expected = Number.parseInt(req.headers['content-length'], 10);
	if (expected > limit) resolve(router.error(above_limit, Payload_Too_Large, req, res, limit, expected));
	
	//create buffer
	var buffer = [];
	
	//attach listners
	req.on('data', onData);
	req.on('end', onEnd);
	req.on('error', onError);
	req.on('close', onClose);
	
	var onData = (chunk) => {
		received += chunk.length;
		buffer.push(chunk);
		
		//check limit
		if (received > limit) resolve(router.error(above_limit, Payload_Too_Large, req, res, limit, received));
	}
	
	var onEnd = (error) => {
		cleanUp();
		
		buffer = Buffer.concat(buffer);
		
		
	}
	
	var onError = () => {
		cleanUp();
		resolve(router.error(request_error, Bad_Request, req, res, error))
	}
	
	var onClose = () => {
		cleanUp();
		resolve(router.error(request_close, Bad_Request, req, res))
	}
	
	var cleanUp = () => {
		req.off('data', onData);
		req.off('end', onEnd);
		req.off('error', onError);
		req.off('close', onClose);
	}
})