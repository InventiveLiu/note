// import { add } from '@test/test-exclude';
const pkg = require('../package.json');

let a = '';

function component() {
  // Lodash, currently included via a script, is required for this line to work
  // Lodash, now imported by this script
  // a = add(10, 11);
  const version = pkg.version;
  console.log(pkg);
  return version;
}

component();

// document.body.appendChild(component());
