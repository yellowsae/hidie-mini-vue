// 测试 ShapeFlag 
const ShapeFlagObject = {

  // 这里使用 0 | 1 判断节点的状态 -> 0 表示不是 , 1 表示是
  element: 0,
  stateful_component: 0,
  text_children: 0,
  array_children: 0,
}


// 如果当前节点 vnode 是 stateful_component
// 设置 它的状态 
// 1. 可以设置修改 
// ShapeFlag.stateful_component = 1
// ShapeFlag.text_children = 1



// 需要先判断 之前的节点类型 ShapeFlag  
// 2. 查找 
// if (ShapeFlag.element)
// if (ShapeFlag.stateful_component)


// 使用对象的形式对比，不够高效 





// const ShapeFlag = {
//   element: 1,   // 转为二进制 -> 0001
//   stateful_component: 1 << 1, // 使用左移运算符 1 左移1位 -> 10 -> 转为二进制 -> 0010 
//   text_children: 1 << 2,  // 1 左移 2 位 -> 100 -> 转为二进制 -> 0100 
//   array_children: 1 << 3, // 1 左移 3 位 -> 1000 -> 转为二进制 -> 1000 
// }



// 可以通过 位运算方式 提升代码性能 
// 位运算-> 通过二进制 01 表示 当前节点的状态 

// 0000 
// 0001  -> element
// 0010  -> stateful_component
// 0100  -> text_children
// 1000  -> array_children


// 表示两种状态 
// 1010  ->  stateful_component  + array_children 


// 实现位运算方式 实现 修改 和 查找的功能

// 1. 修改 ： |   -> 两位都为 0 ，才为 0

// 0000  -> |  进行或运算
// 0001  
// ----
// 0001
// 修改 0000 为 0001 得到 0001 -> 修改初始时的0状态 为 element 


// 0001 -> |  进行或运算
// 0100
// ----
// 0101
// 修改 0001 为 0001 得到 0101 -> 修改 element 状态为 element + text_children 




// 2. 查找 ： &   -> 两位都为 0 , 才为 1

// &

// 0001 -> &  进行 & 运算
// 0001
// ----
// 0001
// 查找0001是不是0001类型 -> 得到 0001 表示是



// 0010 -> & 进行 & 运算  ->
// 0001
// ----
// 0000 
// 查找0010是不是0001 类型 -> 得到 0000 表示不是
