console.log(require.cache);
const cycleA = require('./cycleA.js');

console.log('value of cycleA:', cycleA);

module.exports = 'This is cycleB.js';
