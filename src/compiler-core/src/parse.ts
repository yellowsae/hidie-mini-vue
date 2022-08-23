
// 初始化 compiler-core 的主函数流程 


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


  // 1. 定义一个 节点树 
  const nodes: any = []

  // 2. 调用 parseInterpolation() 返回出来的节点
  const node = parseInterpolation()

  // 把生成的节点添加到 节点树 中 
  nodes.push(node)

  // 最后返回 nodes -> 交给 createRoot 
  return nodes
}


// 4，抽离解析 节点树的内容 
function parseInterpolation() {

  return {
    // 解析的插值
    // 类型
    type: "interpolation",
    // 内容
    content: {
      // message 的类型
      type: "simple_expression",
      // content 内容就是 message
      content: "message"
    }
  }
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
