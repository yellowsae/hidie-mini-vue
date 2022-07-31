// import ArrayToText from "./ArrayToText.js"
import { h, ref } from "../../../lib/guide-mini-vue.esm.js"

// Text
const nextChildren = "newChildren"
// 老的节点 
const prevChildren = [h("div", {}, "A"), h("div", {}, "B")]

// 老的节点为 Array
// 新的节点为 Text

export default {
  name: "ArrayToText",
  setup() {
    // 定义响应式变量
    const isChange = ref(false)
    window.isChange = isChange
    return {
      isChange
    }
  },

  render() {
    const self = this

    // 实现根据 isChange 判断显示的 节点
    return self.isChange === true ? h("div", {}, nextChildren) : h("div", {}, prevChildren)
  }
}
