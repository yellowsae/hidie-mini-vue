import { h, getCurrentInstance } from "../../lib/guide-mini-vue.esm.js"
import { Foo } from "./Foo.js"

export const App = {
  name: "App",
  render() {
    // render中渲染了 App ， 还渲染了 Foo
    return h('div', {}, [h('p', {}, 'currentInstance demo'), h(Foo)])
  },


  // getCurrentInstance 方法的实现
  setup() {
    // getCurrentInstance 的作用：  https://v3.cn.vuejs.org/api/composition-api.html#getcurrentinstance
    // getCurrentInstance ->  获取当前组件的实例对象 
    // getCurrentInstance 必须要在 setup() 中使用
    // 查看虚拟节点的类型

    const instance = getCurrentInstance()
    console.log("这是getCurrentInstance 获取的App组件实例:", instance)

    // 实现 getCurrentInstance
    /**
     * 1. 在component中实现 getCurrentInstance 方法
     * 2. 定义一个全局变量，在 setup() 调用时 给全局变量赋值为当前组件实例 
     * 3. getCurrentInstance 返回 这个全局变量
     */
  }
}
