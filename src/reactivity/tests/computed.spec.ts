
// computed -> 计算属性的实现 

import { computed } from "../computed"
import { reactive } from "../reactive"

describe('computed', () => {

  // 1. 实现 computed 属性
  it('happy path', () => {
    // - 计算属性类似 ref , 通过 返回值的 .value 访问属性值
    // - 计算属性 接收一个参数，  参数->是一个函数
    // - 参数属性 fn 具有一个返回值  
    // - 计算属性具有 缓存的效果  (重要)
    const user = reactive({
      age: 1
    })

    const age = computed(() => {
      return user.age
    })

    // 测试1 : 计算属性返回值 通过 .value 访问
    expect(age.value).toBe(1)
  })

  // 2. 实现缓存 功能
  // - 当响应式数据 .value 没有发生变化时候 | 二次调用时候，拿到的是缓存的值，也就是上一次的值
  it('should compute lazily', () => {
    const value = reactive({
      foo: 1
    })
    // 定义一个 getter 函数 
    const getter = jest.fn(() => {
      // 返回一个 响应式的值
      return value.foo
    })
    const cValue = computed(getter)

    // 测试1: 当没有使用 cValue,这个计算属性的值时，  getter 不会被调用
    // lazy 懒执行
    expect(getter).not.toHaveBeenCalled()

    // 测试2： 当使用 cValue.value, 这个计算属性的值时，调用 getter()获取相应的值, 能够读取到相应的值
    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)  // getter 调用一次

    // 测试3： 当再次 读取cValue.value， 而是直接拿到缓存的值, 不是从 getter 获取的值
    cValue.value  // 这里直接返回缓存的值, 不会执行 getter
    expect(getter).toHaveBeenCalledTimes(1)

    // 测试4： 当修改 响应式对象 value.foo 的值， getter 还会执行一次
    // update
    value.foo = 2 // 收集trigger -> 使用 effect 收集 -> get 重新执行
    // 修改值，不会调用 getter， 而是执行 scheduler, 把 this._dirty 设置为true,
    // toHaveBeenCalledTimes(1) -> 是getter上一次的调用
    expect(getter).toHaveBeenCalledTimes(1)

    // 执行 trigger 完成修改值
    expect(cValue.value).toBe(2)
    // 当再次访问 cValue.value时，此时this._dirty 为 true, 这时候会调用 getter
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })
})
