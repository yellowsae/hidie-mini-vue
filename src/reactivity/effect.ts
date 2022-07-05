
class ReactiveEffect {
  private _fn: any
  constructor(fn) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    this._fn()
  }
}


// TODO: 收集依赖
const targetMap = new Map()
export function track (target, key) {
  // 实现一个 target -> key -> dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()  // 使用 Set() 收集
    depsMap.set(key, dep)
  }

  // 把 ReactiveEffect 收集到 dep 中
  dep.add(activeEffect) // activeEffect 是 ReactiveEffect 类的实例
}


// TODO: 触发依赖  执行依赖 run() 方法
export function trigger (target, key) {
  // 基于 target 和 key 取出依赖 fn,  并执行 fn 
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  // 执行依赖
  for (const effect of dep) { // 循环  dep 中的 ReactiveEffect
    // 执行 它的 run 方法
    effect.run()
  }
}


let activeEffect
export function effect(fn) {
  // fn 
  // 创建 effect
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}
