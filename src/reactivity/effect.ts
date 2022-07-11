import { extend } from "../shared"


// 定义的全局变量
// TODO: activeEffect:  定义的全局遍历，用于保存当前正在执行的 ReactiveEffect 对象
let activeEffect

// TODO: shouldTrack 判断应该执行 依赖收集, 在 getter() 时候进行调用
let shouldTrack


class ReactiveEffect {
  private _fn: any
  // 声明 deps 属性， 并且设置为一个数组, 存储所有的 dep 对象
  deps = []
  // 声明 active 属性，判断stop()是否被调用 ，当stop() 被调用过后，设置为 false
  active = true
  // 声明 onStop, 它是 stop 的回调函数
  onStop?: () => void
  constructor(fn, public scheduler?) {
    this._fn = fn
    // public scheduler?  : 是一个可选参数 scheduler 是一个函数
  }

  run() {

    // 因为执行 run() 方法会依赖收集,
    // 执行 stop() 不需要进行依赖的收集, 可以直接在run 方法这里判断, 做操作
    // active 判断 stop() 是否被调用
    if(!this.active) {  // 如果  active 为 false, 说明 stop() 被调用过
      // 不需要进行依赖收集
      return this._fn()
    }

    // 设置 shouldTrack 的状态 为 true, 进行依赖收集
    shouldTrack = true 
    activeEffect = this
    // 调用 fn
    const result = this._fn()

    // reset (重新来过):  设置 shouldTrack 的状态 为 false , 关闭依赖收集  -> 在 track 执行 收集依赖前把他给返回 
    shouldTrack = false
    // 当调用 fn() 时候，会有一个返回值，把返回值给返回出去
    return result
  }


  // stop 在这里实现
  stop() {
    // 实现stop, 只需要把 dep 进行清空
    // 问题？ 如果通过当前的 ReactiveEffect实例对象 找到 dep 对象

    // 使用 cleanupEffect 函数 抽离清空的逻辑

    // 考虑到性能问题，用户可能会多次调用 stop 方法，所以这里需要做一个判断
    // 使用active 判断是否已经被清空
    if (this.active) {
      cleanupEffect(this) // 参数就是当前的 ReactiveEffect 对象
      // onStop 的回调
      if (this.onStop) {
        this.onStop()
      }
      this.active = false // 设置为 false, 不会多次执行 stop
    }
  }
}

export function cleanupEffect(effect) {
  // 执行清空 dep
  effect.deps.forEach((dep: any) => {
    // 执行清空，dep 删除 当前 ReactiveEffect 对象
    dep.delete(effect)
  })
  effect.deps.length = 0
}


// TODO: 收集依赖

// 使用 targetMap -> Map() 声明一个容器
const targetMap = new Map()

export function track(target, key) { // 接收的参数就是 target : 对象 , key: 读取的属性值 


  // 重构:  把判断的逻辑提上来, 这里判断如果不需要进行依赖收集, 就直接返回
  // 封装为 isTracking 函数
  if(!isTracking()) return
  

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


  // 重构2
  // 如果 dep这个Set() 中 有 activeEffect , 直接 true 
  // 因为 dep 已经有 相应的依赖了, 不要重复去收集
  if (dep.has(activeEffect)) return

  // 把 ReactiveEffect 收集到 dep 中
  dep.add(activeEffect) // activeEffect 是 ReactiveEffect 类的实例

  // 使用 activeEffect 存储 dep, 达到 执行stop() 删除 dep 的目的 <-> 也就是 ReactiveEffect 类的实例 
  activeEffect.deps.push(dep)


  /**
   * 出现一个问题： 有可能activeEffects是一个 undefined 
    因为 activeEffect 是在 effect() 初始化时候run()才有的
    如果没有执行 effect() activeEffect 就是 undefined,  
    然后执行 get 操作执行收集依赖时候 ,  activeEffect.deps.push(dep) 这里就会报错

    // 解决： 
    // 如果  activeEffect 没有的话，直接 返回
    if(!activeEffect) return
   */
}


// 封装为一个函数 
function isTracking() {
  // // 如果  activeEffect 没有的话，直接返回，当执行 get 操作时候 , track 直接返回，不再执行下面的代码
  // if(!activeEffect) return
  // // 如果 shouldTrack 的状态为 false 不进行依赖收集
  // if(!shouldTrack) return

  // 如果有一个 为 false 就不要执行收集依赖 
  return shouldTrack &&  activeEffect !== undefined 
}



// TODO: 触发依赖  执行依赖 run() 方法
export function trigger(target, key) {
  // 基于 target 和 key 取出 dep , 
  // 然后循环 dep, 取出实例对象，然后执行 run() 方法 

  // 1. 先取出 depsMap
  let depsMap = targetMap.get(target)
  // 2. 再取出 dep
  let dep = depsMap.get(key)

  // 3. 遍历 dep, 执行 触发依赖 run() 方法
  for (const effect of dep) { // 循环  dep 中的 ReactiveEffect

    // 这里判断 是否有 scheduler 参数
    if (effect.scheduler) {
      // 如果有 执行 scheduler 方法
      effect.scheduler()
    } else {
      // 如果没有就普通的 修改数据， 执行run() 方法
      // 执行 它的 run 方法
      effect.run()
    }
  }
}



export function effect(fn, options: any = {}) {
  // fn ,   // options 表示第二个参数
  // 创建 effect

  // 保存 options.scheduler 参数
  const _effect = new ReactiveEffect(fn, options.scheduler)

  // onStop 回调函数的逻辑
  // _effect.onStop = options.onStop

  // options
  // 对 onStop 重构 
  // 使用 Object.assign(effect, options) , 挂载
  // Object.assign(_effect, options) 
  // 对 Object.assign() 进行封装语义化  -> 把Object.assign抽离出去，改个名字
  // extend
  extend(_effect, options)



  // effect() 初始时候 进行调用 run() 
  _effect.run()

  // 返回 fn(),  就是 runner
  // 因为 run() 方法中使用到了 activeEffect ，会出现一个 this 指向的问题， 使用 bind() 将 this 指向 _effect
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect  // 使用 runner.effect 存储 _effect 
  return runner
}


// stop() 逻辑 
export function stop(runner) {
  // runner -> 是 effect 返回出去的 runner 

  // ?  如何能够 执行到 ReactiveEffect 实例对象的 stop() 方法 
  // 可以通过 effect 返回出去的 runner,  在 runner 这里挂载  _effect 实例 , 然后通过 runner.effect 调用 stop() 方法
  runner.effect.stop()
}
