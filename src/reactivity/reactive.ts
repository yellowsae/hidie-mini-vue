import { isObject } from "../shared"
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers, shallowReactiveHandlers } from "./baseHandlers"


// 使用枚举方式， 定义 isReactive 的值
export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}



// isReactive 判断是否是响应式对象
export function isReactive(value) {

  // 返回一个布尔值 
  // 实现思路：
  // 1. 当读取 value 属性时，触发 get() 操作
  // 2. 在 get() 中，区分  value 是否是响应式对象  | 还是 readonly 对象

  // 使用 枚举 定义 isReactive 的值

  // / 这里如果当 调用的对象 不是一个 reactive 对象，就不会去调用 getter(),  
  //  value[ReactiveFlags.IS_REACTIVE] 就不会有值，所以这里返回的是一个 undefined

  //解决： 加上 !!xxxx  将undefined 转为 false 
  return !!value[ReactiveFlags.IS_REACTIVE]
}


// isReadonly 判断是否是 readonly 对象
export function isReadonly(value) {
  // 逻辑基本和 isReactive 一样 
  // 读取 value属性时，会触发 get() 操作, 在 get() 中，区分 value 是否是响应式对象 | 还是 readonly 对象
  return !!value[ReactiveFlags.IS_READONLY]
}

// isProxy 判断value是不是 readonly | reactive
export function isProxy(value) {
  return isReactive(value) || isReadonly(value)
}


// 导出 reactive() 函数
// 接收的响应式对象参数 raw
export function reactive(raw) {

  // // 返回一个 Proxy 代理对象，代理 raw 属性
  // return new Proxy(raw, {
  //   // // 当读取对象属性触发 get() 操作
  //   // get(target, key) {
  //   //   // 使用 Reflect() 反射 读取的值
  //   //   let Res = Reflect.get(target, key)

  //   //   // TODO: 收集依赖, 重点是执行收集的依赖
  //   //   track(target, key)
  //   //   return Res  // 把读取的属性值返回出去
  //   // },

  //   // // 当数据变化时触发 set() 操作
  //   // set(target, key, value) {
  //   //   // 修改变化的数据
  //   //   let Res = Reflect.set(target, key, value)

  //   //   // TODO: 触发依赖  这个核心
  //   //   trigger(target, key)
  //   //   return Res
  //   // },

  //   // 重构后 
  //   get: createGetter(),
  //   set: createSetter()
  // })


  // return new Proxy(raw, mutableHandlers)

  return createActiveObject(raw, mutableHandlers)
}


export function readonly(raw) {
  // return new Proxy(raw, {
  //   // get (target, key) {
  //   //   let Res = Reflect.get(target, key)

  //   //   // 并不会执行依赖收集
  //   //   // track(target, key)
  //   //   return Res
  //   // },

  //   set (target, key, value) {
  //     return true
  //   },

  //   // 重构后
  //   get: createGetter(true)
  // })

  //  抽离到 baseHandlers.ts
  return createActiveObject(raw, readonlyHandlers)
}


export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHandlers)
}

export function shallowReactive(raw) {
  return createActiveObject(raw, shallowReactiveHandlers)
}

// 把 new Proxy 抽离封装 为一个函数
function createActiveObject(target: any, baseHandlers: any) {
  // 如果 raw 不是一个对象
  if (!isObject(target)) {
    console.warn(`target ${target} 必须是一个对象`)
    return target
  }
  return new Proxy(target, baseHandlers)
}
/**
 * 因为 readonly 和  reactive 的很类似， 可以进行相应的代码重构 
 * - TDD 
 *   - 先写一个测试
 *   - 写逻辑代码，让测试通过 
 *   - 对代码进行重构
 * 
 * 
 * 重构就是把 具有相同|类似的代码内容，抽象成一个函数，让执行这个函数就行, 达到代码的优化，可读性更高
 */
