import { NodeTypes } from "../src/ast"
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
        // 替换为枚举
        type: NodeTypes.INTERPOLATION,
        // 内容
        content: {
          // message 的类型
          // 替换为枚举
          type: NodeTypes.STATEFUL_COMPONENT,
          // content 内容就是 message
          content: "message"
        }
      })
    })
  })


  describe("element", () => {

    it('simple element div', () => {
      const ast = baseParse("<div></div>")
      // 解析 element
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        children: []
      })
    })
  })



  // 解析 Text 的测试
  describe("Text", () => {

    it('simple text', () => {
      const ast = baseParse("some text")
      // 解析 element
      expect(ast.children[0]).toStrictEqual({
        // 类型
        type: NodeTypes.TEXT,
        // 解析出来的内容
        content: 'some text',
      })
    })
  })


  // 解析三种联合类型 
  // <div>hi, {{message}}</div>
  test("hello world", () => {
    const ast = baseParse("<div>hi, {{message}}</div>")

    // 应该返回 root 树
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: "div",
      children: [
        {
          type: NodeTypes.TEXT,
          content: "hi, "
        },
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.STATEFUL_COMPONENT,
            content: "message"
          }
        }
      ]
    })
  })


  // 测试联合解析 类型的其他情况 
  /**
   * 问题出现在 解析到<p></p> 时，parseText没有写 匹配解析 context.source 中有嵌套标签的逻辑， 
   * 只是写了 {{ 的判断， 而没有写<p> 的判断 
   * 
   * 解决： 在 parseText 解析是 增加 解析 < 的逻辑 
   */
  test("Nested element", () => {
    const ast = baseParse("<div><p>hi</p>{{message}}</div>")

    // 应该返回 root 树
    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: "div",
      children: [
        {
          type: NodeTypes.ELEMENT,
          tag: "p",
          children: [
            {
              type: NodeTypes.TEXT,
              content: "hi"
            },
          ]
        },
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.STATEFUL_COMPONENT,
            content: "message"
          }
        }
      ]
    })
  })
})
