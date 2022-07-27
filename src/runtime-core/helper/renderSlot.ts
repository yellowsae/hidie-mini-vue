import { createVNode } from "../vnode";

export function renderSlots(slots, name, props) { //props 接收传入的参数
  // 使用 createVNode() 代替 h(xxx, {} xxx) 
  // createVNode() 接收的参数，前两位 div  {} 
  // 这里只是实现了 Array -> 没有实现 slots 是单个组件的情况
  // return createVNode('div', {}, slots)


  // 这里的逻辑，就是当 this.$slots 是一个数组时
  // 转到 initSlots() 中进行判断
  // 需要对 slots 进行判断
  // return Array.isArray(slots) ? createVNode('div', {}, slots) : slots



  // // 传入参数 name 实现具名插槽
  // const slot = slots[name];  // slots[name]  通过 key 获取值
  // if (slot) {
  //   // 具有 slot, 直接渲染
  //   return createVNode('div', {}, slot)
  // }



  // 传入参数 name 实现具名插槽
  const slot = slots[name];  // slots[name]  通过 key 获取值
  if (slot) {
    // 实现作用域插槽时  slot 为一个函数
    if (typeof slot === 'function') {
      // 执行 slot() 传入 props 参数
      return createVNode('div', {}, slot(props))
    }
  }
}
