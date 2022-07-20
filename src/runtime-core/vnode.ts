

// 导出创建虚拟节点的方法

import { ShapeFlags } from "../shared/ShapeFlags"

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
    shapeFlag: getShapeFlag(type)
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

  // 返回创建组件的虚拟节点
  return vnode
}


// 这里判断类型
function getShapeFlag(type) {
  // 返回设置类型
  return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}
