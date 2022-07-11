import { isObject } from '../shared';
import { track, trigger } from './effect';
import { reactive, ReactiveFlags, readonly } from './reactive';


// 将 reactive 的代码抽离出来


// 一上来初始化时候，就创建 getter 和 setter,  达到缓存的目的
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)



// 重构 get 函数 

function createGetter(isReadonly = false) {  // 默认参数，执行是不是 readonly
  return function get (target, key) {

    // 这里判断是否是响应式对象 还是  readonly 对象
    if (key === ReactiveFlags.IS_REACTIVE) {
      // 判断是否响应式对象
      return !isReadonly
    }else if (key === ReactiveFlags.IS_READONLY) {
      // 判断是否 是 readonly
      return isReadonly
    }

    // 返回出去的值
    let Res = Reflect.get(target, key)

    
    // 可以进行一个判断,实现 reactive 嵌套功能
    // 1. 判断 Res 是否是一个 Object 
    if(isObject(Res)) {
      // 如果是 object  执行 reactive 函数 , 达到嵌套的效果
      // 返回 reactive(Res) 的结果, 也就是 嵌套的响应式对象 添加了 getter 和 setter 的结果
      // 判断isReadonly 是否是 readonly 还是  reactive, 然后执行它们之间的嵌套
      return isReadonly ? readonly(Res) :  reactive(Res)
    }



    // 需要区分执行这个 get() 是 reactive 还是 readonly
    if (!isReadonly) {
      // 如果不是 readonly，执行 track() 依赖收集
      track(target, key)
    }
    return Res
  }
}



// 重构 setter() 
function createSetter() {
  return function set(target, key, value) {
    let Res = Reflect.set(target, key, value)
    trigger(target, key)
    return Res
  }
}


export const mutableHandlers = {
  // get: createGetter(),
  // set: createSetter()
  
  // 重构
  get,
  set
}


export const readonlyHandlers = {
  // 重构后
  get: readonlyGet,
  set (target, key, value) {
    console.warn(`key: ${key} set 失败, 因为 target 是 readonly`, target)
    return true
  },
}
