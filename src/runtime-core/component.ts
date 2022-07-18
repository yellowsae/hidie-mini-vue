

export function createComponentInstance(vnode) {
  // 通过 vnode 创建一个组件的实例对象 component


  // 返回一个component对象
  const component = {
    vnode,
    // 为了简化操作——> 获取 type 
    type: vnode.type
  }

  // 返回 component
  return component
}


// 通过 vnode 创建一个组件的实例对象 ->  instance 
// instance 就是 虚拟节点
export function setupComponent(instance) {
  // 解析处理组件的其他内置属性 比如： props , slots 这些 
  // 和 组件中setup() 的返回值


  // TODO:
  // 1. 先初始化 props 
  // initProps()

  // 2. 初始化 slots
  // initSlots()

  // 3. 初始化component, 也就是 调用 setup() 之后的返回值
  setupStatefulComponent(instance)  // 翻译： setupStatefulComponent -> 初始化有状态的 component


}

function setupStatefulComponent(instance: any) {
  // 拿到 setup() 的返回值 


  // 1. 获取到虚拟节点的type ， 也就是用户定义的 App 组件 
  const Component = instance.type

  // 2. 结构出 setup 
  const { setup } = Component

  // 判断 setup 是否存在
  if (setup) {
    // 调用 setup() 拿到返回值

    const stupResult = setup()

    // 判断 stupResult 的类型
    handleStupResult(instance, stupResult)
  }
}
function handleStupResult(instance, stupResult: any) {
  // 因为 setup 可以返回出 Function | Object 
  // 如果是 Function 类型，那么就是组件的 render 函数
  // 如果是 Object 类型，将这个对象 注入到这个组件的上下文中

  // TODO: 这里先实现 Object， 之后再去实现 Function


  if (typeof stupResult === 'object') {
    // 将这个值注入到 instance 实例上
    instance.setupState = stupResult
  }

  // 需要保证 组件必须要用 runner 函数
  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type

  // 判断组件中是否具有 runner() 
  if (Component.render) {
    // 组件中具有 runner(), 将 runner 挂载到 instance 上
    instance.render = Component.render
  }
}

