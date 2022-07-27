import { h, createTextNode } from "../../lib/guide-mini-vue.esm.js"
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
        // header: ({ age }) => h('p', {}, "这个作用域插槽的内容 hander + " + age),


        // 添加， Text Node 节点
        // 包裹 [h(),  "text"]
        // 直接封装是 对TextNode 进行 包裹
        // createTextNode("text")
        header: ({ age }) => [h('p', {}, "这个作用域插槽的内容 hander + " + age), createTextNode('这里实现 TextNode 类型节点')],
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


/**
 * 实现TextNode 逻辑
 * 因为在实际的 Vue3 中，这些text 都是直接写的； 这里使用了 render() 逻辑； 写text节点，使用到 createTextNode()方法，
 * 把 text 节点创建 VNode , 然后渲染到页面
 * 
 * 实现
 * 1. 在 VNode 中创建 createTextNode() 函数 ; 返回返回一个 createVNode(Text, {}, text);
 *    创建Text类型的 虚拟节点， 并且把 text 内容传入children 属性;  Text需要初始化定义 与 Fragment 实现相同，不需要实际的 标签包裹
 * 
 * 2. 在 patch()函数中，判断是否Text 类型的节点, 如果是 进行 Text 的渲染
 *  - 节点的创建 -> 添加节点到页面
 */
