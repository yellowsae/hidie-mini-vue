import { PublicInstanceProxyHandlers } from "./componentPublicInstance"
import { initProps } from "./componentProps"
import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit"
import { initSlots } from "./componentSlots"

// 创建一个组件的实例对象 -> instance
export function createComponentInstance(vnode, parent) {
  // 通过 vnode 创建一个组件的实例对象 component

  // console.log("createComponentInstance", parent)
  // 返回一个component对象
  const component = {
    vnode,
    // 为了简化操作——> 获取 type 
    type: vnode.type,

    // 初始时，声明setupState， 在后续 Proxy 中使用
    setupState: {},

    // 初始化props
    props: {},

    // 初始化 emit -> 是一个函数
    emit: () => { },

    // 初始化 slots
    slots: {},

    // 定义 provides 对象, 存储数据
    // 处理 provides 的指向, 
    // 当 parent 没有值时-> 初始，provides 为 空
    // 当 parent 有值时 -> 说明当前组件是一个子组件，provides 指向 parent 的 provides
    provides: parent ? parent.provides : {},
    // 定义 parent 对象, 子组件取到的数据, 是父组件的实例 instance
    parent,
  }

  // 声明 emit 方法， 挂载到 component.emit 上
  // 抽离 emit() 方法 -> componentEmit.ts
  component.emit = emit.bind(null, component) as any


  // 返回 component  组件实例对象
  return component
}


// 通过 vnode 创建一个组件的实例对象 ->  instance 
// instance 就是 虚拟节点

// 对组件初始化的逻辑函数
export function setupComponent(instance) {
  // 解析处理组件的其他内置属性 比如： props , slots 这些 
  // 和 组件中setup() 的返回值


  // TODO:
  // 1. 先初始化 props 
  // 初始化 initProps 给定两个参数， instance, 和 props 
  initProps(instance, instance.vnode.props)

  // 2. 初始化 slots
  //初始化 initSlots 给定两个参数， instance, 和 children 
  initSlots(instance, instance.vnode.children)

  // 3. 初始化component, 也就是 调用 setup() 之后的返回值
  setupStatefulComponent(instance)  // 翻译： setupStatefulComponent -> 初始化有状态的 component


}

// 实现 setup 函数调用
function setupStatefulComponent(instance: any) {
  // 拿到 setup() 的返回值 


  // 1. 获取到虚拟节点的type ， 也就是用户定义的 App 组件 
  const Component = instance.type

  // 创建组件代理对象 Proxy, 并添加到 instance组件实例上
  // Proxy的第一个参数 {}  -> ctx 上下文
  // instance.proxy = new Proxy({}, {
  //   get(target, key) {
  //     // target 就是ctx ， key 就是 ctx 需要获取的 key 
  //     // 例如： 在App组件中访问this.msg,   key 就是 msg

  //     // 1. 实现从setupState 拿到值
  //     // 解构 setupState 
  //     const { setupState } = instance
  //     // 判断 setupState 中是否有 key 属性
  //     if (key in setupState) {
  //       // 有属性，就 setupState 返回属性值
  //       return setupState[key]
  //     }

  //     // 2. 添加判断 实现访问 $el 的逻辑
  //     if (key === '$el') {
  //       // 如果是 $el ， 就返回真实的 DOM 元素
  //       // 这里instance 组件实例 上已经挂载了 vnode , 通过vnode访问 el 

  //       // 因为这里的 vnode 类型是 Object , 而不是 string ，说明这个 vnode 是组件的虚拟节点，不是element的。
  //       // 所以，通过 vnode 获取 el 元素，返回 null 
  //       // 解决： 就是当 再次调用patch()后，将 调用 render() 返回的 subTree.el 赋值给 vnode.el
  //       return instance.vnode.el
  //     }
  //   }
  // })

  // 实现重构
  // { _: instance } -> ctx传值 ，传 instance
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)



  // 2. 解构出 setup 
  const { setup } = Component

  // 判断 setup 是否存在
  if (setup) {
    // 给 currentInstance 赋值 为当前组件的实例对象
    // currentInstance = instance
    // 因为这里直接赋值不太合适，为了起到一个组件之间的一个中间层
    // 可以封装一个函数给 currentInstance 赋值
    setCurrentInstance(instance)

    // 调用 setup() 拿到返回值

    // 把 props 传入 setup() 
    // 因为 props是一个只读的 -> 在setup调用的时候，设置为shallowReadonly(props)

    // 实现emit -> 第二个参数{} -> 对象中有 emit 
    // 将 emit 默认赋值给 instance.emit
    const stupResult = setup(shallowReadonly(instance.proxy), { emit: instance.emit })


    // 清空 currentInstance
    currentInstance = null

    // 判断 stupResult 的类型
    handleStupResult(instance, stupResult)
  }
}


// 根据 setup 函数的返回值 stupResult 的类型
function handleStupResult(instance, stupResult: any) {
  // 因为 setup 可以返回出 Function | Object 
  // 如果是 Function 类型，那么就是组件的 render 函数
  // 如果是 Object 类型，将这个对象 注入到这个组件的上下文中

  // TODO: 这里先实现 Object， 之后再去实现 Function


  if (typeof stupResult === 'object') {
    // 将这个值注入到 instance 实例上
    instance.setupState = stupResult
  }

  // 需要保证 组件必须要用 render 函数
  finishComponentSetup(instance)
}


// 进行挂载 render 函数
function finishComponentSetup(instance: any) {
  const Component = instance.type

  // 判断组件中是否具有 render() 
  // 组件中具有 render(), 将 render 挂载到 instance 上
  instance.render = Component.render
}

// 全局变量 - 用于赋值当前组件的实例对象
let currentInstance = null


// 这里导出 getCurrentInstance() 函数
export function getCurrentInstance() {
  // 执行 getCurrentInstance 的逻辑
  // 目的： 导出组件的实例  instance 
  // 当前是拿不到 instance 的， 可以通过 一个全局变量 currentInstance 来拿到
  // 在调用 setup() 时, instance 指向的就是当前组件的实例；


  // 在 setup()  执行 getCurrentInstance() -> 返回currentInstance 当前组件实例

  // 返回全局变量； 也就是 instance
  return currentInstance
}

// 给currentInstance 赋值
function setCurrentInstance(instance) {
  // 为了起到一个组件之间的一个中间层
  // 可以封装一个函数给 currentInstance 赋值
  // 这样在之后调式代码时 在这个打上断点， 方便调式
  currentInstance = instance
}
