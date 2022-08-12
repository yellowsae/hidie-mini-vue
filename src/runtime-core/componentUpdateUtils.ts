
// 判断组件是否更新的逻辑 
export function shouldUpdateComponent(prevVNode, nextVNode) {

  // 1. 获取props 
  const { props: prevProps } = prevVNode
  const { props: nextProps } = nextVNode

  // 2. 循环对比 
  for (const key in nextProps) {
    // 如果它们的 props key 不相等时，返回 true 
    if (nextProps[key] !== prevProps[key]) {
      return true
    }
  }

  return false
}
