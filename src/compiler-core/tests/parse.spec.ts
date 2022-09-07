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



  // 增加测试
  // 在没有写结束标签时，应该抛出错误 

  /**
   * 出现问题：会一直循环，不会停止， 死循环 
   * - 在 isEnd() 中没有判断结束标签 </ 然后结束循环，找不到 span 标签结束标签 所以会一直死循环 
   * 
   * 解决：
   *  1. 使用 [] 栈，在进行 解析 context.source 时，收集标签 
   *  2. 当解析好 element.children = parseChildren() 的逻辑完后，从 [] 中弹出标签 
   *  3. 在 isEnd() 时使用 [] 中的数据， 当匹配到结束标签时， 判断[]中的tag 是否存在 和正在解析的标签， 如果有就返回true , 让循环 结束 
   *  4. 在parseElement 中判断  标签不匹配时，在 parseTag 出错， 增加判断，如果匹配上标签 才执行 parseTag，如果没有匹配上，抛出错误
   */
  test('should throw error when lack end tag', () => {
    // 查看报的什么错 
    // baseParse("<div><span></div>")

    expect(() => {
      baseParse("<div><span></div>")
    }).toThrow("缺少结束标签:span")
  })
})
