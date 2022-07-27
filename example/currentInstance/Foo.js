import { h, getCurrentInstance } from "../../lib/guide-mini-vue.esm.js"

// Foo 组件
export const Foo = {
  name: "Foo",
  setup() {

    // 与App组件实现的逻辑一样 调用 getCurrentInstance 方法 查看当前的组件实例对象
    const instance = getCurrentInstance()
    console.log("Foo组件实例:", instance)
  },

  render() {
    return h("div", {}, "这是Foo组件")
  }
}
