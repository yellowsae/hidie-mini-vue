

// 处理 添加 helper 函数的逻辑 

import { NodeTypes } from "../ast";
import { CREATE_ELEMENT_BLOCK } from "../runtimeHelpers";


export function transformElement(node, context) {
  if (node.type === NodeTypes.ELEMENT) {
    // 在这里加上 helper
    // 需要有一个 context

    // 传入使用的常量  createElementBlock
    context.helper(CREATE_ELEMENT_BLOCK)
  }
}
