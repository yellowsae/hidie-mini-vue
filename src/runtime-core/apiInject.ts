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
    const { provides } = currentInstance

    // 存储 {  foo: fooValue }
    provides[key] = value
  }
}


export function inject(key) {
  // 取数据 

  // 1. 获取 instance 
  const currentInstance: any = getCurrentInstance()

  // 2. 取数据
  if (currentInstance) {

    // 取它父级里 存储数据的 parent
    // 通过 parent 取到 provides 对象

    const parentProvides = currentInstance.parent.provides

    // 
    return parentProvides[key]
  }
}
