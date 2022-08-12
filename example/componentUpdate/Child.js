import { h } from "../../lib/guide-mini-vue.esm.js"


export default {
  name: "Child",
  setup(props, { emit }) {

  },

  render(proxy) {
    return h('div', {}, [
      // 在render 中，实现通过 this.$props 访问当前组件的 props 
      h('div', {}, "child - props - msg: " + this.$props.msg)
    ])
  }
}
