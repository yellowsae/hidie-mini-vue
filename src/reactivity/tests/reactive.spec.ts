import { isReactive, reactive } from '../reactive';

describe('reactive', () => {


  // 1. 响应式的实现
  it('happy path', () => {
    let observable = {foo: 1}
    let newReactive = reactive(observable)
    // 测试一，初始对象， 不等于响应式对象
    expect(newReactive).not.toBe(observable)
    // 测试二，响应式对象获取的值，就是初始对象的值
    expect(newReactive.foo).toBe(1)
  })


  // 2. isReactive 判断是否是响应式对象
  it('isReactive', () => {
    let observable = {foo: 1}
    let newReactive = reactive(observable)
    expect(isReactive(newReactive)).toBe(true)
    expect(isReactive(observable)).toBe(false)
  })
})
