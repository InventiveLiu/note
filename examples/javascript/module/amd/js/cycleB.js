define(['require', 'cycleA'], function(require, cycleA) {
  console.log('cycleB required');
  return {
    name: 'cycleB',
    hi: function() {
      cycleA = require('cycleA');
      console.log('Hi! ' + cycleA.name);
    },
  };
});
