// 引入 h 函数
import { h, ref } from "../../lib/guide-mini-vue.esm.js"
import Child from "./Child.js"




// 实现组件更新的逻辑 
export const App = {
  name: "App",
  setup() {
    const msg = ref("123")
    const count = ref(1)

    window.msg = msg

    const changeChildrenProps = () => {
      msg.value = "456"
    }

    const changCount = () => {
      count.value++
    }
    return {
      msg, changeChildrenProps, count, changCount
    }
  },

  render() {
    return h(
      "div",
      {},
      [
        h('div', {}, "你好"),
        h('button', { onClick: this.changeChildrenProps }, "change children props"),
        // 传给 Child 组件的 props
        h(Child, { msg: this.msg }),

        // 修改 count 
        h('button', { onClick: this.changCount }, "change self count"),
        h('p', {}, "count: " + this.count)
      ]
    )
  }
}
