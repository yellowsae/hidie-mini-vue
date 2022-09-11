


export function generate(ast) {

  // 实现根据 ast 生成的 render 函数

  // 定义code -> 最终返回 
  let code = ""
  code += 'return '

  // 函数名
  const functionName = "render"
  // 参数 
  const args = ['_ctx', '_cache']

  // 把 array 转为 string 
  const signature = args.join(', ')

  // 拼接函数
  code += `function ${functionName}(${signature}) {`
  // 函数体的内容 - 基于 ast 实现 
  code += `return `
  // const node = ast.children[0]
  // 改为由 transform 提供的根节点 - 而不是 直接 取出 ast.children[0]
  // 抽离 返回内容的逻辑 为一个函数 
  code = genNode(code, ast)
  // const node = ast.codegenNode
  // code += `'${node.content}'`

  // 尾部 }
  code += '}'



  // 返回 code
  return {
    code
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


// 抽离 render 返回内容的逻辑 
function genNode(code, ast) {
  const node = ast.codegenNode
  code += `'${node.content}'`
  return code
}
