// 整个mini-vue 的出口


// 因为 runtime-dom 是 runtime-core 的上一层 
// 所以导出的先后顺序 是 runtime-dom -> runtime-core


// 把 runtime-core 放到 runtime-dom 中
// export * from './runtime-core'

// 导出 runtime-dom
export * from "./runtime-dom"
