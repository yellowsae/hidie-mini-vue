import { baseParse } from "../src/parse"


//  Parse 的测试 


describe('Parse', () => {

  // interpolation
  describe('interpolation', () => {

    // 编译模板生成 节点树 
    // 目标： {{message}}  -> 编译生成 节点树
    test("simple interpolation", () => {

      // baseParse 接收模板 
      // 返回的 ast
      const ast = baseParse("{{ message }}")
      // root 
      // 其中 ast 包含一个 children 的 Array ， children[0] 为  {}
      expect(ast.children[0]).toStrictEqual({
        // 类型
        type: "interpolation",
        // 内容
        content: {
          // message 的类型
          type: "simple_expression",
          // content 内容就是 message
          content: "message"
        }
      })
    })
  })
})
