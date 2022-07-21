

// 实现 Emit

import { camelize, toHandlerKey } from "../shared";


// 导出 emit 函数
// 接收 Foo组件 中 emit('事件名') -> 中事件名 参数 
export function emit(instance, event, ...args) {  // 添加 emit 的参数

  // 检测 emit 的传参
  console.log('emit', event, '在 emit实现逻辑中调用')


  // 实现 emit 逻辑
  // 1. 找到 instance.props  中有没有这个 event 对应的 函数名和回调函数
  //   -> 实现: 传入 instance 拿到 props 
  //   -> 因为在Foo组件的emit 只会传入一个事件名的参数， 不是两个参数
  //   -> 可以在componet.emit 调用 emit()时候 使用 bind() -> emit.bind(null, component), 代表传入第一个函数是this, 第二个参数是 emit接收的第一个参数instance 这是一个代码技巧
  // 2. 取到 props, 根据key 拿到对应的事件函数


  // TPP 开发技巧 ：先去写一个特定的行为，再去重构为通过的行为
  const { props } = instance;

  // 判断传入过来的参数是不是一个 add

  // // 实现 add-foo  变为 AddFoo
  // const camelize = (str: string) => {
  //   // 返回一个正则替换
  //   return str.replace(/-(\w)/g, (_, c: string) => {
  //     return c ? c.toUpperCase() : ""
  //   })
  // }

  // // 将 event 的 add 变为 Add  -> 首字符大写
  // const capitalize = (str: string) => {
  //   // 将首字符获取到，并转换为大写，然后拼接后面的字符串
  //   return str.charAt(0).toUpperCase() + str.slice(1);
  // }


  // // 处理 on + 事件 的行为
  // const toHandlerKey = (str: string) => {
  //   // 如果 str 有值，执行首字符大写，没有返回空字符串
  //   return str ? "on" + capitalize(str) : ""
  // }

  // // const handler = props['onAdd']
  // // 使用 capitalize(event) 首字符大写行为 
  // // const handler = props['on' + capitalize(event)]


  // 使用重构 

  // 实现 handerName 
  // 在这里使用 - 转为 驼峰命名 的函数 camelize()
  const handlerName = toHandlerKey(camelize(event))
  // 根据props中的key, 找到对应的回调函数, 然后执行
  const handler = props[handlerName]

  // 判断 handler 有没有， 有就调用
  // 将 args 传入 handler 函数中，然后在APP组件上 emit(a,b)接收参数 
  handler && handler(...args)

} 
