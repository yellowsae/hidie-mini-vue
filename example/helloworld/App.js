// 引入 h 函数
import { h } from "../../lib/guide-mini-vue.esm.js"

// 创建APP组件

// 使用 window 添加事件 
window.self = null
export const App = {
  // 这里先不写 template，因为 template 最终会转为 runner 函数
  // 写 runder 
  render() {

    // 增加调试 this -> window
    window.self = this

    // ui 逻辑 
    // 返回一个虚拟节点

    // 当返回是 children 是 string时
    return h("div", {
      id: 'test1-id',
      class: 'test2-class'
    }, "hello " + this.msg
    )

    // 在 render 中还需要实现 :
    // 1. 实现 render() 中能够 setupState -> setup 的返回值
    // 这里的this.msg 应该是 setup()返回出来的 msg ， 怎么样能够拿到这个 setup() 中的 msg呢？
    // 只需要把 setup() 的返回值，绑定到 render() 的 this 上即可

    /**
     * 实现 setupState: 
     * 因为当前的 render() 函数不仅仅需要访问到 setupState 或者 使用 $el  setupState 这些 
     * 可能还会添加一些 $data 能够让 render() 快速访问
     * 
     * 解决： 可以通过 Proxy 实现 ，也就是 组件代理对象  -> 代理对象
     * 把 stateState &  $el   & $data 通过 Proxy 代理， 可以让 render() 快速访问
     * 
     * 实现方式:
     *  1. 在 初始化 setupState -> 调用 setup() 时，创建 代理对象 Proxy
     *  2. 创建代理对象，实现 xxx 功能 
     *  3. 把 代理对象绑定到 instace 组件实例上
     *  4. 当在调用 render() 函数时，通过 Proxy 访问 setupState 
     *  
     */


    // 2. 实现 this.$el 获取到当前组件的根节点  -> div
    // $el -> vue3 的API ， $el 的目的：返回根节点 element, 也就是组件的根节点， DOM实例


    /**
     * 实现 $el: 
     * $el 的作用： $el -> vue3 的API ， $el 的目的：返回根节点 element, 也就是组件的根节点， DOM实例
     * 
     * 实现方式:
     * 1. 在初始化 Element这里，需要将根节点保存起来, 使用el -> 在创建虚拟节点时候，初始化el 为null
     * 2. 在初始化 Element时，让 el 保存 根节点
     * 3. 在代理对象中, 添加判断逻辑，当在render中调用 this.$el时,  需要返回 el,
     * 
     */




    // 当children 是一个 Array 时
    // return h('div', {
    //   id: 'test1-array-1',
    //   class: 'test2-array-1'
    // }, [
    //   h('p', { class: 'red' }, '这是children的第一个数组'),
    //   h('p', { class: 'blue' }, '这是children的第二个数组')
    // ])
  },

  //  setup() 函数
  setup() {
    // 这里写 composition api 逻辑
    //  返回一个对象
    return {
      msg: "mini-vue-hhh"
    }
  }
}
