//encode/decode toml files

import { decode } from './toml/decode.js';
import { encode } from './toml/encode.js';
import { TOMLError } from './toml/error.js';

export {
	decode, encode, TOMLError
}

export default {
	decode, encode, TOMLError
}