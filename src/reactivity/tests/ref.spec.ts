// ref 的单测

import { effect } from '../effect'
import { ref } from "../ref"
describe('happy path', () => {

  // 1. 实现 ref
  it('ref', () => {
    const a = ref(1)
    expect(a.value).toBe(1)
  })

  // 2. 使用 响应式的 ref
  it('should be reactive', () => {
    const a = ref(1)
    let dummy
    let calls: number = 0
    effect(() => {
      calls++
      dummy = a.value
    })

    // 执行测试 
    expect(calls).toBe(1)  // effect 应该被调用一次
    expect(dummy).toBe(1)  // dummy 应该为 1

    // 执行更新逻辑
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)

    // 当再次更新为相同的值时，不用重新调用 effect
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
  })


  // 3. 当 ref() 的值是一个对象时候
  it('should make nested properties reactive', () => {

    // ref({}) 参数一个对象
    const a = ref({
      count: 1
    })
    let dummy
    effect(() => {
      // 通过 .value 拿到 count
      dummy = a.value.count
    })

    expect(dummy).toBe(1)

    // 更新 count
    a.value.count = 2
    expect(dummy).toBe(2)
  })
})
