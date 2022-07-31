
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

/**
 * 实现 Props 的更新
 * 
 * props的更新要求 
 * 1. foo 之前的值 与 之后的值不一样了， 修改 props 属性
 * 2. foo 更新后变为了 null | undefined  ；  删除了 foo 属性
 * 3. bar 更新后这个属性在更新后没有了， 删除 bar 属性
 */
