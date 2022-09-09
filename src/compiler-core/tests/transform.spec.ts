import { NodeTypes } from '../src/ast'
import { baseParse } from '../src/parse'
import { transform } from '../src/transform'

describe('transform', () => {
  it("happly patch", () => {
    const ast = baseParse('<div>hi, {{message}}</div>')

    // 把 需要修改数据的逻辑 抽离到 这里 
    const plugin = (node) => {
      if (node.type === NodeTypes.TEXT) {
        // 修改数据 
        node.content = node.content + "mini-vue"
      }
    }

    // 传入 transform 
    // transform 修改 hi, 为 hi, mini-vue
    // 接收一个 options
    transform(ast, {
      // 传入的 options
      // 具有一个 nodeTransformer 的数组,  []  把 要修改数据的 plugin 传入
      // transform 函数的执行 会去调用 plugin() 把 node 节点传回来
      // 这样就可以在外部，处理需要修改的节点 -> 
      // 在实现 runtime-core 时 导出的 createApp renderer 函数都使用了类似方法
      nodeTransformer: [plugin]
    })

    const nodeText = ast.children[0].children[0]
    expect(nodeText.content).toBe('hi, mini-vue')
  })
})
