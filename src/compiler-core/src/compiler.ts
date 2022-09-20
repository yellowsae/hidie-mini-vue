import { generate } from "./codegen"
import { baseParse } from "./parse"
import { transform } from "./transform"
import { transformElement } from "./transform/transformElement"
import { transfromExpression } from "./transform/transformExpression"
import { transformText } from "./transform/transformText"






// 导出 compiler 模块的内容
// 接收 template -> 然后编译为 render 函数
export function baseCompiler(template: string) {

  // 直接把 测试的内容拿过来
  const ast: any = baseParse('<div>hi, {{message}}</div>')

  transform(ast, {
    nodeTransformer: [transfromExpression, transformElement, transformText]
  })


  // 返回编译好的 { code }
  return generate(ast)
  // const { code } = generate(ast)

}
