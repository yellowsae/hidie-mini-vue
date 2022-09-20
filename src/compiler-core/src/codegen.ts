import { isString } from "../../shared"
import { NodeTypes } from "./ast"
import { CREATE_ELEMENT_BLOCK, helperMapName, TO_DISPLAY_STRING } from "./runtimeHelpers"



export function generate(ast) {

  // 实现根据 ast 生成的 render 函数

  // 重构 
  // - code 过多 
  // - += 过多
  // 实现一个全局上下文对象 保存 code
  const context = createCodegenContext()
  const { push } = context

  /**
   *   // 解析编译插值 
      // 1. 实现导入 Vue 模块函数 
      // import { toDisplayString as _toDisplayString } from "vue"
      const VueBinding = "vue"
      // const helpers = ['toDisplayString']  
      // helpers 应该存放到 transform 的逻辑上 , 绑定到 ast 树的根节点上 
      // 重命名 
      const aliasHelper = (s) => `${s} as _${s}`
      // 改为使用 ast.helpers 
      push(`import { ${ast.helpers.map(aliasHelper).join(', ')} } from "${VueBinding}"`)
      push('\n')
      // 伪实现
      // push(`import { toDisplayString as _toDisplayString } from "vue"`)  
      // 定义code -> 最终返回 
      // let code = ""
      // code += 'return '
      push('return ')
   */
  // 重构
  getFunctionPreamble(ast, context)


  // 函数名
  const functionName = "render"
  // 参数 
  const args = ['_ctx', '_cache']

  // 把 array 转为 string 
  const signature = args.join(', ')


  // 重构 
  push(`function ${functionName}(${signature}) {`)
  push(`return `)
  genNode(ast.codegenNode, context)
  push("}")
  // // 拼接函数
  // code += `function ${functionName}(${signature}) {`
  // // 函数体的内容 - 基于 ast 实现 
  // code += `return `
  // // const node = ast.children[0]
  // // 改为由 transform 提供的根节点 - 而不是 直接 取出 ast.children[0]
  // // 抽离 返回内容的逻辑 为一个函数 
  // code = genNode(code, ast)
  // // const node = ast.codegenNode
  // // code += `'${node.content}'`

  // // 尾部 }
  // code += '}'



  // 返回 code
  return {
    code: context.code
  }

  // 伪实现 
  // 返回 
  // return {
  //   code: `
  //   return function render(_ctx, _cache, $props, $setup, $data, $options) {
  //     return "hi 11"
  //   }    
  //   `
  // }
}



// 处理 编译器 头部导入模块的逻辑 
function getFunctionPreamble(ast, context) {
  const { push } = context
  const VueBinding = "Vue"
  // const helpers = ['toDisplayString']  
  // helpers 应该存放到 transform 的逻辑上 , 绑定到 ast 树的根节点上 
  // 重命名 
  const aliasHelper = (s) => `${helperMapName[s]}: _${helperMapName[s]}`
  // 改为使用 ast.helpers 

  // 判断 ast.helpers -> 因为 处理 text 不需要 导入 
  if (ast.helpers.length > 0) {
    push(`const { ${ast.helpers.map(aliasHelper).join(', ')} } = ${VueBinding}`)
  }
  push('\n')
  // 伪实现
  // push(`import { toDisplayString as _toDisplayString } from "vue"`)
  // 定义code -> 最终返回 
  // let code = ""
  // code += 'return '
  push('return ')
}




// 抽离 render 返回内容的逻辑 
// function genNode(code, ast) {
//   const node = ast.codegenNode
//   code += `'${node.content}'`
//   return code
// }
// 重构
function genNode(node, context) {

  // 使用 switch 根据类型 处理其他逻辑
  switch (node.type) {
    // 处理 text 
    case NodeTypes.TEXT:
      genText(node, context)
      break;

    // 插值 + Text {{message}}
    case NodeTypes.STATEFUL_COMPONENT:
      genExpression(node, context)
      break;
    // 处理 插值 
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context)
      break;

    // 处理 Element
    case NodeTypes.ELEMENT:
      genElement(node, context)
      break;


    // 处理中间层 compound 
    case NodeTypes.COMPOUND_EXPRESSION:
      genCompoundExpression(node, context)
      break;
  }

}

// 处理中间层 
function genCompoundExpression(node, context) {
  const { push } = context
  // compound.children -> 一个数组
  const children = node.children

  // for 循环 
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    // 判断当前节点是不是一个 string 
    // 也就是 判断是不是 + 号
    if (isString(child)) {
      push(child)
    } else {
      // 如果不是 + 号 ， 那就是 text | 插值 
      // 执行 genNode 递归调用就行
      genNode(child, context)
    }
  }
}


// 处理 render 函数返回值为 Element  
function genElement(node, context) {
  const { push, helper } = context
  // 取出children
  // 取出 props
  const { tag, children, props } = node
  // push(`${helper(CREATE_ELEMENT_BLOCK)}("${tag}")`)

  /**
   * 根据 element 的 children 生成 children 的逻辑
   * - 可以循环 children, 然后递归遍历 genNode 
   * - 出现问题
   *   - 拼接时候少了 + 号 和 _ctx
   * - 解决： 可以声明一个新的节点类型 ， 在element下面生成 (中间层类型 compound)， text 和 插值 的组合, 然后处理这个类型时候 添加上 + 号
   *    
   *   - 实现: 在 transformText 中处理 , 添加中间层 
   */
  // console.log('children', children)
  // 不需要下边的循环了， 改为 children[0] 中间层
  // const child = children[0]

  // 重构 element的 children  -> 让它赋值为 node.children


  // 实现三种联合解析 
  // push(`${helper(CREATE_ELEMENT_BLOCK)}("${tag}", null, 'hi, ' + _toDisplayString(_ctx.message))`)
  // push(`${helper(CREATE_ELEMENT_BLOCK)}("${tag}", ${props}, `)

  // 处理 tag | props | children 的逻辑
  push(`${helper(CREATE_ELEMENT_BLOCK)}(`)

  // 处理 props tag children 为 undefined 的情况
  // 如果是 undefined , 把它赋值为 null, 因为返回值是 [], 使用 genNodeList() 处理
  genNodeList(genNullable([tag, props, children]), context)


  // genNode(children, context)
  // for (let i = 0; i < children.length; i++) {
  //   const child = children[i]
  //   // 递归调用 genNode ->  switch 选中中间层 compound  -> 生成 + 号
  //   genNode(child, context)
  // }
  push(')')


  // 伪实现
  // push(`_createElementBlock("div")`)
}



// 处理 tag | props | children 的逻辑
function genNodeList(nodes, context) {
  const { push } = context
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    // 判断 
    if (isString(node)) {
      push(node)
    } else {
      genNode(node, context)
    }

    // 添加 ,
    if (i < nodes.length - 1) {
      push(', ')
    }
  }
}



// 处理 tag | props | children 是否为 undefined 的情况
function genNullable(args: any) {
  return args.map(arg => arg || 'null')
}


// 处理 {{messag}}-> 生成 render 函数的返回内容
function genExpression(node, context) {
  const { push } = context
  push(`${node.content}`)
}


// 处理 interpolation -> 插值类型 生成 render 函数返回的内容
function genInterpolation(node, context) {
  const { push, helper } = context
  // console.log('node', node)
  // console.log('context', context)

  push(`${helper(TO_DISPLAY_STRING)}(`)
  // 解析插值中的 message -> 也是 Text , 递归调用 genText 解析
  genNode(node.content, context)
  push(")")

  // 伪实现 
  // push(`_toDisplayString(_ctx.message)`)
}



// 处理 text -> 生成 render 函数的返回内容
function genText(node: any, context: any) {
  const { push } = context
  push(`'${node.content}'`)
}


// 创建 基于 code 的全局上下文对象
function createCodegenContext() {
  const context = {
    // 存入 code
    code: '',
    // += 的行为 
    push(source) {
      context.code += source
    },
    helper(key) {
      return `_${helperMapName[key]}`
    }
  }

  return context
}

