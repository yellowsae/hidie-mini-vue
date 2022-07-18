import { runner } from "./renderer"
import { createVNode } from "./vnode"

// createApp 逻辑 
export function createApp(rootComponent) {  // 接收一个根组件容器 -> App

  // 返回一个对象
  return {

    // 对象内部必须有一个 rootContainer , 根容器 -> id=app 的容器
    // 目的是为了将 runner 函数渲染后给他 添加到 <div id='app'></div> 里面
    mount(rootContainer) {

      // 1. 先将 rootComponent 根容器(App) 转为一个 虚拟节点 vnode
      // 将 组件转为虚拟节点
      // 2. 将所有的逻辑操作 都会基于 vnode 做处理

      const vnode = createVNode(rootComponent)
      // vnode -> 返回出来的虚拟节点 vnode
      // createVNode（组件） ->  基于组件创建虚拟节点


      // 得到虚拟节点后 -> 可以调用 runner() 函数
      runner(vnode, rootContainer)
      // runner(虚拟节点, 根容器)
    }
  }
}
