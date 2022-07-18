import { createComponentInstance, setupComponent } from "./component"

export function runner(vnode, container) {
  // runner(虚拟节点, 根容器)


  //runner 的作用 -> 主要调用 patch() 方法

  patch(vnode, container)
  // 使用 patch() 函数 为了方便递归
}


// patch(虚拟节点, 根容器)
function patch(vnode, container) {

  // 这里主要处理组件 

  // 1. 判断 vnode 的类型 -> 可能是 组件类型 或者 Element 类型


  // 如果是 组件类型
  // 去处理组件 
  // 实现初始化组件的逻辑 

  // 挂载组件 processComponent 的函数
  processComponent(vnode, container)

  // 如果是 Element 类型
  // 处理Element ，将其旋渲染出来
}

function processComponent(vnode: any, container: any) {
  // 1. 挂载组件
  // 使用 mountComponent 函数 挂载组件
  mountComponent(vnode, container)
}


function mountComponent(vnode: any, container) {
  // 1. 通过 vnode 创建一个组件的实例对象 ->  instance 
  const instance = createComponentInstance(vnode)

  // 2. setupComponent() 初始化
  // 2.1 解析处理组件的其他内置属性 比如： props , slots 这些 
  // 2.2 组件中setup() 的返回值 和 挂载 runder() 返回
  setupComponent(instance)

  // 3. 开始调用 组件的 runner 函数
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance: any, container: any) {
  // 调用 runder() 函数
  // subTree 是 h() 函数返回的 vnode, 也是虚拟节点树 subTree 
  const subTree = instance.render()

  // 再基于返回过来的虚拟节点 vnode, 再进一步的调用 patch() 函数
  // vnode -> subTree 是一个 Element类型 ->  挂载 mountElement

  // 递归调用 -> patch(虚拟节点，容器)
  patch(subTree, container)
  // patch()再去判断，-> subTree 的类型 -> 可能是 组件类型 或者 Element类型 -> 一直递归进行下去
}

