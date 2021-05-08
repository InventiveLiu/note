define(function(require, exports, module) {
  console.log('cycleA required');
  return {
    name: 'cycleA',
    hi: function() {
      const cycleB = require('cycleB');
      console.log('Hi! ' + cycleB.name);
    },
  };
});
