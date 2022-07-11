
import { isReadonly, readonly } from "../reactive"

describe('readonly', () => {

  // readonly 只读
  // 1.  表明着它不可以被 set 
  // 2.  在尝试修改它时候会抛出一个错误, 调用 set 时候 抛出一个错误


  it('happy path', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapper = readonly(original)

    expect(wrapper).not.toBe(original)
    expect(wrapper.foo).toBe(1)
  })


  // 2. 调用 set 时候 抛出一个错误
  it('warn then call set', () => {
    // 使用console.warn() 来检测错误

    // 定义错误函数
    console.warn = jest.fn()
    const user = readonly({age: 10})

    user.age = 11
    expect(console.warn).toBeCalled()
  })


  // 3. 实现 判断是否是 readonly 对象
  // isReadonly
  it('isReadonly', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapper = readonly(original)

    // 判断 readonly
    expect(isReadonly(wrapper)).toBe(true)
    expect(isReadonly(original)).toBe(false)
  })


  // 4. 嵌套的 readonly
  it('nested readonly', () => {
    const original = { foo: 1, bar: { baz: 2 }, array: [{ bar: 2 } ] }
    const wrapper = readonly(original)

    // 1. 嵌套的 bar 因该也是一个 readonly 对象
    expect(isReadonly(wrapper.bar)).toBe(true)
    // 2. 嵌套的 array 因该也是一个 readonly 对象
    expect(isReadonly(wrapper.array)).toBe(true)
    // 3. 嵌套的 array 的第一个元素，因该也是一个 readonly 对象
    expect(isReadonly(wrapper.array[0])).toBe(true)
  })
})
