import { track, trigger } from "./effect"

export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      let Res = Reflect.get(target, key)

      // TODO: 收集依赖
      track(target, key)
      return Res
    },

    set(target, key, value) {
      let Res = Reflect.set(target, key, value)
      
      // TODO: 触发依赖
      trigger(target, key)
      return Res
    }
  })
}
