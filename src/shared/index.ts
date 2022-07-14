export const extend = Object.assign

export function isObject(obj: any) {
  return obj !== null && typeof obj === 'object'
}

//  hasChanged 是否改变
export const hasChanged = (newValue, value) => {
  // 如果它们相等 ，返回 false
  return !Object.is(newValue, value)
}
