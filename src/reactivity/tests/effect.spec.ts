import { effect } from '../effect'
import { reactive } from '../reactive'

describe("effect", () => {

  // 单元测试 

  // 使用 it.skip 进行拆分, 先实现 reactive 再实现 effect
  it('happy path', () => {
    let user = reactive({
      age: 10
    })

    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })
    expect(nextAge).toBe(11)

    // update
    user.age++
    expect(nextAge).toBe(12)
  })
})
