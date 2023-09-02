import { CompError } from './base/error.js';

export var checkfn = (fn, name, system = 'comp') => {
	if (typeof fn !== 'function') throw new CompError(`${system}: ${name} of type (${fn?.constructor?.name}), expected (Function)`);
};

export var checkstr = (str, name, system = 'comp') => {
	if (typeof str !== 'string') throw new CompError(`${system}: ${name} of type (${str?.constructor?.name}), expected (String)`);
};

export var checkarr = (arr, name, system = 'comp') => {
	if (!Array.isArray(arr)) throw new CompError(`${system}: ${name} of type (${arr?.constructor?.name}), expected (Array)`);
};

export var checkpInt = (nb, name, system, min = 0) => {
	if (typeof nb !== 'number') throw new CompError(`${system}: ${name} of type (${nb?.constructor?.name}), expected (Number)`);
	if (!Number.isInteger(nb) || nb < min) throw new CompError(`${system}: ${name} is (${nb}), expected positive integer`);
};

export var checkel = (el, system = 'comp', name = 'el') => {
	if (el?.nodeType !== 1) throw new CompError(`${system}: ${name} of type (${el?.constructor?.type}), expected (Element)`);
};

export var checkcomp = (comp, system = 'comp', name = 'component') => {
	if (!comp?.isComp) throw new CompError(`${system}: ${name} of type (${comp?.constructor?.name}), expected (@component)`);
};

export var checkCompClass = (clas, name = 'component', system = 'comp') => {
	if (!clas?.isCompClass) throw new CompError(`${system}: ${name} of type (${clas?.name || clas?.constructor?.name}), expected (@component)`);
};

export var checkDataProv = (provider, system) => {
	if (!provider?.isDataProvider) throw new CompError(`${system}: provider of type (${provider?.constructor?.name}), expected (@DataProvider)`);
};

export { CompError };
