// ref 的单测

import { effect } from '../effect'
import { reactive } from '../reactive'
import { isRef, proxyRefs, ref, unRef } from "../ref"
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

  // 4. isRef() 判断是否是 ref
  it('isRef', () => {
    const a = ref(1)
    const user = reactive({ age: 1 })
    expect(isRef(a)).toBe(true)
    expect(isRef(1)).toBe(false)
    expect(isRef(user)).toBe(false)
  })

  // 5. unRef () 获取 xxx.value 的值
  it('unRef', () => {
    const a = ref(1)
    expect(unRef(a)).toBe(1)
    expect(unRef(1)).toBe(1)
  })


  // 6. 实现 proxyRefs
  // proxyRefs 的功能，把 ref 的 .value 去掉，并且能够访问 ref .value的值
  it('proxyRefs', () => {
    const user = {
      age: ref(10),
      name: 'ZhangSan'
    }

    // 实现： get 方法 , 如果说 age(ref)  返回 .value 
    // not  ref  返回本身的值 value

    const proxyUser = proxyRefs(user)
    // 1. 通过proxyRefs 代理过的对象， 中有ref()，通过属性可以访问 值
    expect(proxyUser.age).toBe(10)
    expect(user.age.value).toBe(10)
    expect(proxyUser.name).toBe('ZhangSan')



    // 实现 set ,  判读是否是 ref 类型 ， 
    // true -> 修改 .value
    // false -> 那就是 ref(xxx) , 那就进行替换 


    //  修改 user.age  的值，和 proxyUser.age 的值
    proxyUser.age = 20
    expect(user.age.value).toBe(20)
    expect(proxyUser.age).toBe(20)

    // 如果要修改的值是 ref 对象, 直接替换
    proxyUser.age = ref(10)
    expect(user.age.value).toBe(10)
    expect(proxyUser.age).toBe(10)

    // 实现场景： 
    // 1. template -> 模板中的 ref 属性 
    //  vue3 -> setup(){return { ref(xxx) } },  在模板中就不需要使用 .value
  })
})
