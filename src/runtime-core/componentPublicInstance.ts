import { hasOwn } from "../shared"

// 声明一个对象，根据key，判断是否有属性，返回 instance 上的值
const publicPropertiesMap = {
  $el: (instance) => instance.vnode.el,
  $slots: (instance) => instance.slots,
  $props: (instance) => instance.props
}

// 这里的 instance ， 可以通过 ctx 进行传值 
// { _: instance } -> 传值的方式
export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    // target 就是ctx ， key 就是 ctx 需要获取的 key 
    // 例如： 在App组件中访问this.msg,   key 就是 msg

    // 1. 实现从setupState 拿到值
    // 解构 setupState 
    // const { setupState } = instance
    // // 判断 setupState 中是否有 key 属性
    // if (key in setupState) {
    //   // 有属性，就 setupState 返回属性值
    //   return setupState[key]
    // }


    // 拿到 props 
    const { setupState, props } = instance


    // 重构一下 
    // 使用 hasOwn() 方法，判断  object 是否具有 key 属性
    if (hasOwn(setupState, key)) {
      // 如果有，直接返回 key 对应的值
      return setupState[key]
    } else if (hasOwn(props, key)) {
      return props[key]
    }



    // 2. 添加判断 实现访问 $el 的逻辑
    // if (key === '$el') {
    //   // 如果是 $el ， 就返回真实的 DOM 元素
    //   // 这里instance 组件实例 上已经挂载了 vnode , 通过vnode访问 el 

    //   // 因为这里的 vnode 类型是 Object , 而不是 string ，说明这个 vnode 是组件的虚拟节点，不是element的。
    //   // 所以，通过 vnode 获取 el 元素，返回 null 
    //   // 解决： 就是当 再次调用patch()后，将 调用 render() 返回的 subTree.el 赋值给 vnode.el
    //   return instance.vnode.el
    // }


    // 因为后续可能不只有 $el，还会添加其他， 直接使用 key === $el 不太合适
    // 实现重构, 重构方式 -> publicPropertiesMap[key]
    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) {
      return publicGetter(instance)
    }
  }
}
