//type validator

import { is, validate } from './type/base.js';
import { throwers } from './type/throwers.js';
import { any } from './type/any.js';
import { never } from './type/never.js';
import { typeOf, instanceOf } from './type/typeOf.js';
import { string } from './type/string.js';
import { number } from './type/number.js';
import { boolean } from './type/boolean.js';
import { Void } from './type/void.js';
import { Null } from './type/null.js';
import { Function } from './type/function.js';
import { symbol } from './type/symbol.js';
import { bigint } from './type/bigint.js';
import { date } from './type/date.js';
import { regexp } from './type/regexp.js';
import { promise } from './type/promise.js';
import { arrayBuffer } from './type/arrayBuffer.js';
import { typedArray } from './type/typedArray.js';
import { literal, LiteralType } from './type/literal.js';
import { nullable, NullableType } from './type/nullable.js';
import { array, ArrayType } from './type/array.js';
import { tuple, TupleType } from './type/tuple.js';
import { object, ObjectType } from './type/object.js';
import { record, RecordType } from './type/record.js';
import { union, allOf, UnionType } from './type/union.js';
import { intersection, oneOf, IntersectionType } from './type/intersection.js';
import { map, MapType } from './type/map.js';
import { set, SetType } from './type/set.js';
import { decorated, DecoratedType } from './type/decorated.js';
import { gt, lt, gte, lte, between, int, positive, negative } from './type/decorators/number.js';
import { startsWith, endsWith, contains, match } from './type/decorators/string.js';
import { ofLength, ofLengthBelow, ofLengthAbove, empty, nonempty, includes } from './type/decorators/array.js';

export {
	is, validate,
	throwers,
	any, never, typeOf, instanceOf,
	union, allOf, UnionType, intersection, oneOf, IntersectionType,
	string, number, boolean, Void, Null, Function, bigint, symbol,
	date, regexp, arrayBuffer, typedArray, promise,
	literal, LiteralType, nullable, NullableType,
	array, ArrayType, tuple, TupleType,
	object, ObjectType, record, RecordType,
	map, MapType, set, SetType,
	decorated, DecoratedType,
	gt, lt, gte, lte, between, int, positive, negative,
	startsWith, endsWith, contains, match,
	ofLength, ofLengthBelow, ofLengthAbove, empty, nonempty, includes
}

export default {
	is, validate,
	throwers,
	any, never, typeOf, instanceOf,
	union, allOf, UnionType, intersection, oneOf, IntersectionType,
	string, number, boolean, Void, Null, Function, bigint, symbol,
	date, regexp, arrayBuffer, typedArray, promise,
	literal, LiteralType, nullable, NullableType,
	array, ArrayType, tuple, TupleType,
	object, ObjectType, record, RecordType,
	map, MapType, set, SetType,
	decorated, DecoratedType,
	gt, lt, gte, lte, between, int, positive, negative,
	startsWith, endsWith, contains, match,
	ofLength, ofLengthBelow, ofLengthAbove, empty, nonempty, includes
}