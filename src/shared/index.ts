
// 导出 方法
export * from './toDisplayString'

export const extend = Object.assign

export function isObject(obj: any) {
  return obj !== null && typeof obj === 'object'
}


export function isString(value: any) {
  return typeof value === 'string'
}

//  hasChanged 是否改变
export const hasChanged = (newValue, value) => {
  // 如果它们相等 ，返回 false
  return !Object.is(newValue, value)
}
// 判断一个对象中是否具有 key 属性
export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)


// 实现 add-foo  变为 AddFoo
export const camelize = (str: string) => {
  // 返回一个正则替换
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : ""
  })
}

// 将 event 的 add 变为 Add  -> 首字符大写
const capitalize = (str: string) => {
  // 将首字符获取到，并转换为大写，然后拼接后面的字符串
  return str.charAt(0).toUpperCase() + str.slice(1);
}


// 处理 on + 事件 的行为
export const toHandlerKey = (str: string) => {
  // 如果 str 有值，执行首字符大写，没有返回空字符串
  return str ? "on" + capitalize(str) : ""
}

// const handler = props['onAdd']
// 使用 capitalize(event) 首字符大写行为
// const handler = props['on' + capitalize(event)]
// 实现 handerName
// 在这里使用 - 转为 驼峰命名 的函数 camelize()
// const handlerName = toHandlerKey(camelize(event))
// const handler = props[handlerName]

// // 判断 handler 有没有， 有就调用
// // 将 args 传入 handler 函数中，然后在APP组件上 emit(a,b)接收参数
// handler && handler(...args)


export const EMPTY_OBJ = {}
