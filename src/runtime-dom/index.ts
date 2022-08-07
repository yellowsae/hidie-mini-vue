// 导入createRenderer
import { createRenderer } from '../runtime-core'


// 定义 createElement
function createElement(type) {  // 接收 type 属性

  // 测试
  // console.log("createElement-------------------")

  // 返回创建 Element  标签
  return document.createElement(type)
}


// 赋值属性
// 新增 pervProps之前的Props,  修改后的 nextProps
function patchProp(el, key, prevProp, nextVal) {
  // console.log("patchProp-------------------")

  // 接收 el & key & nextVal

  // 进行重构
  // 处理注册事件功能
  // 具体的 针对于 click -> 通用  （小步骤的开发思想）
  // 实现通用的，可以根据 组件的命名规范，来实现， 
  // 因为 on + 事件名称 ：  click -> onClick , onMouseDown -> MouseDown
  // 可以使用正则方式，匹配 on 之后的事件名，来注册不同事件

  // 封装 通过注册方法 isOn
  const isOn = (key: string) => /^on[A-Z]/.test(key)
  if (isOn(key)) {
    // if (key === 'onClick') {
    // 添加 注册点击事件 
    // nextVal 就是 onClick 的会调函数
    // el.addEventListener('click', nextVal)

    // 获取事件名称
    const event = key.slice(2).toLowerCase()
    el.addEventListener(event, nextVal)
  } else {
    // 如果不是 on 之后的事件名称

    // 实现2： foo 更新后变为了 null | undefined  ；  删除了 foo 属性
    // 新增判断： 如果 nextVal 为 undefined || null 时
    if (nextVal === undefined || nextVal === null) {
      // 执行删除
      el.removeAttribute(key)
    } else {
      // nextVal 有值 时 设置属性值
      // 设置 el 的属性值
      el.setAttribute(key, nextVal)

    }
  }

}


// 添加到容器
// 添加 anchor 锚点
function insert(child, parent, anchor) {
  // console.log("insert-------------------")

  // 接收 el & 父级容器 

  // 基于 DOM 实现的
  // parent.append(el)


  // 添加节点到执行位置之前 beforeinsert() 
  // 这里设置 默认锚点的位置为 null, 如果没有传值，默认为 null， 也就是默认添加到最后， 和append 一样
  parent.insertBefore(child, anchor || null)
}


// remove 
// 删除DOM节点
function remove(child) {
  // 1. 拿到 child 父级的 节点 -> div
  const parent = child.parentNode
  // 判断 parent 是否存在
  if (parent) {
    // 执行删除
    parent.removeChild(child)
  }
}


// SetElementText
// 实现添加文本节点的接口
function setElementText(el, text) {
  el.textContent = text
}


// 渲染接口 传入到 createRenderer 中
// 使用 renderer 接收 createRenderer 返回值 
const renderer: any = createRenderer({
  // 传入函数
  createElement,
  patchProp,
  insert,
  remove,
  setElementText
})


// 这里导出 用户使用的 createApp
// 包装  createApp
export function createApp(...args) {  //  接收 用户传入的参数

  // 它返回  createRenderer() 的 返回值 中的 createApp
  // 传入用户传入的参数到 createApp() 中

  // 返回实际的 createApp
  return renderer.createApp(...args)
}


// 导出 runtime-core
export * from '../runtime-core'



// 基于 DOM 的渲染接口 
