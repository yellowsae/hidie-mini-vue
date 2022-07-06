
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

// 使用 targetMap -> Map() 声明一个容器
const targetMap = new Map()

export function track (target, key) { // 接收的参数就是 target : 对象 , key: 读取的属性值 
  // 实现一个 target -> key -> dep -> ReactiveEffect  的存储关系

  let depsMap = targetMap.get(target)

  // 判断 depsMap 是否存在
  if (!depsMap) {
    depsMap = new Map() // 进行初始化
    targetMap.set(target, depsMap)  // 存储数据
  }

  let dep = depsMap.get(key)  // 取出数据
  // 判断是否有 dep 
  if (!dep) {
    dep = new Set()  // 定义 dep,   使用 Set() 收集 ReactiveEffect
    depsMap.set(key, dep)
  }

  // 把 ReactiveEffect 收集到 dep 中
  dep.add(activeEffect) // activeEffect 是 ReactiveEffect 类的实例
}


// TODO: 触发依赖  执行依赖 run() 方法
export function trigger (target, key) {
  // 基于 target 和 key 取出 dep , 
  // 然后循环 dep, 取出实例对象，然后执行 run() 方法 

  // 1. 先取出 depsMap
  let depsMap = targetMap.get(target)
  // 2. 再取出 dep
  let dep = depsMap.get(key)

  // 3. 遍历 dep, 执行 触发依赖 run() 方法
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
