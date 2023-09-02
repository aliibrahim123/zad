//regex for encoding and decoding

//match bare keys
//visualize: https://jex.im/regulex/#!flags=&re=%5Ba-zA-Z0-9_-%5D%2B
export var BareKeyReg = /^[a-zA-Z0-9_-]+$/g;

//match integer
//visualize: https://jex.im/regulex/#!flags=&re=%5E(%3F%3A(%3F%3A%5B%2B-%5D%3F(%3F%3A0%7C%5B1-9%5D(%3F%3A_%3F%5B0-9%5D%2B)*))%7C0(%3F%3A%5Bbox%5D%5B0-9a-fA-F%5D(%3F%3A_%3F%5B0-9a-fA-F%5D%2B)*))%24
export var IntReg = /^(?:(?:[+-]?(?:0|[1-9](?:_?[0-9]+)*))|0(?:[box][0-9a-fA-F](?:_?[0-9a-fA-F]+)*))$/g

//match float
//visualize: https://jex.im/regulex/#!flags=&re=%5E%5B%2B-%5D%3F(%3F%3A0%7C%5B1-9%5D(%3F%3A_%3F%5B0-9%5D%2B)*)(%3F%3A%5C.%5B0-9%5D(%3F%3A_%3F%5B0-9%5D%2B)*)%3F(%3F%3A%5BeE%5D%5B-%2B%5D%3F%5B0-9%5D(%3F%3A_%3F%5B0-9%5D%2B)*)%3F%24
export var FloatReg = /^[+-]?(?:0|[1-9](?:_?[0-9]+)*)(?:\.[0-9](?:_?[0-9]+)*)?(?:[eE][-+]?[0-9](?:_?[0-9]+)*)?$/g

//match one-line double quote (")
//visualize: https://jex.im/regulex/#!flags=&re=%22(%3F%3A%5C%5C%5C%5C%7C%5C%5C%22%7C%5B%5E%22%5D)*%22
export var DQuoteX1Reg = /"(?:\\\\|\\"|[^"])*"/g;

//match multi-line double quote (""")
//visualize: https://jex.im/regulex/#!flags=&re=%22%22%22(%3F%3A%5C%5C%5C%5C%7C%5C%5C%22%7C%5B%5E%22%5D%7C%22(%3F!%22%22))*%22%7B3%2C%7D
export var DQuoteX3Reg = /"""(?:\\\\|\\"|[^"]|"(?!""))*"{3,}/g;

//match multi-line double quote (''')
//visualize: https://jex.im/regulex/#!flags=&re='''(%3F%3A%5B%5E'%5D%7C'(%3F!''))*'%7B3%2C%7D
export var SQuoteX3Reg = /'''(?:[^']|'(?!''))*'{3,}/g;

//match the first diget of number like
//visualize: https://jex.im/regulex/#!flags=&re=%5B0-9%2B-%5D
export var NbLikeFirstReg = /[0-9+-]/;

//match number like (int/float/date)
//visualize: https://jex.im/regulex/#!flags=&re=%5B0-9A-Fa-f%3A_.ZTxo%2B-%5D%2B
export var NbLikeReg = /[0-9A-Fa-f:_.ZTxo+-]+/g;