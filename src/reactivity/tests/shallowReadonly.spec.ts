import { isReadonly,  shallowReadonly } from "../reactive"


describe('shallowReadonly', () => {
  // shallowReadonly -> shallow  表层的意思 
  // 将对象的表层变为只读的

  it('should not make non-reactive properties reactive', () => {
    const props = shallowReadonly({ n: { foo: 1 } })

    // 测试: props 是一个 readonly 对象
    expect(isReadonly(props)).toBe(true)
    // 测试: props.n 不是一个 readonly 对象
    expect(isReadonly(props.n)).toBe(false)
  })


  // 2. 测试 shallowReadonly 的 setter 
  // 调用 set 时候 抛出一个错误
  it('warn then call set', () => {
    // 使用console.warn() 来检测错误

    // 定义错误函数
    console.warn = jest.fn()
    const user = shallowReadonly({ age: 10 })

    user.age = 11
    expect(console.warn).toBeCalled()
  })

})
