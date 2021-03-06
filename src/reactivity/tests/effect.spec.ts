import { effect, stop } from '../effect'
import { reactive } from '../reactive'

describe("effect", () => {

  // 单元测试 

  // 使用 it.skip 进行拆分, 先实现 reactive 再实现 effect
  it('happy path', () => {
    // 主要测试 
    // 1. 声明一个响应式对象
    let user = reactive({
      age: 10
    })

    let nextAge
    // 2. 调用 effect 函数
    effect(() => {
      nextAge = user.age + 1
    })
    // 验证结果
    expect(nextAge).toBe(11)

    // update 执行更新逻辑
    user.age++
    expect(nextAge).toBe(12)
  })


  // 实现 runner
  it("should return runner when call effect", () => {
    // 逻辑： 当调用 effect 时，会返回一个 runner
    // 而这个 runner 就是 effect 内部的 fn()
    // 当调用 runner 时候 会有一个 返回值 

    let foo = 10
    const runner = effect(() => {
      foo++
      return "foo"
    })

    // 初始会调用一次
    expect(foo).toBe(11)
     // 调用runner() 并且拿到返回值
    const r = runner();
    expect(foo).toBe(12)  // 因为 调用 runner 就相当于调用 effect() -> fn()
    expect(r).toBe("foo")
  })


  // 实现 scheduler, 
  // scheduler的函数 是 effect 函数的第二个参数
  // scheduler 定义是一个函数
  // scheduler 一开始不会被调用， 也就是 effect初始化 fn() 时候，不会调用 scheduler()
  // 当 修改，更新响应式对象值时候，修改值, 会执行 scheduler 一次。并且 fn() 不会被执行， 也就是不会执行 effect 的第一个参数
  // 当 执行 run() 的时候， 执行 fn() ， run() 就是 effect 返回出来的 runner() 
  // 当 执行 完 run(),  会执行fn() ，响应式的 发生改变

  it("scheduler", () => {
    // 1. 通过effect 的第二个参数给定了一个 scheduler 的 fn
    // 2. 当 effect 第一次执行的时候， 还会执行fn
    // 3. 当 响应式对象 set update 时， 不会执行 fn ， 而是执行 scheduler
    // 4. 如果说当执行 runner 的时候， 会再次执行 fn
    let dummy
    let run:any
    // jest.fn(xxx) 定义一个函数
    const scheduler = jest.fn(() => {
      // run 就是 runner
      run = runner
    })
    // 定义一个响应式对象
    const obj = reactive({
      foo: 1
    })

    // effect 返回出来的 runner, 将它赋值给 run
    let runner = effect(() => {
      dummy = obj.foo
    }, { scheduler })

    // effect 一开始执行 fn()
    expect(dummy).toBe(1)
    // scheduler 一开始不会被调用
    expect(scheduler).not.toHaveBeenCalled()

    // update
    obj.foo++ //  set -> 在 trigger 函数去触发 scheduler()
    // scheduler 被调用一次
    expect(scheduler).toHaveBeenCalledTimes(1)
    // 并且 dummy 值没有变化, 说明响应式对象的值发生改变了，scheduler 会被调用
    expect(dummy).toBe(1)
    // 当执行 run 方法时，执行 fn()
    run()
    expect(dummy).toBe(2)
  })


  // 实现 stop
  it("stop", () => {
    // 1. stop 是 effect 内部实现的函数
    // 2. stop() 接收 runner 参数， 调用后 响应式对象值不会再发生改变
    // 3. 但是直接调用 runner() 还是会让响应式对象发生改变
    
    // 定义响应式
    let dummy: any
    let obj = reactive({props: 1})
    const runner = effect(() => {
      dummy = obj.props
    })
    // update
    obj.props = 2
    expect(dummy).toBe(2)
    // 执行 stop() 时 dummy 值不会变
    stop(runner)

    // 出现问题： 这里执行 obj.props = obj.props + 1
    //  相当于执行  getter 和 setter
    // getter的之后会收集依赖， 而执行 stop(runner) 时候，清除掉了依赖，
    // 所以执行 setter 触发执行 fn()， ->  dummy = obj.props  = 2， 加 1 后得到3 


    // 解决问题: 
      // 1. 只需要在它收集依赖时候, 判断它是不是执行 stop() 的操作, 如果是 stop() 的操作，就不要收集依赖, 直接执行 fn()
      //    如果不是 stop() 继续执行 收集依赖然后执行 fn()
    obj.props++
    expect(dummy).toBe(2)
    
    // 执行 runner() , 触发更新
    runner()
    expect(dummy).toBe(3)
  })


  // 实现 onStop()， 也就是 stop() 的回调函数
  // 1. onStop() 是 effect 的第二个参数,  onStop() 是一个函数
  // 2. 当 stop() 执行完后， onStop() 会被执行  

  it('onStop()', () => {
    // 定义响应式
    let dummy
    let obj = reactive({foo: 1})
    // 定义 onStop()
    const onStop = jest.fn()
    const runner = effect(
      () => { dummy = obj.foo },
      { onStop } // onStop() 第二个参数
    )

    // 执行 stop()
    stop(runner)
    // onStop() 被执行一次, stop() 的回调函数
    expect(onStop).toHaveBeenCalledTimes(1)
  })
})
