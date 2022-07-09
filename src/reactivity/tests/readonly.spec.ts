
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
})
