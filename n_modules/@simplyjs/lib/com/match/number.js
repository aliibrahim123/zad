//number pattern helpers

export var gt = (x) => value => value > x;

export var lt = (x) => value => value < x;

export var gte = (x) => value => value >= x;

export var lte = (x) => value => value <= x;

export var inRange = (a, b) => value => value > a && value < b;