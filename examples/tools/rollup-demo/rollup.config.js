import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: 'src/index.ts',
  output: [
    {
      format: 'cjs',
      file: pkg.main,
    },
    {
      format: 'es',
      file: pkg.module,
      exports: 'auto',
    },
  ],
  external: ['react', 'react-dom', '@babel/runtime'],
  plugins: [
    nodeResolve({
      extensions,
    }),
    commonjs(),
    babel({
      babelHelpers: 'runtime',
      extensions,
      exclude: ['node_modules/**'],
    }),
    postcss({
      extensions: ['.css', '.scss'],
    }),
  ],
};
