import { createVNode, Fragment } from "../vnode";

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

      // 这里使用 fragment 标签
      return createVNode(Fragment, {}, slot(props))
    }
  }
}


/**
 * 实现Fragment
 * 因为当前渲染出来的节点 :  `createVNode('div', {}, slot(props))`
 * 都会包裹着一层 div,  复杂了 Element； 使用 Fragment 标签进行优化 
 * 
 * 为了解决多个插槽同时渲染 children 不能包含数组的问题
 * 
 * 实现 Fragment 的逻辑 
 * 使用Fragment 对插槽进行包裹， 在调用 patch() 时，判断是否具有 Fragment， 然后直接调用 mountChildren 传入对应的 VNode 即可
 * 1. 初始化 Fragment -> 在vnode.ts 中初始化 
 * 2. 在 renderSlots ， 创建 Fragment 包裹的标签 -> 因为这里使用就是 不包含 children 属性
 * 3. 在 patch() 中 判断是否具有 fragment, 然后调用 mountChildren() 传入对应的 VNode
 * 
 */
