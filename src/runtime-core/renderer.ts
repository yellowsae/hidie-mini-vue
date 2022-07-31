import { effect } from "../reactivity/effect"
import { EMPTY_OBJ, isObject } from "../shared/index"
import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppApi } from "./createApp"
import { Fragment, Text } from "./vnode"


// 实现createRenderer 函数 
// 包裹 render -> 
export function createRenderer(options) { // 接收 options 参数

  // 这个options 参数就是传入过来的 稳定接口
  // 解构出来渲染函数
  // const { createElement, patchProp, insert } = options

  // 这里设置别名不生效
  const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert } = options
  // const { hostCreateElement: createElement, hostPatchProp: patchProp, hostInsert: insert } = options


  // 在mount()方法定义的render()函数，接收创建的虚拟节点vnode和根容器，交给patch()函数进行渲染
  function render(vnode, container) {  // 取消导出
    // export function render(vnode, container) {
    // render(虚拟节点, 根容器)

    //render 的作用 -> 主要调用 patch() 方法

    // 初始化逻辑 n1 -> null
    patch(null, vnode, container, null)
    // 使用 patch() 函数 为了方便递归
  }


  // 目的为了根据判断 虚拟节点，都组件或者是 Element 进行一个渲染
  // patch(虚拟节点, 容器)

  // patch() 接收新的参数
  // n1 是旧的虚拟节点
  // n2 是新的虚拟节点
  // 如果 n1 不存在 --- 初始化 ,  n1 存在那就是 更新逻辑
  function patch(n1, n2, container, parentComponent) {
    // 实现 shapeFlag - vue 
    // shapeFlag 的作用是， 描述当前节点的类型，是一个 Element 还是一个组件 | children 是一个字符串 还是一个数组


    // 1. 判断 vnode 的类型 -> 可能是 组件类型 或者 Element 类型

    // console.log(vnode.type)  可以看到  vnode.type 要么是 组件类型 -> Object , 要么是 Element 类型 ->  string

    const { type, shapeFlag } = n2  // type 组件的类型 
    switch (type) {

      // 如果是 Fragment 包裹的标签
      case Fragment:
        // 就调用 processFragment 函数
        processFragment(n1, n2, container, parentComponent)
        break

      // 如果是 Text 的逻辑
      case Text:
        // 如果是 Text 节点
        processText(n1, n2, container)
        break

      // 如果不是，则走 默认的逻辑
      default:
        // 使用 ShapeFlags -> 进行判断 类型
        // 这里判断 vnode.type 类型 -> ELEMENT
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // if (typeof vnode.type === "string") {
          // 如果 vnode.type 是 string 类型, 表示它是 Element 
          processElement(n1, n2, container, parentComponent)

          // 这里判断是否组件类型  -> STATEFUL_COMPONENT
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // } else if (isObject(vnode.type)) {  、// 之前的判断
          // 如果 vnode.type 是 object 类型 , 表示它是 组件类型
          processComponent(n1, n2, container, parentComponent)
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
  function processText(n1, n2: any, container: any) {
    // 渲染 Text 的虚拟节点的 Vnode 的逻辑 


    // 1. 拿到用户传入的 text
    const { children } = n2;

    // 2. 创建一个 TextNode
    // 记得使用 vnode.el 赋值
    const textNode = (n2.el = document.createTextNode(children))

    // 3. 添加到 container 内容
    container.appendChild(textNode)
  }


  // 初始化 Fragment 的逻辑
  function processFragment(n1, n2: any, container: any, parentComponent) {
    // 调用 mountChildren
    mountChildren(n2, container, parentComponent)
  }



  // 当 vnode 是一个 Element 类型执行这个函数
  function processElement(n1, n2, container: any, parentComponent) {

    // 判断 n1 
    if (!n1) {
      // n1 不存在 表示初始化
      // 进行一个 Element 的渲染 

      // 1. Element 分为两种情况 -> init 初始化 ->  update 更新


      // 实现初始化Element的逻辑
      mountElement(n2, container, parentComponent)
    } else {
      // n1 有值 表示更新逻辑
      patchElement(n1, n2, container)
    }

  }

  // Element 更新 
  function patchElement(n1, n2, container) {
    // 实现Element更新的逻辑
    console.log("patchElement")
    console.log("n1", n1)
    console.log("n2", n2)


    // 执行Props的更新
    const oldProps = n1.props || EMPTY_OBJ   // 可能 n1.props 没有赋值 赋值为 EMPTY_OBJ 空对象
    const newProps = n2.props || EMPTY_OBJ

    // 取出 el, 并赋值 给n2
    const el = (n2.el = n1.el)
    // 定义patchProps的函数
    patchProps(el, oldProps, newProps)

  }
  // const EMPTY_OBJ = {}
  // 实现 patchProps 更新Props的函数
  function patchProps(el, oldProps, newProps) {
    /**
     * 实现 Props 的更新
     * 
     * props的更新要求 
     * 1. foo 之前的值 与 之后的值不一样了， 修改 props 属性
     * 2. foo 更新后变为了 null | undefined  ；  删除了 foo 属性
     * 3. bar 更新后这个属性在更新后没有了， 删除 bar 属性
     */

    // 优化1. 当 oldProps 与 newProps 不相同时，需要更新
    if (oldProps !== newProps) {

      // 实现1. 循环 newProps  与 oldProps 做对比
      for (const key in newProps) {
        // 取到 oldProps 之前的 props
        const prevProp = oldProps[key];
        // 取到 新的 props 
        const nextProp = newProps[key];

        // 判断 prevProps 与 nextProp 是否一样
        if (prevProp !== nextProp) {
          // 当它们不等时， 说明 props 发生了变化
          // 这里进行触发更新的逻辑

          // 调用 hostPatchProp() 接口 
          // 因为就是在这里实现props的赋值的 

          // 传入  之前的Prop,  更新后的Prop
          hostPatchProp(el, key, prevProp, nextProp)
        }
      }

      // 优化2: 如果 oldProps 为空，不用进行对比
      if (oldProps !== EMPTY_OBJ) {
        // 实现3. bar 更新后这个属性在更新后没有了， 删除 bar 属性
        // 遍历 oldProps 
        for (const key in oldProps) {
          // 如果 key 不在 newProps 中
          if (!(key in newProps)) {
            //  删除这个 key
            // 调用 hostPatchProp() 接口 
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }

  }



  // 初始化 Element
  function mountElement(vnode: any, container: any, parentComponent) {

    // 实现 渲染 Canvas 平台的API 
    /**
     * 为了让渲染器 能够实现多个 平台接口，不仅能够实现 Element 还能够渲染 Canvas , 所以修改代码让它不单单支持Element 
     * 而是通过稳定的接口函数来 渲染 Element & Canvas
     * 
     * 需要3接口：
     * createElement
     * patchProp
     * insert
     * 
     * 
     * 实现方式
     * 1. 定义一个 createRender({}) 函数 -> 渲染器，传入对应的接口过来 
     * 2. 把具体的实现函数传入给createRender()
     */

    // 这里做了 Element 平台的API new Element
    // 1. 创建一个真实的 Element -> vnode.type
    // const el = (vnode.el = document.createElement(vnode.type))  // 使用 el 保存根节点 -> 给el赋值

    // 接口1 createElement
    const el = (vnode.el = hostCreateElement(vnode.type))  // 使用 el 保存根节点 -> 给el赋值

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

        // // 封装 通过注册方法 isOn
        // const isOn = (key: string) => /^on[A-Z]/.test(key)
        // if (isOn(key)) {
        //   // if (key === 'onClick') {
        //   // 添加 注册点击事件 
        //   // val 就是 onClick 的会调函数
        //   // el.addEventListener('click', val)

        //   // 获取事件名称
        //   const event = key.slice(2).toLowerCase()
        //   el.addEventListener(event, val)

        //   // 在Canvas 平台添加属性
        //   // el.x = 10


        // } else {
        //   // 如果不是 on 之后的事件名称
        //   // 设置 el 的属性值
        //   el.setAttribute(key, val)
        // }


        // 接口2 patchProp()
        // 传入需要赋值的参数
        hostPatchProp(el, key, null, val)
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


    // 在 Canvas 平台添加到容器 
    // addChild(xxx)
    // 4. 挂载 el 到 容器 container 上
    // container.appendChild(el)


    // 接口3 insert()
    // 添加到容器
    hostInsert(el, container)
  }


  // 封装 渲染 children 的函数
  function mountChildren(vnode, container, parentComponent) {
    // 循环 children 内的虚拟节点, 然后调用 patch()进行递归->再去渲染
    vnode.children.forEach((v) => {
      // 这里 container 容器设置为 el 
      patch(null, v, container, parentComponent)
    })
  }

  // 实现组件初始化的总体函数
  function processComponent(n1, n2, container: any, parentComponent) {
    // 1. 挂载组件
    // 使用 mountComponent 函数 挂载组件
    mountComponent(n2, container, parentComponent)
  }


  // 挂载组件mountComponent, 初始化组件实例
  function mountComponent(initialVNode: any, container, parentComponent) {
    // 1. 通过 vnode 创建一个组件的实例对象 ->  instance 
    const instance = createComponentInstance(initialVNode, parentComponent)

    // 2. setupComponent() 初始化
    // 2.1 解析处理组件的其他内置属性 比如： props , slots 这些 
    // 2.2 组件中setup() 的返回值 和 挂载 render() 返回
    setupComponent(instance)

    // 3. 开始调用 组件的 render 函数
    setupRenderEffect(instance, initialVNode, container)
  }

  function setupRenderEffect(instance: any, initialVNode, container: any) {

    /**
     * 这里的流程是进行 Element 的渲染 
     * 
     * 这里 使用 effect 函数，来监听 ref 的响应式
     * 
     * 
     * 使用一个变量判断当前是否是 初始化逻辑 & 更新逻辑 
     * 这里变量挂载在 instance 中  instance.isMounted 
     * 
     * 
     * 主要触发更新页面逻辑的是 patch() 函数
     * 在patch() 函数初始化时  传入 n1 : null  n2 当前的VNode 虚拟节点 
     * 当 patch() 执行更新的逻辑时，传入 n1 : 老的虚拟节点, n2 新的虚拟节点
     * 
     * 当执行 patch 函数主要的逻辑时，都是基于 n2 去做的, 所以当前代码进行很多的重构逻辑
     * 
     * 
     * 这就是 Element 更新的逻辑  
     */

    // 使用 effect监视模板中响应式数据的变化 
    effect(() => {
      // 然后实现依赖收集 & 触发依赖的实现
      // 把 渲染的逻辑 写在这里， 收集依赖


      // 使用 isMounted 判断是否 init 初始化
      if (!instance.isMounted) {
        // 初始化 
        console.log("init")
        // 当调用 render时候，应该拿到 组件的代理对象
        const { proxy } = instance
        // 拿到 proxy 后, 在调用 render时候，进行绑定

        // 调用 render() 函数
        // subTree 是 h() 函数返回的 vnode, 也是虚拟节点树 subTree 

        // 使用 instance.subTree 存储  subTree, 在更新时候需要用， 需要在 component 初始化 subTree 
        const subTree = (instance.subTree = instance.render.call(proxy))  // 绑定 proxy
        // const subTree = instance.render.call(proxy)  // 绑定 proxy


        // 查看 当响应式数据发生变化时， 虚拟节点 subTree 的变化 
        // console.log(subTree)

        // 再基于返回过来的虚拟节点 vnode, 再进一步的调用 patch() 函数
        // vnode -> subTree 是一个 Element类型 ->  挂载 mountElement

        // 递归调用 -> patch(虚拟节点，容器)

        // 这里赋值 instance, 也就是父级组件
        // 初始化 -> n1 为 null
        patch(null, subTree, container, instance)
        // patch()再去判断，-> subTree 的类型 -> 可能是 组件类型 或者 Element类型 -> 一直递归进行下去


        // 实现 $el 的关键时机， 在这个时候赋值 el
        // 当patch() 再次调用，可能是 进行Element流程
        // 将 subTree.el 赋值给 vnode.el
        initialVNode.el = subTree.el

        // 改变 isMounted 状态 
        instance.isMounted = true
      } else {
        // 更新逻辑 
        console.log("update")

        // 实现： 在初始化时 instance 中用一个变量 保存 subTree 的值
        // 在更新时候，获取到 上一个 subTree 

        const { proxy } = instance
        // 拿到更新后的 subTree
        const subTree = instance.render.call(proxy)

        // 取出 之前保存上一次组件的 subTree 
        const prevSubTree = instance.subTree

        // console.log("当前的subTree", subTree)
        // console.log("之前的subTree", prevSubTree)

        // 再次重新更新  instance.subTree  -> 达到多次更新 
        instance.subTree = subTree


        // 递归调用 -> patch(虚拟节点，容器)
        // 这里赋值 instance, 也就是父级组件

        // 实现 patch() 的更新逻辑 
        // 添加 n1 n2;  老的虚拟节点 & 新的虚拟节点
        patch(prevSubTree, subTree, container, instance)
      }


    })
  }



  // createRenderer() 函数导出
  // 返回一个对象 
  return {
    // 逻辑：
    // createAppApi(render) 调用 , 传入当前的 具体的 render 
    // createAppApi(render) 返回一个 createApp 函数 

    // 的到之前 createApp 
    createApp: createAppApi(render)
  }
}
