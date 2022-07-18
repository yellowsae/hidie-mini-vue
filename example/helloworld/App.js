

// 创建APP组件

export const App = {
  // 这里先不写 template，因为 template 最终会转为 runner 函数
  // 写 runder 
  render() {
    // ui 逻辑 
    // 返回一个虚拟节点
    return h("div", "hello" + this.msg)
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
