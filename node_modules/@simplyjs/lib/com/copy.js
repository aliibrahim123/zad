//deep copy

import { handlecopy, copiers, copyPropsNormal, copyPropsStrict, handleDom } from './copyhandle.js'; 

var $copy = (obj, opts = {}) => {
	opts = {
		...$copy.defaults,
		...opts
	};
	return handlecopy(obj, opts, new Map())
};

$copy.defaults = {
	strict: false,//copy property discriptors
	refs: 'circular',//references: circular/all/false
	function: false,
	toPrimitive: true, //convert primitive wrappers to primitive
	copiers,
	skip: ['caller', 'callee'], //properties to skip
	donotCopy: ['prototype', 'arguments'], //properties to not copy
	domNode: false, //copy dom node
	domNodeProps: false, //copy assigned properties on dom node
};

$copy.dom = (obj, opts) => {
	opts = {
		...$copy.defaults,
		domNode: true,
		...opts
	};
	return handleDom(obj, opts, new Map())
} 

export default $copy;
export { copyPropsNormal, copyPropsStrict, handleDom}