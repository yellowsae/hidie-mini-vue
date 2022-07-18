import { createVNode } from './vnode'
// h 函数 -> 创建节点 ， 虚拟DOM  vnode
export function h(type, props, children) {
  // 这里使用 createVNode 创建
  return createVNode(type, props, children)
}
