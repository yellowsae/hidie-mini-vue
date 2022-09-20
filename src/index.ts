// 整个mini-vue 的出口


// 因为 runtime-dom 是 runtime-core 的上一层 
// 所以导出的先后顺序 是 runtime-dom -> runtime-core


// 把 runtime-core 放到 runtime-dom 中
// export * from './runtime-core'

// 导出 runtime-dom
export * from "./runtime-dom"
export * from "./reactivity"


import { registerRuntimeCompiler } from "./runtime-dom"


// 在这里运行 compiler 模块 -> 最后导出 render 函数
import { baseCompiler } from "./compiler-core/src"

// 导入 runtime-dom
import * as runtimeDom from "./runtime-dom"

// baseCompiler() 会返回 { code }
// 而最终需要的是 编译为 render() 函数 

// 实现 1. 基于 compilerToFunction 接收  template 用户传入的 template
function compilerToFunction(template) {


  // 这里调用 baseCompiler
  // 传入 template
  const { code } = baseCompiler(template)

  // 解决 导出render 函数 
  // 创建一个新函数, 把 code 和 vue 参数传入， 然后调用它， 就会 code 就会执行并且会返回 我们需要的 render 函数
  // 并且调用 这个 new Function()  -> 
  // 传入 Vue -> runtime-dom
  const render = new Function('Vue', code)(runtimeDom)

  // 返回 render 函数
  return render

  /** 
   * 此时 code 的内容为 , 而不是 render 函数 
   * import { toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, "Hello World, " + _toDisplayString(_ctx.message), 1 /* TEXT
  */


  // 解决需要返回的 render 函数
  // 策略： 用一个函数包裹起来, 提供这些 变量
  // - 依赖问题： vue的引入  | toDisplayString  


  // // 例如
  // function renderFunction(Vue) {
  //   const { toDisplayString: _toDisplayString, openBlock: _openBlock, createElementBlock: _createElementBlock } = Vue

  //   return function render(_ctx, _cache, $props, $setup, $data, $options) {
  //     return (_openBlock(), _createElementBlock("div", null, "Hello World, " + _toDisplayString(_ctx.message), 1 /* TEXT */))
  //   }
  // }


  // // 然后调用 
  // // Vue 本质就是 rumtime-dom

  // // 会返回 render 函数 
  // // 而这个 render 函数就是我们需要的 -> 需要给到组件上使用的
  // const render = renderFunction(Vue)
}



/**
 * 如何在 runtime-core 中的 component 中用到 render 函数呢 
 * 
 * 策略： 也就是前端传入参 中 常见 和 常用的策略 
 * 
 * 1. 在 component 中 设置一个函数 -> 然后导出 
 * 2. 在这里 index.ts 中调用 component 这个函数 -> 把 compilerToFunction 编译模块函数传入
 * 3. 因为编译函数 会返回 最终的 render 函数 , 此时 在 component 使用变量接收 这个返回值就行了 
 */


// 使用  registerRuntimeCompiler 
// 传入编译模块的函数 compilerToFunction
// 程序一上来直接运行 dom 模块 把 compiler 保存到 component
registerRuntimeCompiler(compilerToFunction)
