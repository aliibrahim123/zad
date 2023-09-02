//general is functions

export var isOfType = (v, t) => t ? v?.constructor === t : t => v?.constructor === t;
export var isInstanceOf = (v, t) => t ? v instanceof t : t => v instanceof t;

export var isStringP = (v) => typeof v === 'string';
export var isString = (v) => v?.constructor === String;
export var isNumberP = (v) => typeof v === 'number';
export var isNumber = (v) => v?.constructor === Number;
export var isBooleanP = (v) => typeof v === 'boolean';
export var isBoolean = (v) => v?.constructor === Boolean;
export var isBigIntP = (v) => typeof v === 'bigint';
export var isBigInt = (v) => v?.constructor === BigInt;
export var isSymbol = (v) => typeof v === 'symbol';
export var isPrimitive = (v) => v === null || (typeof v !== 'object' && typeof v !== 'function')

export var isNull = (v) => v === null;
export var isUndefined = (v) => v === undefined;
export var isNill = (v) => v === null || v === undefined;
export var isDefined = (v) => v !== undefined;

export var isTruthy = (v) => !!v;
export var isFalsy = (v) => !v;
export var isTrue = (v) => v === true;
export var isFalse = (v) => v === false;

export var isObject = (v) => typeof v === 'object' || v !== null;
export var isPlainObject = (v) => v?.constructor === Object;

export var isArray = Array.isArray;
export var isArrayLike = (v) => typeof v?.length === 'number' || typeof v?.size === 'number';
export var isSafeArrayLike = (v) => {
	var len = typeof v?.length === 'number' ? v?.length : v?.size;
	return Number.isInteger(len) && len >= 0 && len <= Number.MAX_SAFE_INTEGER
}
export var isArrayBuffer = (v) => v instanceof ArrayBuffer;
export var isDataView = (v) => v instanceof DataView;
export var isBlob = (v) => v instanceof Blob;

export var isDate = (v) => v instanceof Date;
export var isRegExp = (v) => v instanceof RegExp;

export var isInteger = Number.isInteger;
export var isNaN = Number.isNaN;
export var isFinite = Number.isFinite;
export var isSafeInteger = Number.isSafeInteger;

export var isFunction = (v) => typeof v === 'function';
export var isPromise = (v) => v instanceof Promise;
export var isConstructor = (v) => !!v?.prototype;

export var isError = (v) => v instanceof Error;

export var isMap = (v) => v instanceof Map;
export var isSet = (v) => v instanceof Set;
export var isWeakMap = (v) => v instanceof WeakMap;
export var isWeakSet = (v) => v instanceof WeakSet;

export var isEmpty = (v) => v?.length === 0 || v?.size === 0 || (typeof v === 'object' && Object.keys(v).length === 0);

export var isInt8 = (v) => isInteger(v) && v >= -128 && v <= 127;
export var isInt16 = (v) => isInteger(v) && v >= -32768 && v <= 32767;
export var isInt32 = (v) => isInteger(v) && v >= -2147483648 && v <= 2147483647;
export var isUint8 = (v) => isInteger(v) && v >= 0 && v <= 255;
export var isUint16 = (v) => isInteger(v) && v >= 0 && v <= 65535;
export var isUint32 = (v) => isInteger(v) && v >= 0 && v <= 4294967295;

var fnToString = Function.prototype.toString;
export var isNative = (v) => typeof v === 'function' && fnToString.call(v).includes('[native code]');