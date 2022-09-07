
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
  // 初始， 传入 ""
  // 改为 [] 模拟栈，把标签传入进去 
  return createRoot(parseChildren(context, []))
}



// 3. 继续抽离 children 
function parseChildren(context, ancestors) {  // 传入 parseTag 解析好的标签
  // 接收 context -> 后续处理 基于 context 生成 节点树
  // 功能： 返回一个数组 ，  [children]


  // 1. 定义一个 节点树 -> 也叫 抽象语法树
  const nodes: any = []


  // 3. 当解析完 text 后，后面还有内容: {{message}}</div>
  // 这里定义一个死循环，让它一直去解析后面的内容 
  // 当 source 没有值时候结束循环
  // 当 遇到 </div> 结束标签时候 停止循环
  // 使用 isEnd() 封装
  // 传入 parseTag 解析好的标签
  while (!isEnd(context, ancestors)) {
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
        node = parseElement(context, ancestors)
      }
    }


    // 默认 解析 Text , 当没有命中 Element 和 插值 时，解析 Text
    if (!node) { // 如果 node 没有值时，解析 Text
      node = parseText(context)
    }

    // 把生成的节点添加到 节点树 中 
    nodes.push(node)
  }

  // 最后返回 nodes -> 交给 createRoot 
  return nodes
}

// 判断是否循环的函数
function isEnd(context, ancestors) {
  // 2. 当 遇到 </div> 结束标签时候 停止循环
  let s = context.source

  // 使用 ancestors 栈中的数据 
  // 当解析到 结束标签时 
  if (s.startsWith("</")) {
    // 与 ancestors 中的数据进行对比 
    for (let i = 0; i < ancestors.length; i++) {
      const tag = ancestors[i].tag

      // 截取出 div  对比  tag  
      if (s.slice(2, 2 + tag.length) === tag) {
        return true
      }
    }
  }


  /** 
   * 因为这里是写死的标签 </div> 
   * 分析：这个div 是 解析 element.children 时 一开始的 <$>, 所以可以基于这个开始的标签 进行验证
   * 解决： 在  解析 element.children 传入解析好的 element.tag
   * 
  */
  //  改为 parseTag
  // 当 parseTag 为空时不用管
  // if (parseTag && s.startsWith(`</${parseTag}>`)) {
  //   // if (s.startsWith("</div>")) {
  //   // 返回 true
  //   return true
  // }
  // 1. 当 source 有值时候，返回 false
  return !context.source

}

// 解析 Text 的逻辑 
function parseText(context) {
  // 2. 增加 解析 Text 的判断 
  // 默认的解析 还是以 context.source.length 去获取 Text
  let endIndex = context.source.length
  // 如果 context.source 有 {{

  // 解决 context.source 中有嵌套标签的逻辑
  // 增加 < 
  let endTokens = ["<", "{{"]

  // 循环 判断
  for (let i = 0; i < endTokens.length; i++) {
    // 判断 context.source 中是否有 {{ 
    let index = context.source.indexOf(endTokens[i])
    // 如果 context.source 中同时有 < 和 {{,  尽可能往左取
    if (index !== -1 && endIndex > index) {
      // 如果 text 有 {{
      // 修改 endIndex 的值  
      endIndex = index
    }

  }



  // 1. 获取 content 内容 
  // 值就是 context.source
  // const content = context.source.slice(0, context.source.length);
  // 替换 index
  const content = context.source.slice(0, endIndex);
  // 此时解析出来的 content 为, hi, {{message}}</div>
  // 进行完 第二步 完， content 解析到 hi, 
  // console.log("-------", content);

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
function parseElement(context: any, ancestors) {
  // console.log(context)   // 传入 { source: '<div></div>' }
  // 抽离解析 Element 的逻辑
  // 添加解析的类型
  const element: any = parseTag(context, TagType.Start)


  // 收集 tag 到 栈 ancestors 中
  ancestors.push(element)

  // 1. element 具有 children ，因为 element 可能是嵌套的
  // 所以 这里 递归调用 parseChildren 
  // 传入 解析好的 element.tag 
  element.children = parseChildren(context, ancestors)

  // 当解析好 tag 后，把栈中 对应的的数据 弹出来 
  ancestors.pop()



  // 当标签不匹配时，在 parseTag 出错 
  // 因为 开始标签 和 结束标签 不一致 
  // console.log("-----", element.tag, context.source) // ----- span </div>
  // 增加判断，如果匹配上标签 才执行 parseTag 
  if (context.source.slice(2, 2 + element.tag.length) === element.tag) {
    // 二次解析 Element 的逻辑 
    parseTag(context, TagType.End)
    // console.log(context.source)  // 删除全部标签代码 
  } else {
    // 如果标签不匹配 , 抛出错误 
    throw new Error(`缺少结束标签:${element.tag}`)
  }


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
