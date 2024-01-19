import { make, Router, Route, ServerError, httpStatus, errorCodes } from './base.js';

if (globalThis.$serve) {
	$serve.make = make;
	$serve.Router = Router;
	$serve.Route = Route;
	$serve.ServerError = ServerError;
	$serve.httpStatus = httpStatus;
	$serve.errorCodes = errorCodes;
} else globalThis.$serve = {
	make, Router, Route, ServerError, httpStatus, errorCodes
};

export * from './base.js';
export default $serve;