import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";


// 创建 RefImpl 保存 ref 的类
class RefImpl {
  private _value: any;
  public dep
  public _rawValue: any;
  constructor(value) {
    this._rawValue = value
    // 如果说 传过来的value 是一个对象的话，使用 reactive() 进行一个代理
    // this._value = isObject(value) ? reactive(value) : value  // 接收的值
    // 重构
    this._value = convert(value)


    // 实例化 dep 的值
    this.dep = new Set()
  }

  // 通过 .value 访问 ref 的值
  // TODO: 执行依赖收集
  get value() {

    // 重构： 抽离收集依赖的方法: trackRefValue()
    trackRefValue(this)
    return this._value
  }

  // TODO: 触发依赖 
  set value(newValue: any) {

    // 判断修改的值 与 之前的值是否相同，如果相同，则不执行触发依赖
    // 重构： hasChanged 判断是否发生改变

    // 问题2： 当修改的值是一个对象的话，对比会出现问题  object 的 对比; newValue 是一个 原始对象，而 _value 是一个代理对象
    // 解决： 使用 _rawValue 保存 ref 的原始值
    if (hasChanged(newValue, this._rawValue)) {

      // 转换
      this._rawValue = newValue  // 赋值为新的值
      // this._value 就等于代理的对象
      this._value = convert(newValue)


      // // 先修改值后，再进行触发依赖
      // this._value = newValue
      // 与收集依赖一样的逻辑，在 ReactiveEffect 已经定义好收集依赖的逻辑， 调用就行 
      triggerEffects(this.dep)
    }
  }
}

// 重构
// isObject的逻辑有重复的代码，使用 convert() 封装
function convert(value) {
  return isObject(value) ? reactive(value) : value
}



// 依赖收集的逻辑
function trackRefValue(ref) {
  // 在 ReactiveEffect 中的 track() 封装好依赖收集的方法
  // 把收集到的依赖，定义到这个类中 dep, 同样dep是一个Set
  // 又因为 track() 基于 target, 收集依赖，而 ref 只有一个 value ->对应一个dep 
  // 将收集依赖的逻辑抽离出来 trackEffects()， 封装 dep 的传参


  // 执行到 trackEffects() 出错，因为 dep 可能是 undefined，和之前出现的原因一样
  // 因为 读取 .value 值时，有一些数据， 不会触发依赖收集， 没有使用到 effect, 就单纯的读取，所以 dep 可能是 undefined
  // 解决： 判断 dep 如果是 undefined， 直接返回读取的值

  // 在 effect -> isTracking() 函数有判断过 dep 的存在, 直接使用就行
  if (isTracking()) {
    // 如果 isTracking() 返回值 为 true, 说明 activeEffect 有值
    trackEffects(ref.dep)  // 依赖收集
  }

}



// ref
export function ref(value) {

  // 返回一个 new RefImpl 的实例
  return new RefImpl(value)
}


/**
 * ref 的总体逻辑
 * 1. 因为 ref 传过来的值是一个单值,  1 -> "1" 
 *    而且需要知道在什么是否调用 getter 和 setter,
 *    
 *    代理对象使用的是 Proxy,  针对于 {} 对象，
 *    所以 ref 定义了 RefImpl 类，类中具有 get value 和 set value 的方法 , 这样就可以知道什么时候进行 get | set
 * 
 */
