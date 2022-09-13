

// 实现 _ctx 的引入使用 
// 在调用 transfrom() 时 传入给 option， 用于替换 _ctx

import { NodeTypes } from "../ast";


// 在  transfrom() 遍历递归 children 时 会调用  
export function transfromExpression(node) {


  // 1. 不会直接触发
  // 2. 触发时候 node 应该包在插值 里面 
  if (node.type === NodeTypes.INTERPOLATION) {
    // 获取 message -
    // const rawContent = node.content.content

    //  赋值 _ctx.message
    // node.content.content = "_ctx." + rawContent


    // 重构 
    node.content = processExpresstion(node.content)
  }
}
function processExpresstion(node: any) {
  node.content = `_ctx.${node.content}`
  return node
}

