define(function(require, exports, module) {
  console.log('main required');

  const btn = document.getElementById('alert');

  btn.onclick = () => {
    require.async('alert', function(myAlert) {
      myAlert('i am myAlert');
    });
    alert('i am before myAlert');
  };

  const btnCycleA = document.getElementById('cycleA');

  btnCycleA.onclick = () => {
    const cycleA = require('cycleA');
    cycleA.hi();
  };

  const btnCycleB = document.getElementById('cycleB');

  btnCycleB.onclick = () => {
    const cycleB = require('cycleB');
    cycleB.hi();
  };

  const btnCycleBoth = document.getElementById('cycleBoth');

  btnCycleBoth.onclick = () => {
    const cycleA = require('cycleA');
    const cycleB = require('cycleB');
    cycleA.hi();
    cycleB.hi();
  };

  const mod1 = require('mod1');
  mod1.hi();
  const mod2 = require('mod2');
  mod2.hi();
});
