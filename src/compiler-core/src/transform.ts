import { NodeTypes } from "./ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";

/**
 * 实现：
 *  1. 使用深度优先遍历 节点树
 *  2. 深度优先遍历 搜索 需要修改的 text 
 *  3. 修改 text 的内容   
 */
export function transform(root, options = {}) { // root 根节点 
  // 传入options -> 用于修改数据的 
  // 使用创建一个全局上下文对象 -> 和实现 baseParse 的一样
  const context = createTransformerContext(root, options);



  // 1. 深度优先遍历
  // 传入全局上下文呢对象 context , 为下边使用
  traverseNode(root, context)

  // 2. 修改 content 的内容 


  // 创建一个 childrenRoot, 设置 root的根节点 
  // 在 codegen 使用 
  createRootCodegen(root)



  // 给 root 根节点 赋值 helpers 
  // [] =  ...context.helpers.keys()  map 中所有的 key 返回一个数组, 方便再 codegen 使用
  root.helpers = [...context.helpers.keys()]
}

function createRootCodegen(root) {

  const child = root.children[0]
  // 判断 child 是否为 Element
  if (child.type === NodeTypes.ELEMENT) {
    root.codegenNode = child.codegenNode
  } else {
    // 设置 root.children[0]  根节点 -> 在 codegen 使用 
    root.codegenNode = root.children[0]
  }
}

// 全局上下文对象 context
function createTransformerContext(root, options) {
  // 建立一个 context  {}
  const context = {
    // 存入 root 和 nodeTransformer
    root,
    nodeTransformer: options.nodeTransformer || [],
    helpers: new Map(),
    // 把 toDisplayString 方法 存放到 map 上
    helper: (key) => {
      context.helpers.set(key, 1)
    }
  }
  return context
}


function traverseNode(node: any, context) {
  // 输出 
  // console.log(node)

  // 2. 修改 content 
  // 判断 node.type 的类型 是不是Text 
  // 程序变动点 
  // 不能这么直接写死 , 需要改为 动态设计 
  // if (node.type === NodeTypes.TEXT) {
  //   // 修改数据 
  //   node.content = node.content + "mini-vue"
  // }
  // 改为使用 nodeTransformer
  // 取出 nodeTransformer 
  const nodeTransformer = context.nodeTransformer
  // for 循环 遍历 
  for (let i = 0; i < nodeTransformer.length; i++) {
    // 取出 修改数据的函数 
    const transform = nodeTransformer[i]
    // 调用 
    // 并且把 node 节点传给 修改数据的函数
    transform(node, context)
  }
  // 修改 element

  // 实现 给 helpers 赋值 
  switch (node.type) {
    // 当 node.type 为插值时 
    case NodeTypes.INTERPOLATION:
      // 因为不能保证 此时的 node 为根节点 , 所以把 helpers 赋值到 context 上 
      context.helper(TO_DISPLAY_STRING)
      break
    case NodeTypes.ELEMENT:
    case NodeTypes.ROOT:
      // 遍历 children , 因为只有  Element 和 Root 才有 children
      traverseChildren(node, context)
  }



  // // 重构 抽离 处理 深度优先遍历的 children 逻辑 
  // traverseChildren(node, context)
  // let children = node.children

  // // 当 node.children 有值时
  // // 递归执行深度优先遍历 - 程序稳定点
  // if (node.children) {
  //   // 循环 children
  //   for (let i = 0; i < children.length; i++) {
  //     // 取值
  //     const node = children[i]
  //     // 递归 
  //     traverseNode(node, context)
  //   }
  // }
}

function traverseChildren(node, context) {
  // 重构 抽离 处理 深度优先遍历的 children 逻辑 
  const children = node.children

  // 当 children 有值时
  // 递归执行深度优先遍历 - 程序稳定点
  if (children) {
    // 循环 children
    for (let i = 0; i < children.length; i++) {
      // 取值
      const node = children[i]
      // 递归 
      traverseNode(node, context)
    }
  }
}
