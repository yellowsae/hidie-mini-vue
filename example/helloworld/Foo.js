import { h } from "../../lib/guide-mini-vue.esm.js"

export const Foo = {

  // 1. setup 接收 props
  setup(props) {

    // 实现 setup 访问 props 
    // 分析：只需要在调用setup时候把 props 传入 setup 函数即可
    // 实现：
    // 1. 在初始化setup 时候， 声明 initProps(),  把 instance  和 instance.vnode.props 传递进去 
    // 2. initProps() 的逻辑-> 把props 挂载到 instance 上
    // 3. 在调用 setup() 时候传入 instance.props 作为参数
    console.log(props)


    // 3. props 是 只读的 Shallow readonly 的
    // 实现：
    // 1. 只需要在调用setup(props) 是否 设置 props 是 shallowReadonly 就行
    // 注意： 
    //  - props 在初始化时候位 null -> 在执行shallowReadonly 是 target 必须是一个对象，
    //    所以在initProps时候 初始化 props 时，如果为null， 设置props 为一个 空对象 {} 
    props.count++
    console.log(props)


  },



  render() {
    // 2. 在 render 中 通过 this.count 能够访问 props.count 的值
    // 分析：需要在 render() 中 this 调用 xxx, 
    //     也就是之间实现 this.xxx = xxx -> 创建的代理对象中， 访问key, 然后拿到它的返回值， props 也可以通过这样的方式实现
    // 实现：
    //  1. 在实现代理对象Proxy的中的 PublicInstanceProxyHandlers 中 处理 props 的返回值
    //  2. PublicInstanceProxyHandlers 重构 通过key拿到返回值的方法， 通过 hasOwn(obj, key) 来判断对象具有的属性值
    //  3. 通过解构的方法 拿到 props 对象 , 再使用 hasOwn(props, key) 判断， 返回 props[key] 的值
    return h('div', {}, 'Foo   ' + this.count)
  }
}
