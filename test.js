
require('./index');

const o = { b: true, s: 'string', i: 10, f: 56.65, a: ['a', 'b', 'c'], o: { o2: 'object 2' } };
o.circ = o;
console.log('JSON error logging enabled', o);

const e = new Error('Some error');
e.code = 500;
e.data = {
  model: { stuff: 'bad news' },
};

console.log('console.log', 'There was a problem.', e);
console.error('console.error', 'There was a problem.', e);
