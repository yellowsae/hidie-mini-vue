import { ReactiveEffect } from "./effect"


class ComputedRefImpl {
  private _getter: any
  private _dirty: boolean = true
  private _value: any
  private _effect: any
  constructor(getter) {
    this._getter = getter

    // 初始化 effect , 把 getter -> fn
    this._effect = new ReactiveEffect(getter, () => {
      // 第二次调用时候 不会一直执行 getter , 而是执行这里
      // 把 dirty 设置为 true
      if (!this._dirty) {
        this._dirty = true  // 改为 true 后，修改时调用 this._effect.run()
      }
    })
  }
  get value() {
    // 实现测试3，缓存功能
    // 逻辑实现： 使用一个变量 dire 初始设置为true 判断，
    // 当初始时使用 .value 计算属性， 判断dire，true -> 表示初始 -> 执行返回值操作 ; dire -> false， 表示二次访问.value ， 直接走缓存

    // 实现测试4，修改计算属性功能 响应式数据发生变化,
    // 重新执行 getter, 但是测试里，不希望执行原来的 getter, 还希望 dirty 为 true 
    // 解决： 可以使用 effect 的第二个参数 -> scheduler 中实现
    // 使用 -> effect
    if (this._dirty) {
      // _dire -> true  -> 初始操作 
      this._dirty = false  // 关闭 -> 锁上 
      // this._value = this._getter()
      // 改为 调用 fn , 当 dirty 为 true 时，执行 fn
      this._value = this._effect.run()
    }

    // 这里直接返回缓存的值
    return this._value
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter)
}

/**
 * 计算属性总结：
 * 
 * 计算属性：
 *   - 计算属性内部有一个 effect 和 getter value
 *   - 当用户调用 get value 时，会调用传过来的 fn, 然后把 fn 的值返回出去
 * 
 * - 怎么做到缓存的 
 * 使用了 this._dirty 这个变量，这个变量的作用是判断 这个 get value 有没有被调用过 
 *    - 第一次调用时 -> 设置 this._dirty为 false , 返回 fn 的值
 *    - 第二次调用 -> 返回缓存的值
 * 
 * - 当内部依赖响应式发生改变时， value.foo = 2
 *    -  会触发 trigger(), 然后会触发 effect 的第二个参数，-> schelder()这个函数,  因为在 trigger 中有判断 scheduler 是否存在
 *    -  执行 scheduler() -> 会把 dirty 设置为 true , 这样当用户再次调用 get value 重新会调用 _effect.run() -> fn , 得到最新的值，然后把他return 出去
 * 
 */
