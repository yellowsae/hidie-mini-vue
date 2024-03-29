

// 导出创建虚拟节点的方法

import { ShapeFlags } from "../shared/ShapeFlags"

// 这里定义 Fragment , 是一个 Symbol 值
export const Fragment = Symbol('Fragment')

// 定义 Text 节点类型
export const Text = Symbol('Text')


// 解决 createElementBlock 报错
// createElementBlock 方法 和 createVNode 一样 
export { createVNode as createElementBlock }


export function createVNode(type, props?, children?) {
  // 参数：
  // type -> 组件类型
  // props -> 可选 -> 属性
  // children -> 可选 -> 子节点


  const vnode = {
    type, // 组件类型
    props,
    children,
    // 初始化 el
    el: null,
    // 1. 初始化 ShapeFlags
    shapeFlag: getShapeFlag(type),

    // 添加 key 属性
    key: props && props.key
  }

  // debugger

  // 2. 处理 children
  if (typeof children === 'string') {
    // 如果 children 是 string , 给 vnode.ShapeFlag  进行赋值 
    // vnode.ShapeFlag | ShapeFlags.text_children 进行一个 或 | 运算 
    // vnode.ShapeFlag = vnode.ShapeFlag | ShapeFlags.text_children

    // 简化
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    // 如果 children 是数组，赋值 ShapeFlag 为 数组 
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }


  // 添加处理当children是一个 object 时 -> 也就是具有 slots 
  // 判定条件  : 是一个组件 + 具有children 是一个 object
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {  // 如果当前节点是一个组件 
    if (typeof children === "object") {  // 并且 children 是一个 object -> slots

      // 也就说明当前节点是一个 具有 slot 的逻辑 
      // 给当前节点 赋值为具有 slot 的状态 
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
    }
  }



  // 返回创建组件的虚拟节点
  return vnode
}


// 创建 createTextNode 
// 实现 渲染 文本的逻辑
export function createTextNode(text: string) {
  // 创建按 Text 类型的 虚拟节点 -> VNode
  // 在到 patch() 中处理 Text 的 渲染
  return createVNode(Text, {}, text)
}



// 这里判断类型
function getShapeFlag(type) {
  // 返回设置类型
  return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}
