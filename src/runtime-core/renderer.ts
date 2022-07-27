import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode"


// 在mount()方法定义的runner()函数，接收创建的虚拟节点vnode和根容器，交给patch()函数进行渲染
export function runner(vnode, container) {
  // runner(虚拟节点, 根容器)

  //runner 的作用 -> 主要调用 patch() 方法

  patch(vnode, container, null)
  // 使用 patch() 函数 为了方便递归
}


// 目的为了根据判断 虚拟节点，都组件或者是 Element 进行一个渲染
// patch(虚拟节点, 容器)
function patch(vnode, container, parentComponent) {
  // 实现 shapeFlag - vue 
  // shapeFlag 的作用是， 描述当前节点的类型，是一个 Element 还是一个组件 | children 是一个字符串 还是一个数组


  // 1. 判断 vnode 的类型 -> 可能是 组件类型 或者 Element 类型

  // console.log(vnode.type)  可以看到  vnode.type 要么是 组件类型 -> Object , 要么是 Element 类型 ->  string

  const { type } = vnode  // type 组件的类型 
  switch (type) {

    // 如果是 Fragment 包裹的标签
    case Fragment:
      // 就调用 processFragment 函数
      processFragment(vnode, container, parentComponent)
      break

    // 如果是 Text 的逻辑
    case Text:
      // 如果是 Text 节点
      processText(vnode, container)
      break

    // 如果不是，则走 默认的逻辑
    default:
      // 使用 ShapeFlags -> 进行判断 类型
      const { shapeFlag } = vnode
      // 这里判断 vnode.type 类型 -> ELEMENT
      if (shapeFlag & ShapeFlags.ELEMENT) {
        // if (typeof vnode.type === "string") {
        // 如果 vnode.type 是 string 类型, 表示它是 Element 
        processElement(vnode, container, parentComponent)

        // 这里判断是否组件类型  -> STATEFUL_COMPONENT
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        // } else if (isObject(vnode.type)) {  、// 之前的判断
        // 如果 vnode.type 是 object 类型 , 表示它是 组件类型
        processComponent(vnode, container, parentComponent)
      }
      break
  }

  // // 使用 ShapeFlags -> 进行判断 类型
  // const { shapeFlag } = vnode
  // // 这里判断 vnode.type 类型 -> ELEMENT
  // if (shapeFlag & ShapeFlags.ELEMENT) {
  //   // if (typeof vnode.type === "string") {
  //   // 如果 vnode.type 是 string 类型, 表示它是 Element 
  //   processElement(vnode, container)

  //   // 这里判断是否组件类型  -> STATEFUL_COMPONENT
  // } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
  //   // } else if (isObject(vnode.type)) {  、// 之前的判断
  //   // 如果 vnode.type 是 object 类型 , 表示它是 组件类型
  //   processComponent(vnode, container)
  // }

  // 如果是 组件类型
  // 去处理组件 
  // 实现初始化组件的逻辑 

  // 实现组件初始化的总体函数 processComponent 的函数
  // processComponent(vnode, container)

  // 如果是 Element 类型
  // 处理Element ，将其旋渲染出来
  // TODO: 判断vnode 是不是一个 element -> 那么就应该处理 element
  // 思考题： 如何判断vnode 是一个 element
  // processElement(vnode, container)

}

// 初始化 TextNode 的逻辑
function processText(vnode: any, container: any) {
  // 渲染 Text 的虚拟节点的 Vnode 的逻辑 


  // 1. 拿到用户传入的 text
  const { children } = vnode;

  // 2. 创建一个 TextNode
  // 记得使用 vnode.el 赋值
  const textNode = (vnode.el = document.createTextNode(children))

  // 3. 添加到 container 内容
  container.appendChild(textNode)
}


// 初始化 Fragment 的逻辑
function processFragment(vnode: any, container: any, parentComponent) {
  // 调用 mountChildren
  mountChildren(vnode, container, parentComponent)
}



// 当 vnode 是一个 Element 类型执行这个函数
function processElement(vnode: any, container: any, parentComponent) {
  // 进行一个 Element 的渲染 

  // 1. Element 分为两种情况 -> init 初始化 ->  update 更新


  // 实现初始化Element的逻辑
  mountElement(vnode, container, parentComponent)

}

// 初始化 Element
function mountElement(vnode: any, container: any, parentComponent) {

  // 1. 创建一个真实的 Element -> vnode.type
  const el = (vnode.el = document.createElement(vnode.type))  // 使用 el 保存根节点 -> 给el赋值

  // 2. props , 解析属性 -> vnode
  const { props } = vnode
  if (props) { // 当props 不为空时
    for (const key in props) {
      const val = props[key]

      // console.log(key)

      // 进行重构
      // 处理注册事件功能
      // 具体的 针对于 click -> 通用  （小步骤的开发思想）
      // 实现通用的，可以根据 组件的命名规范，来实现， 
      // 因为 on + 事件名称 ：  click -> onClick , onMouseDown -> MouseDown
      // 可以使用正则方式，匹配 on 之后的事件名，来注册不同事件

      // 封装 通过注册方法 isOn
      const isOn = (key: string) => /^on[A-Z]/.test(key)
      if (isOn(key)) {
        // if (key === 'onClick') {
        // 添加 注册点击事件 
        // val 就是 onClick 的会调函数
        // el.addEventListener('click', val)

        // 获取事件名称
        const event = key.slice(2).toLowerCase()
        el.addEventListener(event, val)
      } else {
        // 如果不是 on 之后的事件名称
        // 设置 el 的属性值
        el.setAttribute(key, val)
      }
    }
  }

  // 3. children,  解析然后赋值 
  // children 有两种情况， 是一个数组， 或者是一个字符串
  const { children, shapeFlag } = vnode

  // 这里也是用 shapeFlag 判断 children 的类型 -> 可能是数组，可能是字符串
  // 如果是一个字符串 -> TEXT_CHILDREN
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // if (typeof children === 'string') {
    // 直接设置 el 的文本内容
    el.textContent = children

    // 如果是一个数组 -> ARRAY_CHILDREN
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // } else if (Array.isArray(children)) {
    // 表示 [h(), h()]
    // 使用 mountChildren 重构 children - Array 的渲染
    mountChildren(vnode, el, parentComponent)
  }

  // 4. 挂载 el 到 容器 container 上
  container.appendChild(el)
}


// 封装 渲染 children 的函数
function mountChildren(vnode, container, parentComponent) {
  // 循环 children 内的虚拟节点, 然后调用 patch()进行递归->再去渲染
  vnode.children.forEach((v) => {
    // 这里 container 容器设置为 el 
    patch(v, container, parentComponent)
  })
}

// 实现组件初始化的总体函数
function processComponent(vnode: any, container: any, parentComponent) {
  // 1. 挂载组件
  // 使用 mountComponent 函数 挂载组件
  mountComponent(vnode, container, parentComponent)
}


// 挂载组件mountComponent, 初始化组件实例
function mountComponent(initialVNode: any, container, parentComponent) {
  // 1. 通过 vnode 创建一个组件的实例对象 ->  instance 
  const instance = createComponentInstance(initialVNode, parentComponent)

  // 2. setupComponent() 初始化
  // 2.1 解析处理组件的其他内置属性 比如： props , slots 这些 
  // 2.2 组件中setup() 的返回值 和 挂载 render() 返回
  setupComponent(instance)

  // 3. 开始调用 组件的 runner 函数
  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect(instance: any, initialVNode, container: any) {

  // 当调用 render时候，应该拿到 组件的代理对象
  const { proxy } = instance
  // 拿到 proxy 后, 在调用 render时候，进行绑定

  // 调用 render() 函数
  // subTree 是 h() 函数返回的 vnode, 也是虚拟节点树 subTree 
  const subTree = instance.render.call(proxy)  // 绑定 proxy

  // 再基于返回过来的虚拟节点 vnode, 再进一步的调用 patch() 函数
  // vnode -> subTree 是一个 Element类型 ->  挂载 mountElement

  // 递归调用 -> patch(虚拟节点，容器)

  // 这里赋值 instance, 也就是父级组件
  patch(subTree, container, instance)
  // patch()再去判断，-> subTree 的类型 -> 可能是 组件类型 或者 Element类型 -> 一直递归进行下去


  // 实现 $el 的关键时机， 在这个时候赋值 el
  // 当patch() 再次调用，可能是 进行Element流程
  // 将 subTree.el 赋值给 vnode.el
  initialVNode.el = subTree.el
}

