
// 实现组件的更新流程 
import { h, ref } from "../../lib/guide-mini-vue.esm.js"

export const App = {
  name: "App",
  setup() {
    // 定义响应式数据
    const count = ref(0)

    // 点击事件 , 修改响应式数据
    const onClick = () => {
      count.value++
    }

    // 返回
    return { count, onClick }
  },

  render() {
    // 实现更新流程
    // console.log(this.count)
    return h(
      "div",
      { id: "root" },
      [
        h('div', {}, 'count: ' + this.count),  // 依赖收集
        h('button', { onClick: this.onClick }, "click")  // 修改数据
      ]
    )
  }
}
