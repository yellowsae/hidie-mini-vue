// 引入 h 函数
import { h } from "../../lib/guide-mini-vue.esm.js"
import { Foo } from "./Foo.js"
window.self = null
export const App = {
  name: 'App',  // 组件name  -> 根组件


  // 实现 emit 功能
  render() {
    return h('div', {}, [
      h('div', {}, "App"),
      h(Foo, {
        // 接收 emit 事件
        // 这里接收的 onAdd 和 在 Foo 组件调用的 emit('add') 名字不同
        // 在这里注册事件都是 on + 时间名 ->  on + Add
        onAdd(a, b) {

          // 获取到参数 a ,b -> emit()传入参数
          console.log('onAdd -> emit触发 add 事件 回调函数', a, b)
        },

        onAddFoo(a, b) {
          console.log('onAddFoo -> ', a, b)
        }
      })
    ])
  },

  setup() {
    return {
    }
  }
}
