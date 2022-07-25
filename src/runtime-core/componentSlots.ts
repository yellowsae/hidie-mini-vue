import { ShapeFlags } from "../shared/ShapeFlags";

// 初始化 Slots
export function initSlots(instance, children) {

  // 将 children 赋值给 instance.slots

  // 如果不是 Array 类型，使用[] 包裹起来
  // instance.slots = Array.isArray(children) ? children : [children];


  // 进一步加工处理 
  // 此时具名插槽的处理 让 children 变为了 Object 

  // const slots = {} // 初始
  // // 循环这个 children 对象
  // for (const key in children) {
  //   // 通过属性拿到值 -> 对应的 VNode  
  //   const value = children[key];

  //   // 给slots赋值
  //   // 如果 value 
  //   slots[key] = normalizeSlotValue(value)
  // }
  // // 最后赋值给 instance.slots
  // instance.slots = slots;
  // console.log(instance)


  // 重构 
  // 并不是所有的节点都是具有 slots 的
  // 所以需要一个 判断逻辑 和 ShapeFlags 进行的判断一样 
  // 1. 在初始化 ShapeFlags 时, 添加判断 slots 是否存在 的逻辑
  // 2. 添加 Slots 的状态 到 ShapeFlags 中
  // 3. 判断当前节点是否具有 slots

  const { vnode } = instance

  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    // 执行 slot 的逻辑
    // 再次重构 
    normalizeObjectSlots(children, instance.slots)
  }


}

// 实现赋值
function normalizeObjectSlots(children, slots) {
  for (const key in children) {
    const value = children[key];

    // 实现作用域插槽逻辑
    // 这里拿到 value 是一个函数
    // 需要进行调用， 实现传参
    slots[key] = (props) => normalizeSlotValue(value(props))
  }
}


// 重构
function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value]
}
