// 引入 h 函数
import { h } from "../../lib/guide-mini-vue.esm.js"

// 创建APP组件

export const App = {
  // 这里先不写 template，因为 template 最终会转为 runner 函数
  // 写 runder 
  render() {
    // ui 逻辑 
    // 返回一个虚拟节点

    // return h("div", {
    //   id: 'test1-id',
    //   class: 'test2-class'
    // }, "hello mini-vue")   // 当返回是 children 是 string时

    // 当children 是一个 Array 时
    return h('div', {
      id: 'test1-array-1',
      class: 'test2-array-1'
    }, [
      h('p', { class: 'red' }, '这是children的第一个数组'),
      h('p', { class: 'blue' }, '这是children的第二个数组')
    ])
  },

  //  setup() 函数
  setup() {
    // 这里写 composition api 逻辑
    //  返回一个对象
    return {
      msg: "mini-vue"
    }
  }
}
