//flixable http router

import { Router } from './base/router.js';
import { Route } from './base/route.js';
import { ServerError } from './base/error.js';
import * as httpStatus from './base/symbols/httpStatus.js';
import * as errorCodes from './base/symbols/errors.js';

var make = (middlewares) => new Router(middlewares);

export default make;
export { make, Router, Route, ServerError, httpStatus, errorCodes }
export * from './base/symbols/httpStatus.js';
export * from './base/symbols/errors.js';