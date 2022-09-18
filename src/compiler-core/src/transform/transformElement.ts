

// 处理 添加 helper 函数的逻辑 

import { NodeTypes } from "../ast";
import { CREATE_ELEMENT_BLOCK } from "../runtimeHelpers";


export function transformElement(node, context) {
  if (node.type === NodeTypes.ELEMENT) {
    // 在这里加上 helper
    // 需要有一个 context


    // 返回一个函数， 也就是在 transform 需要收集的 退出函数 
    return () => {
      // 传入使用的常量  createElementBlock
      context.helper(CREATE_ELEMENT_BLOCK)


      // 中间处理层 



      // 1. tag 
      // tag 加上 ''  
      const vnodeTag = `'${node.tag}'`


      // 2. props 
      let vnodeProps;


      // 3. children

      const children = node.children
      // 中间层
      let vnodeChildren = children[0]



      // 4. 封装 element
      const vnodeElement = {
        type: NodeTypes.ELEMENT,
        tag: vnodeTag,
        props: vnodeProps,
        children: vnodeChildren
      }


      // 把 vnodeElement 赋值给 node ， 赋值到 codegenNode 上
      node.codegenNode = vnodeElement
    }
  }
}
