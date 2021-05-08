define(function(require, exports, module) {
  console.log('cycleB required');
  return {
    name: 'cycleB',
    hi: function() {
      const cycleA = require('cycleA');
      console.log('Hi! ' + cycleA.name);
    },
  };
});
