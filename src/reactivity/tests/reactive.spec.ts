import { isReactive, reactive, isProxy } from '../reactive';

describe('reactive', () => {


  // 1. 响应式的实现
  it('happy path', () => {
    let observable = { foo: 1 }
    let newReactive = reactive(observable)
    // 测试一，初始对象， 不等于响应式对 象
    expect(newReactive).not.toBe(observable)
    // 测试二，响应式对象获取的值，就是初始对象的值
    expect(newReactive.foo).toBe(1)
  })


  // 2. isReactive 判断是否是响应式对象
  it('isReactive', () => {
    let observable = { foo: 1 }
    let newReactive = reactive(observable)
    expect(isReactive(newReactive)).toBe(true)
    expect(isReactive(observable)).toBe(false)
  })


  // 3. 执行嵌套逻辑的 reactive 函数
  it('nested reactive', () => {
    const original = { foo: 1, bar: { baz: 2 }, array: [{ bar: 2 }] }
    const observed = reactive(original)

    // 1. observed.bar 嵌套的bar 因该也是一个响应式对象
    expect(isReactive(observed.bar)).toBe(true)
    // 2. 嵌套的 array 因该也是一个响应式对象
    expect(isReactive(observed.array)).toBe(true)
    // 3. 嵌套的 array 的第一个元素，因该也是一个响应式对象
    expect(isReactive(observed.array[0])).toBe(true)
  })


  // 4. 实现 isProxy 
  // isProxy 判断对象是否  reactive | readonly
  it('nested reactive', () => {
    const original = { foo: 1, bar: { baz: 2 }, array: [{ bar: 2 }] }
    const observed = reactive(original)
    expect(isProxy(observed)).toBe(true)
  })
})
