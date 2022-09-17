import { generate } from "../src/codegen"
import { baseParse } from "../src/parse"
import { transform } from "../src/transform"
import { transformElement } from "../src/transform/transformElement"
import { transfromExpression } from "../src/transform/transformExpression"
import { transformText } from "../src/transform/transformText"


describe('codegen', () => {

  // 解析 string 
  it('string', () => {

    // hi 转为 render 返回的字符串 
    const ast = baseParse('hi')
    transform(ast)

    // 把 ast 树传给 generate() 
    const { code } = generate(ast)

    // 断言
    // 使用快照测试 -> 把 code 拍个照片， 然后进行对比
    // 1. 抓 bug 
    // 2.  更新 快照
    // 生成 snapshot 文件夹，存放 快照
    expect(code).toMatchSnapshot()
  })



  // 解析 插值 {{}}
  it('interpolation', () => {
    const ast = baseParse('{{ message }}')

    // 传入 需要生成 _ctx 的函数 
    transform(ast, {
      nodeTransformer: [transfromExpression]
    })
    // code 
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })


  // 实现 element
  it.skip('element', () => {
    const ast = baseParse('<div></div>')

    // 传入 需要生成 createElementBlock 的函数 
    transform(ast, {
      nodeTransformer: [transformElement]
    })
    // code 
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })


  // 实现 3 中联合类型 
  it('element', () => {
    const ast: any = baseParse('<div>hi, {{message}}</div>')

    // 传入 需要生成 createElementBlock 的函数 
    transform(ast, {
      // 换位 -> 最后才去执行 
      nodeTransformer: [transformText, transformElement]
    })

    // 检查看中间层 
    console.log('ast--------', ast, 'compound-------', ast.codegenNode.children)

    // code 
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })

})
