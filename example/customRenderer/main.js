
// 导入 createRender -> 自定义渲染器
import { createRenderer } from '../../lib/guide-mini-vue.esm.js'
import { App } from "./App.js"

// 打印 PIXI

const game = new PIXI.Application({
  width: 800,
  height: 600,
})

// 添加实例 
document.body.append(game.view)

// console.log(PIXI)
// 实现使用自定义渲染器 渲染 Canvas 

const renderer = createRenderer({
  createElement(type) {
    if (type === 'rect') {
      const rect = new PIXI.Graphics()
      rect.beginFill(0xFF0000)
      rect.drawRect(0, 0, 100, 100)
      rect.endFill()

      return rect
    }
  },

  patchProp(el, key, val) {
    el[key] = val
  },

  insert(el, parent) {
    // append
    parent.addChild(el)
  }
})

renderer.createApp(App).mount(game.stage)
