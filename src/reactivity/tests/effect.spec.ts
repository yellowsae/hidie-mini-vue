import { effect } from '../effect'
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
})
