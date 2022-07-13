import { isReactive, shallowReactive } from "../reactive"


describe('shallowReactive', () => {

  it('should not make non-reactive properties reactive', () => {
    const props = shallowReactive({ n: { foo: 1 } })

    // 测试: props 是一个 readonly 对象
    expect(isReactive(props)).toBe(true)
    // 测试: props.n 不是一个 readonly 对象
    expect(isReactive(props.n)).toBe(false)
  })
})
