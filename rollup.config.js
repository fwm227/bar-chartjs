import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: './core/index.js',
  output: {
    file: 'lib/index.js',
    format: 'umd',
    name: 'BarChart'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
};
