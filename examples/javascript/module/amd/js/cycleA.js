define(['require', 'cycleB'], function(require, cycleB) {
  console.log('cycleA required');
  return {
    name: 'cycleA',
    hi: function() {
      cycleB = require('cycleB');
      console.log('Hi! ' + cycleB.name);
    },
  };
});
