import { track, trigger } from "./effect"

// 导出 reactive() 函数
// 接收的响应式对象参数 raw
export function reactive(raw) { 

  // 返回一个 Proxy 代理对象，代理 raw 属性
  return new Proxy(raw, {
    // 当读取对象属性触发 get() 操作
    get(target, key) {
      // 使用 Reflect() 反射 读取的值
      let Res = Reflect.get(target, key)

      // TODO: 收集依赖, 重点是执行收集的依赖
      track(target, key)
      return Res  // 把读取的属性值返回出去
    },

    // 当数据变化时触发 set() 操作
    set(target, key, value) {
      // 修改变化的数据
      let Res = Reflect.set(target, key, value)
      
      // TODO: 触发依赖  这个核心
      trigger(target, key)
      return Res
    }
  })
}
