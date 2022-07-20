// 实现 ShapeFlag


// 1. 声明 ShapeFlag 状态 ,  使用枚举 并导出 ShapeFlags
export const enum ShapeFlags {
  ELEMENT = 1,   // 转为二进制 -> 0001
  STATEFUL_COMPONENT = 1 << 1, // 使用左移运算符 1 左移1位 -> 10 -> 转为二进制 -> 0010 
  TEXT_CHILDREN = 1 << 2,  // 1 左移 2 位 -> 100 -> 转为二进制 -> 0100 
  ARRAY_CHILDREN = 1 << 3, // 1 左移 3 位 -> 1000 -> 转为二进制 -> 1000 
}



// 2. 在初始化 vnode 时，声明 ShapeFlags, 给赋值类型  ——> vnode.ts



// 3. 在 renderer 中使用 ShapeFlags



// 位运算的方式 -> 提高性能 -> 但是可读性不高 
