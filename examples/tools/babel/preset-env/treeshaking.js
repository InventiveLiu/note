import { add } from './treeshakingtest.js';

var count = 1;

document.title = count;

document.getElementById('root').addEventListener('click', () => {
  count = add(count, 1);
  document.title = count;
});
