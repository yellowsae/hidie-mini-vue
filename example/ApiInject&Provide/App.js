import { h, provide, inject } from "../../lib/guide-mini-vue.esm.js"


// Provider 组件
const Provider = {
  name: 'Provider',
  setup() {

    // 使用 provide 方法提供数据
    provide('foo', '这是Provider提供的数据 fooValue')
    provide('bar', '这是Provider提供的数据 barValue')
  },

  render() {
    // children -> [] ;  渲染 Consumer
    return h('div', {}, [h('p', {}, "Provider"), h(Consumer)])
  }
}


/**
 *  介绍 Provider & Inject Api : https://v3.cn.vuejs.org/guide/component-provide-inject.html#%E5%A4%84%E7%90%86%E5%93%8D%E5%BA%94%E6%80%A7
 *  provider 提供数据，inject 注入数据, 用在父组件和更深层级的组件之间的数据传输 
 * 
 * 无论组件层次结构有多深，父组件都可以作为其所有子组件的依赖提供者。
 * 父组件有一个 provide 选项来提供数据，子组件有一个 inject 选项来开始使用这些数据。
 * 
 * Provider & Inject 只能在 setup 中使用
 */


/**
 * 实现 provide & inject 
 * 1. 定义 provide & inject  方法 
 * 2. 导出 provide & inject  方法 
 * 3. 实现的逻辑代码在 apiInject 中
 */


// // 实现一个中间层组件 
// const ProviderTwo = {

// }




// Consumer 组件
const Consumer = {
  name: 'Consumer',
  setup() {
    // 取到 Provider 组件传输的数据

    // 使用 inject 方法取数据 -> 根据 key 来取
    const foo = inject('foo')
    const bar = inject('bar')

    return {
      foo,
      bar
    }
  },

  // 渲染数据
  render() {
    return h('div', {}, `Consumer渲染数据: - foo: ${this.foo} - bar: ${this.bar}`)
  }
}



export default {
  name: 'App',
  setup() { },
  render() {
    // App 组件 -children 使用 Provider 组件
    return h('div', {}, [h("p", {}, "apiInject"), h(Provider)])
  }
}
