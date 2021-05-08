const a = require('./a');

console.log(a.name);
console.log(a.obj.name);

a.setName('A');

console.log(a.name);

console.log(a.obj.name);
console.log(a.getName());

const a2 = require('./a');

console.log(a.name);
console.log(a2.getName());

console.log(a2 === a);

console.log(require.cache[require.resolve('./a')]);
