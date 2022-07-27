import { getCurrentInstance } from "./component"


export function provide(key, value) {
  // 存数据

  // 1. 存数据到哪里 
  //  在 初始化 component 时， 定义一个 provides 对象 用于存储 provide & inject 的数据 

  // 2. 获取 当前的组件实例对象 instance 
  // 使用 getCurrentInstance() 获取当前组件实例对象
  const currentInstance: any = getCurrentInstance()


  // 3. 存储数据
  if (currentInstance) {
    // 获取 provides
    let { provides } = currentInstance

    // 获取 父级 provides 对象
    const parentProvides = currentInstance.parent && currentInstance.parent.provides


    // 注意点：这里可能是 init 初始化 
    // 判断初始化： 当 provides 等于它 父级的 provides 对象时，说明是初始化
    if (provides === parentProvides) {

      // 初始化时，给 provides 对象赋值 -> 形成原型链

      // 改写 provides 指向 parent的 provides ： 形成原型链
      provides = currentInstance.provides = Object.create(parentProvides)
      //  currentInstance.provides 当前组件的 provides

    }


    // 存储 {  foo: fooValue }
    provides[key] = value
  }
}


export function inject(key, defaultValue?) { // 实现 inject 具有默认值的功能 
  // 取数据 

  // 1. 获取 instance 
  const currentInstance: any = getCurrentInstance()

  // 2. 取数据
  if (currentInstance) {

    // 取它父级里 存储数据的 parent
    // 通过 parent 取到 provides 对象

    const parentProvides = currentInstance.parent.provides

    if (key in parentProvides) {
      // 如果具有 key 时 
      return parentProvides[key]
    } else if (defaultValue) {

      // 判断 默认值是否是函数
      if (typeof defaultValue === 'function') {
        return defaultValue()
      }
      // 返回默认值
      return defaultValue
    }
  }
}
