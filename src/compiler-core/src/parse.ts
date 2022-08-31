
// 初始化 compiler-core 的主函数流程 

import { NodeTypes } from "./ast"


const enum TagType {
  Start,
  End
}

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
  // 重构 - 简化 context.source
  let s = context.source
  // 增加 判断，当 context.source 是以 {{ 开头 时在进行插值的替换
  if (s.startsWith("{{")) {
    // 2. 调用 parseInterpolation() 返回出来的节点
    // 传入 context
    node = parseInterpolation(context)
  } else if (s[0] === '<') {
    // 判断 Element 并且解析 Element 的逻辑 

    // 判断第二个字符 是否是 a-z
    if (/[a-z]/i.test(s[1])) {
      // console.log("parse Element") // 命中 
      // 解析 Element 的逻辑
      // 把返回值放到 node 中
      node = parseElement(context)
    }
  }


  // 默认 解析 Text , 当没有命中 Element 和 插值 时，解析 Text
  if (!node) { // 如果 node 没有值时，解析 Text
    node = parseText(context)
  }

  // 把生成的节点添加到 节点树 中 
  nodes.push(node)

  // 最后返回 nodes -> 交给 createRoot 
  return nodes
}


// 解析 Text 的逻辑 
function parseText(context) {
  // 1. 获取 content 内容 
  // 值就是 context.source
  const content = context.source.slice(0, context.source.length);
  // console.log(content);

  // 2. 删除 解析后的 text 
  advanceBy(context, content.length);
  // console.log(context.source)

  // 伪实现 
  return {
    // 类型
    type: NodeTypes.TEXT,
    // 解析出来的内容
    content,
  }
}


// 解析 Element 的逻辑
function parseElement(context: any) {
  // console.log(context)   // 传入 { source: '<div></div>' }
  // 抽离解析 Element 的逻辑
  // 添加解析的类型
  const element = parseTag(context, TagType.Start)

  // 二次解析 Element 的逻辑 
  parseTag(context, TagType.End)
  // console.log(context.source)  // 删除全部标签代码 

  // 返回解析好的 Element 对象
  return element
}


// 抽离 解析 tag 的逻辑 
function parseTag(context, type: TagType) {
  // 1. 解析 div   tag 
  // 通过正则 匹配 div
  const match: any = /^<\/?([a-zA-Z][^\s/>]*)/.exec(context.source)

  // console.log(match)  // 1. <div  2. </div
  const tag = match[1]


  // 2. 删除处理完成的代码 
  advanceBy(context, match[0].length)

  advanceBy(context, 1)

  // 如果类型 === 结束标签 直接返回 
  if (type === TagType.End) return

  return {
    type: NodeTypes.ELEMENT,
    // 替换
    tag
  }
}


// 4，抽离解析 插值 {{}} 的内容 
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
