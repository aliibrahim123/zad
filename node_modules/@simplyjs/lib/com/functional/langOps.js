//lang operators as functions

export var TypeOf = (x) => typeof x;
export var Instanceof = (x, y) => x instanceof y;
export var In = (x, y) => x in y;
export var New = (x, ...args) => new x(...args);

export var eq = (x, y) => x === y;
export var eqs = (x, y) => x == y;
export var neq = (x, y) => x !== y;
export var neqs = (x, y) => x != y;

export var gt = (x, y) => x > y;
export var lt = (x, y) => x < y;
export var gte = (x, y) => x >= y;
export var lte = (x, y) => x <= y;

export var add = (x, y) => x + y;
export var sub = (x, y) => x - y;
export var mult = (x, y) => x * y;
export var div = (x, y) => x / y;
export var exp = (x, y) => x ** y;
export var mod = (x, y) => x % y;

export var inc = (x) => x + 1;
export var dec = (x) => x - 1;
export var neg = (x) => -x;

export var lshift = (x, y) => x << y;
export var rshift = (x, y) => x >> y;
export var urshift = (x, y) => x >>> y;

export var not = (x) => ~x;
export var and = (x, y) => x & y;
export var or = (x, y) => x | y;
export var xor = (x, y) => x ^ y;

export var lnot = (x) => !x;
export var land = (x, y) => x && y;
export var lor = (x, y) => x || y;
export var nullCoal = (x, y) => x ?? y;