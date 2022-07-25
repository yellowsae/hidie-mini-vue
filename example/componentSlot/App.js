import { h } from "../../lib/guide-mini-vue.esm.js"
import { Foo } from "./Foo.js"
window.self = null
export const App = {
  name: 'App',

  // 根组件
  // 实现 Slot 功能
  render() {

    // 定义组件
    const app = h('div', {}, "这是App 组件")

    // 在父组件的 Foo中， 指定 Slot 的内容
    const foo = h(Foo, {},
      // 在Foo 组件中能够渲染出来这里的内容 
      // 1. 事件slot的基本需求，-> 在Foo中展示 
      // h('p', {}, "这是在父组件中slot, 传入Foo的内容"),


      // 2. 展示多个内容时 -> 在Foo中展示
      // [
      //   h('p', {}, "这是在父组件中slot, 传入Foo的内容"),
      //   h('p', {}, "这是让slots实现 Array功能")
      // ]

      // 3. 实现具名插槽
      // 将 children 转为 Object; 实现具名插槽 key -> value 
      // {
      //   header: h('p', {}, "这个具名插槽的内容 hander"),
      //   footer: h('p', {}, "这个具名插槽的内容 footer")
      // }

      // 4. 实现作用域插槽
      {
        // value 改为 函数
        header: ({ age }) => h('p', {}, "这个作用域插槽的内容 hander + " + age),
        footer: () => h('p', {}, "这个作用域插槽的内容 footer")
      }
    )


    // 实现 slot 的目标就是：将h() 渲染出来的节点，添加到 Foo 组件内部 

    return h('div', {}, [app, foo])
  },

  setup() {
    return {
    }
  }
}
