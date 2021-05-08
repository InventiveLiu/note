const btn = document.getElementById('btn');

btn.addEventListener('click', () => {
  import('./dynamic').then(e => {
    console.log(e);
    e.default();
  });
});
