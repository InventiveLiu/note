import { add } from '@test/test-exclude';

let a = '';

function component() {
  // Lodash, currently included via a script, is required for this line to work
  // Lodash, now imported by this script
  a = add(10, 11);

  return 'test';
}

document.body.appendChild(component());
