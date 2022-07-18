

// 导出出口文件

export { createApp } from "./createApp"
export { h } from "./h"

/**
 * 初始化 runtime-core 的流程 和 初始化 组件 的流程总结
 * 
 * runtime-core: 实现的基本目的： 符合 vue3的设计思路 createApp(App).mount(#app)
 * 配合组件，实现组件的渲染，组件的更新，组件的销毁， 组件 Element 的渲染 等等
 * 
 * 
 * 
 * 初始化组件： 
 *  1. 在 mount(容器), 这个方法中， 对createApp 传入进来的 App组件容器, 进行转换为虚拟节点 vnode 
 *  2. 通过得到转换的 vnode ,  使用 runner(vnode, 容器) 函数，进一步处理 vnode
 *  3. runner() 函数的目的就是 负责调用 patch(vnode, 容器) 方法,  实现 patch()方法为了方便递归调用
 *  4. patch() 函数对vnode进行一个判断 ，如果 vnode 是一个组件，进行组件的初始化 ，如果它是 Element，就对 Element 进行渲染
 *  
 * 
 * 5. 当前只实现了组件的初始化
 *   - 1. 在 patch() 调用 processComponent()
 *   - 2. 在 processComponent() 进行组件的挂载 -> mountComponent(vnode, container)
 *   - 3. mountComponent(vnode, container) 挂载组件的逻辑
 *        - 通过 vnode 创建一个  组件的实例对象 -> instance  ； 使用 createComponentInstance(vnode) 方法
 *        - 设置 setupComponent(instance) 初始化组件， 解析处理组件的其他内置属性 比如： props , slots 这些 和组件中setup() 的返回值 和 挂载 runder() 
 *        - 开始调用 render 方法
 *             - 调用 instance.render() -> h() 返回出来的 subTree 虚拟 Element 节点 
 *             - 递归调用 patch(subTree, container) 进行一个 Element 的渲染
 * 
 * 
 */
