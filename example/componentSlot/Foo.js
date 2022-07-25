import { h, renderSlots } from "../../lib/guide-mini-vue.esm.js"
// 实现 Slot 功能
export const Foo = {
  setup() {
  },

  // 实现 Slot 的功能
  // 因为 slot标签内容是在父组件中，在 Foo 组件 通过拿到 App 的 VNode .children 属性，
  // 也就拿到 childlen 中的 VNode。 
  // 在 Foo 组件中 渲染出来就行
  // 关系过程 -> Foo -> App.children  -> render slot



  // 1. 通过使用 this.$slots 渲染 App.children 的内容
  // 实现 ：
  // 1. 初始化 $slots API  -> component 初始化 slots -> componentPublicInstance 实现访问 $slots 返回内容
  // 2. initSlots -> 逻辑：将 vnode.children 赋值给  instance.slots
  // 3. 此时已经可以通过 this.$slots 拿到 App 需要渲染在Foo 中的 节点内容了



  // 在App中，目前只能支持 h(), 让 App 能够实现 [h(), h()] 多个内容


  // 2. 当传入过来的 this.$solts 是一个 Array的 VNode，而不是一个 VNode
  // children -> Array VNode 
  // 处理逻辑：把内部的 this.$slots 转为虚拟节点  Array VNode-> VNode 
  // 解决:  把 $slots 直接再次包裹 h() 
  // 实现：
  // 1. 这里通俗使用h("div", {}, [foo, this.$slots])) -> 进行一个重构， 使用 renderSlots函数，来渲染,
  // 2. 传入 this.$slots, 让它创建对应的虚拟节点
  // 3. 导入 renderSlot() 进行使用
  // 主要就是为了简化 h() 

  render() {
    console.log(this.$slots)

    // 定义 Foo 组件
    const foo = h('p', {}, "这是Foo组件")

    // 在这里渲染 slots 
    // 1. 基本的功能
    // return h('div', {}, [foo, this.$slots])


    // 2. App 中渲染多个内容
    // return h('div', {}, [foo, renderSlots(this.$slots)])


    // 3. 实现具名插槽
    // 1. 获取要渲染的元素
    // 2. 获取到渲染的位置
    // return h('div', {}, [
    //   renderSlots(this.$slots, "header"),
    //   foo,
    //   // slot 的内容
    //   renderSlots(this.$slots, "footer")
    // ]
    // )


    // 4. 实现作用域插槽
    // 定义一个变量，在子组件中传入，让父组件能够访问到
    // 父组件使用作用域插槽需要变为 函数式： header: ({age}) =>  h('p', {}, "这个具名插槽的内容 hander" + age),
    // 实现
    // 1. 使用子组件传入 { age } 参数
    // 2. 在 renderSlots 中，改变 slot,  因为 slot 已经是一个函数了 
    // 3. 在 initSlots 中，修改代码， 此时的 value 已经是一个函数， 需要调用才能获取到返回值， 并且实现函数的传参

    const age = 18
    return h('div', {}, [
      // 传入 age 参数 -> { age }
      renderSlots(this.$slots, "header", { age }),
      foo,
      // slot 的内容
      renderSlots(this.$slots, "footer")
    ]
    )
  }
}
