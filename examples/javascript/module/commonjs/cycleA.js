console.log(require.cache);
const cycleB = require('./cycleB.js');

console.log('value of cycleB:', cycleB);

module.exports = 'This is cycleA.js';
