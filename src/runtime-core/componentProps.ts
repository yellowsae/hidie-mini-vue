

// initProps 的逻辑 
// 两个参数 -> instance 组件的实例 , rawProps -> 没有经过初始化的 props 
export function initProps(instance, rawProps) {


  // 逻辑： 只需要把 props 挂载到 instance 上， 
  // 然后在调用 setup() 时候传输 props 给到就行了


  // 需要props 在创建 instance 时 初始化 init 
  // 如果 rawProps 为空 ，则设置为 {}
  instance.props = rawProps || {}

  //  后续处理 attrs


}
