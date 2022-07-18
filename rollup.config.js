import pkg from './package.json'
import typescript from "@rollup/plugin-typescript"
export default {
  input: 'src/index.ts',
  output: [
    // 1.  commonjs  -> cjs
    // 2.  esm
    {
      format: 'cjs',
      // file: 'lib/guide-mini-vue.cjs.js',
      file: pkg.main,  // 在package.json 定义了 main 和 module 的模式, 可以直接使用, 一个小优化
    },
    {
      format: 'es',
      // file: 'lib/guide-mini-vue.esm.js',
      file: pkg.module,
    }
  ],


  plugins: [
    typescript()
  ]
}
