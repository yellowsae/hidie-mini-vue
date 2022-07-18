
// 引入打包后的 createApp 
import { createApp } from '../../lib/guide-mini-vue.esm.js'
import { App } from "./App.js"
// 正常使用 vue3 一样

// 获取容器
const rootContainer = document.querySelector("#app")
createApp(App).mount(rootContainer)
