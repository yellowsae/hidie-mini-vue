

// 导出创建虚拟节点的方法

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
    el: null
  }

  // 返回创建组件的虚拟节点
  return vnode
}
