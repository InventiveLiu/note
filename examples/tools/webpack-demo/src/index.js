// import { join } from 'lodash-es';
// import { add } from './treeshakingtest';

function addOne(a) {
  return a + 1;
}

function component() {
  //  const element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  // Lodash, now imported by this script
  // addOne(10);

  return addOne(10);
}

document.body.appendChild(component());
