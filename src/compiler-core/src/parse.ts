
// 初始化 compiler-core 的主函数流程 

import { NodeTypes } from "./ast"


// 导出 baseParse 函数 - 并且接收 content 模板的字符串 {{message}} 
export function baseParse(content: string) {

  // 1. 定义一个 context 全局上下文对象
  // 传入 "{{messages}}" 这个字符串 
  const context = createParseContext(content)

  // 2. 把根节点这个概念抽离为函数 
  // parseChildren 传入 context
  return createRoot(parseChildren(context))
}



// 3. 继续抽离 children 
function parseChildren(context) {
  // 接收 context -> 后续处理 基于 context 生成 节点树
  // 功能： 返回一个数组 ，  [children]


  // 1. 定义一个 节点树 -> 也叫 抽象语法树
  const nodes: any = []

  let node;
  // 增加 判断，当 context.source 是以 {{ 开头 时在进行插值的替换
  if (context.source.startsWith("{{")) {
    // 2. 调用 parseInterpolation() 返回出来的节点
    // 传入 context
    node = parseInterpolation(context)
  }

  // 把生成的节点添加到 节点树 中 
  nodes.push(node)

  // 最后返回 nodes -> 交给 createRoot 
  return nodes
}


// 4，抽离解析 节点树的内容 
function parseInterpolation(context) {


  // 因为这个的 message 是写死的，并且生成 节点
  // 目标：去除 {{ }} 拿到 message

  // 定义一个变量 为 {{  }}
  const openDelimiter = "{{"
  const closeDelimiter = "}}"
  // 1. 查找 }} 的索引 
  // indexOf("}}", 2) 查找 }}  从{{ 的位置开始查找
  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)

  // 2. 删除 {{  
  // 重构
  advanceBy(context, openDelimiter.length)
  // context.source = context.source.slice(openDelimiter.length)

  // 3. 通过 closeIndex 获取到 message 的长度 
  // -2 就是 减去 }} 的长度  
  const rawContextLength = closeIndex - openDelimiter.length // 得到 message 的长度 

  // 4. 获取 messages
  const rawContent = context.source.slice(0, rawContextLength)
  // 6 去除 " message " 的空格 空格 
  const content = rawContent.trim()


  // 5. 删除 }}
  // 重构
  advanceBy(context, rawContextLength + closeDelimiter.length)
  // context.source = context.source.slice(rawContextLength + closeDelimiter.length)



  return {
    // 解析的插值
    // 类型
    // 因为类型都是字符串的， 可以通过枚举重构 
    // type: "interpolation",
    type: NodeTypes.INTERPOLATION,
    // 内容
    content: {
      // message 的类型
      type: NodeTypes.STATEFUL_COMPONENT,
      // content 内容就是 message
      // content: "message"
      // 替换 动态的 message
      content: content
    }
  }
}


// 重构删除 字符串的逻辑
function advanceBy(context: any, length: number) {
  context.source = context.source.slice(length)
}

// 2. 把根节点这个概念抽离为函数 
// 根节点对象 
function createRoot(children) {
  // 功能 : 返回一个对象， 这个对象具有一个 children
  return {
    children
  }
}

// 1. 定义一个 context 全局上下文对象
// 用于处理  "{{messages}}"
function createParseContext(content: string): any {
  // 功能 : 返回一个对象 
  // 这个对象具有一个 source ； 并把 content 传入 source ， 后续更具 source 操作
  return {
    source: content
  }
}
