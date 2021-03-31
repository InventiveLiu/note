import { defineConfig } from 'dumi';

export default defineConfig({
  title: '学习小册',
  mode: 'doc',
  base: '/note',
  publicPath: '/note/',
  exportStatic: {},
  copy: [
    {
      from: 'examples',
      to: 'examples',
    },
  ],
  // more config: https://d.umijs.org/config
});
