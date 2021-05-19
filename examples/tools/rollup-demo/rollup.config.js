import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';

export default {
  input: {
    'ui-lib': 'src/index.ts',
  },
  output: [
    {
      format: 'cjs',
      file: 'dist/ui-lib.cjs.js',
    },
    {
      format: 'es',
      file: 'dist/ui-lib.es.js',
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      babelHelpers: 'runtime',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    postcss(),
  ],
};
