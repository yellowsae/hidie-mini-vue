

// 实现中间层的逻辑 

import { NodeTypes } from "../ast";

export function transformText(node, context) {

  function isText(node) {
    return node.type === NodeTypes.TEXT || node.type === NodeTypes.INTERPOLATION
  }


  // 当是 element 类型时， 才会添加中间层
  if (node.type === NodeTypes.ELEMENT) {


    const { children } = node

    // 定义一个容器，用于收集 对应的数据
    let currentContainer


    for (let i = 0; i < children.length; i++) {
      // 拿到 child
      const child = children[i]

      // 1. 判断 它是 text 还是 插值 
      if (isText(child)) {
        // 2. 如果是 text , 才会查看它的 下一个(相邻节点) 是不是 插值 ， 如果是 创建中间层， 把它们收集起来 , 才能用 + 拼接

        for (let j = i + 1; j < children.length; j++) {
          // 获取到 child 的下一个节点 
          const next = children[j]

          // 再次判断 node
          if (isText(next)) {
            // 如果是, 进行收集 , 创建对应的容器

            // 初始化
            if (!currentContainer) {
              // 把 text 节点 替换为 中间层 compound
              // 中间层
              currentContainer = children[i] = {
                // 声明也需要和 节点一样 
                type: NodeTypes.COMPOUND_EXPRESSION,
                // 内容 存入 children 中
                children: [
                  child
                ]
              }
            }

            // push + 号 
            currentContainer.children.push(` + `)
            // 后续 只需要改变 children 内容
            currentContainer.children.push(next)

            // 删除 next
            children.splice(j, 1)
            j--

          } else {
            // 如果不是 text 或 插值
            // 停止收集 
            currentContainer = undefined
            break
          }
        }
      }
    }
  }
}
